use std::{
    collections::HashSet,
    path::PathBuf,
    process::Stdio,
    sync::Arc,
    time::{Duration, Instant},
};

use tokio::{
    io::{AsyncRead, AsyncReadExt},
    process::Command,
    sync::Semaphore,
    time::timeout,
};

use crate::{
    contains_disallowed_control_chars,
    path_policy::{PathKind, PathPolicy},
    BridgeError, TerminalExecRequest, TerminalExecResponse,
};

const DEFAULT_TERMINAL_MAX_CONCURRENT: usize = 4;
const DEFAULT_TERMINAL_MAX_OUTPUT_BYTES: usize = 256 * 1024;
const OUTPUT_READ_CHUNK_SIZE: usize = 8 * 1024;

#[derive(Clone)]
pub(crate) struct TerminalService {
    path_policy: Arc<PathPolicy>,
    allowed_commands: HashSet<String>,
    disabled: bool,
    concurrency_limiter: Arc<Semaphore>,
}

impl TerminalService {
    pub(crate) fn new(
        path_policy: Arc<PathPolicy>,
        allowed_commands: HashSet<String>,
        disabled: bool,
    ) -> Self {
        Self {
            path_policy,
            allowed_commands,
            disabled,
            concurrency_limiter: Arc::new(Semaphore::new(DEFAULT_TERMINAL_MAX_CONCURRENT)),
        }
    }

    pub(crate) async fn execute_shell(
        &self,
        request: TerminalExecRequest,
    ) -> Result<TerminalExecResponse, BridgeError> {
        if self.disabled {
            return Err(BridgeError::forbidden(
                "terminal_exec_disabled",
                "Terminal execution is disabled on this bridge.",
            ));
        }

        let command = request.command.trim();
        if command.is_empty() {
            return Err(BridgeError::invalid_params("command must not be empty"));
        }

        if contains_disallowed_control_chars(command) {
            return Err(BridgeError::invalid_params(
                "command contains disallowed control characters",
            ));
        }

        let tokens = shlex::split(command)
            .ok_or_else(|| BridgeError::invalid_params("invalid command quoting"))?;
        if tokens.is_empty() {
            return Err(BridgeError::invalid_params("command must not be empty"));
        }

        let binary = tokens[0].clone();
        if !self.allowed_commands.is_empty() && !self.allowed_commands.contains(&binary) {
            let mut allowed = self.allowed_commands.iter().cloned().collect::<Vec<_>>();
            allowed.sort();
            return Err(BridgeError::invalid_params(&format!(
                "Command \"{binary}\" is not allowed. Allowed commands: {}",
                allowed.join(", ")
            )));
        }

        let args = tokens[1..].to_vec();
        let cwd = self.path_policy.resolve_cwd(request.cwd.as_deref())?;

        self.execute_binary_internal(
            binary.as_str(),
            &args,
            command.to_string(),
            cwd,
            request.timeout_ms,
        )
        .await
    }

    pub(crate) async fn execute_binary(
        &self,
        binary: &str,
        args: &[String],
        cwd: PathBuf,
        timeout_ms: Option<u64>,
    ) -> Result<TerminalExecResponse, BridgeError> {
        let cwd = self
            .path_policy
            .resolve_existing(cwd.to_string_lossy().as_ref(), PathKind::Directory)?;

        let display = std::iter::once(binary.to_string())
            .chain(args.iter().cloned())
            .collect::<Vec<_>>()
            .join(" ");

        self.execute_binary_internal(binary, args, display, cwd, timeout_ms)
            .await
    }

    async fn execute_binary_internal(
        &self,
        binary: &str,
        args: &[String],
        display_command: String,
        cwd: PathBuf,
        timeout_ms: Option<u64>,
    ) -> Result<TerminalExecResponse, BridgeError> {
        let _permit = self
            .concurrency_limiter
            .clone()
            .acquire_owned()
            .await
            .map_err(|_| BridgeError::server("terminal concurrency limiter is closed"))?;
        let timeout_ms = timeout_ms.unwrap_or(30_000).clamp(100, 120_000);
        let started_at = Instant::now();

        let mut child = Command::new(binary)
            .args(args)
            .current_dir(&cwd)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|error| BridgeError::server(&format!("failed to spawn command: {error}")))?;

        let stdout = child
            .stdout
            .take()
            .ok_or_else(|| BridgeError::server("failed to capture stdout"))?;
        let stderr = child
            .stderr
            .take()
            .ok_or_else(|| BridgeError::server("failed to capture stderr"))?;

        let stdout_task = tokio::spawn(async move {
            read_stream_limited(stdout, DEFAULT_TERMINAL_MAX_OUTPUT_BYTES).await
        });

        let stderr_task = tokio::spawn(async move {
            read_stream_limited(stderr, DEFAULT_TERMINAL_MAX_OUTPUT_BYTES).await
        });

        let mut timed_out = false;
        let mut exit_code = None;
        let mut wait_error: Option<String> = None;

        match timeout(Duration::from_millis(timeout_ms), child.wait()).await {
            Ok(Ok(status)) => {
                exit_code = status.code();
            }
            Ok(Err(error)) => {
                wait_error = Some(error.to_string());
                exit_code = Some(-1);
            }
            Err(_) => {
                timed_out = true;
                let _ = child.kill().await;
                let _ = child.wait().await;
            }
        }

        let (stdout_bytes, stdout_truncated) = stdout_task.await.unwrap_or_default();
        let (stderr_bytes, stderr_truncated) = stderr_task.await.unwrap_or_default();

        let stdout_text = finalize_output(stdout_bytes, stdout_truncated);
        let mut stderr_text = finalize_output(stderr_bytes, stderr_truncated);
        if let Some(wait_error) = wait_error {
            if !stderr_text.is_empty() {
                stderr_text.push('\n');
            }
            stderr_text.push_str(&wait_error);
        }

        Ok(TerminalExecResponse {
            command: display_command,
            cwd: cwd.to_string_lossy().to_string(),
            code: exit_code,
            stdout: stdout_text,
            stderr: stderr_text,
            timed_out,
            duration_ms: started_at.elapsed().as_millis() as u64,
        })
    }
}

async fn read_stream_limited<R>(mut reader: R, max_bytes: usize) -> (Vec<u8>, bool)
where
    R: AsyncRead + Unpin,
{
    let mut bytes = Vec::new();
    let mut buffer = [0_u8; OUTPUT_READ_CHUNK_SIZE];
    let mut truncated = false;

    loop {
        let read = match reader.read(&mut buffer).await {
            Ok(0) => break,
            Ok(read) => read,
            Err(_) => break,
        };

        if bytes.len() < max_bytes {
            let remaining = max_bytes - bytes.len();
            let to_take = remaining.min(read);
            bytes.extend_from_slice(&buffer[..to_take]);
            if to_take < read {
                truncated = true;
            }
        } else {
            truncated = true;
        }
    }

    (bytes, truncated)
}

fn finalize_output(bytes: Vec<u8>, truncated: bool) -> String {
    let mut output = String::from_utf8_lossy(&bytes).trim_end().to_string();
    if truncated {
        if !output.is_empty() {
            output.push('\n');
        }
        output.push_str("[output truncated]");
    }
    output
}

#[cfg(test)]
mod tests {
    use super::{finalize_output, TerminalService};
    use crate::{path_policy::PathPolicy, TerminalExecRequest};
    use std::{collections::HashSet, fs, path::PathBuf, sync::Arc};
    use uuid::Uuid;

    struct TestDir(PathBuf);

    impl TestDir {
        fn new() -> Self {
            let path = std::env::temp_dir().join(format!("clawdex-terminal-{}", Uuid::new_v4()));
            fs::create_dir(&path).expect("create test directory");
            Self(path)
        }
    }

    impl Drop for TestDir {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.0);
        }
    }

    #[cfg(unix)]
    #[tokio::test]
    async fn terminal_rejects_symlink_cwd_escape_before_execution() {
        use std::os::unix::fs::symlink;

        let temp = TestDir::new();
        let root = temp.0.join("root");
        let outside = temp.0.join("outside");
        fs::create_dir(&root).expect("create root");
        fs::create_dir(&outside).expect("create outside");
        symlink(&outside, root.join("escape")).expect("create escape symlink");
        let policy = Arc::new(PathPolicy::new(root, false).expect("create policy"));
        let service = TerminalService::new(policy, HashSet::from(["pwd".to_string()]), false);

        let error = service
            .execute_shell(TerminalExecRequest {
                command: "pwd".to_string(),
                cwd: Some("escape".to_string()),
                timeout_ms: None,
            })
            .await
            .expect_err("reject terminal symlink escape");
        assert_eq!(error.code, -32602);
    }

    #[test]
    fn finalize_output_marks_truncated_streams() {
        assert_eq!(
            finalize_output(b"hello\n".to_vec(), true),
            "hello\n[output truncated]"
        );
    }
}
