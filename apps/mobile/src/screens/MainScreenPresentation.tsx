import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Keyboard, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { BrandMark } from '../components/BrandMark';
import type { ChatSummary, RunEvent } from '../api/types';
import { controlAccessibilityState, decorativeAccessibilityProps } from '../accessibility';
import type { AgentThreadDisplayState } from './agentThreadDisplay';
import { useAppTheme } from '../theme';
import { createStyles } from './mainScreenStyles';

interface AgentThreadPanelRow {
  chat: ChatSummary;
  title: string;
  description: string;
  runtime: AgentThreadDisplayState;
  selected: boolean;
  latestCommand?: RunEvent | null;
}






const SUGGESTIONS = [
  'Explain the current codebase structure',
  'Write tests for the main module',
];


export function ComposeView({
  startWorkspaceLabel,
  showAgentPicker,
  agentLabel,
  showModelControls,
  modelLabel,
  showThinkingControls,
  thinkingLabel,
  collaborationModeLabel,
  showFastMode,
  fastModeEnabled,
  fastModeLabel,
  keyboardVisible,
  bottomInset,
  onSuggestion,
  onOpenWorkspacePicker,
  onOpenAgentPicker,
  onOpenModelPicker,
  onOpenThinkingPicker,
  onOpenCollaborationModePicker,
  onToggleFastMode,
}: {
  startWorkspaceLabel: string;
  showAgentPicker: boolean;
  agentLabel: string;
  showModelControls: boolean;
  modelLabel: string;
  showThinkingControls: boolean;
  thinkingLabel: string;
  collaborationModeLabel: string;
  showFastMode: boolean;
  fastModeEnabled: boolean;
  fastModeLabel: string;
  keyboardVisible: boolean;
  bottomInset: number;
  onSuggestion: (s: string) => void;
  onOpenWorkspacePicker: () => void;
  onOpenAgentPicker: () => void;
  onOpenModelPicker: () => void;
  onOpenThinkingPicker: () => void;
  onOpenCollaborationModePicker: () => void;
  onToggleFastMode: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const contentContainerStyle =
    Platform.OS === 'android'
      ? [
          styles.composeContainer,
          keyboardVisible ? styles.composeContainerKeyboardOpen : null,
          { paddingBottom: bottomInset },
        ]
      : styles.composeContainer;

  return (
    <ScrollView
      style={styles.composeScroll}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={Keyboard.dismiss}
      alwaysBounceVertical
      overScrollMode="always"
    >
      <View style={styles.composeIcon}>
        <BrandMark size={52} />
      </View>
      <Text style={styles.composeTitle}>Let's build</Text>
      <Pressable
        style={({ pressed }) => [
          styles.workspaceSelectBtn,
          styles.workspacePathSelectBtn,
          pressed && styles.workspaceSelectBtnPressed,
        ]}
        onPress={onOpenWorkspacePicker}
        accessibilityRole="button"
        accessibilityLabel={`Workspace, ${startWorkspaceLabel}`}
      >
        <Ionicons {...decorativeAccessibilityProps} name="folder-open-outline" size={16} color={theme.colors.textMuted} />
        <Text style={[styles.workspaceSelectLabel, styles.workspacePathSelectLabel]}>
          {startWorkspaceLabel}
        </Text>
        <Ionicons {...decorativeAccessibilityProps} name="chevron-forward" size={14} color={theme.colors.textMuted} />
      </Pressable>
      {showAgentPicker ? (
        <Pressable
          style={({ pressed }) => [
            styles.workspaceSelectBtn,
            pressed && styles.workspaceSelectBtnPressed,
          ]}
          onPress={onOpenAgentPicker}
          accessibilityRole="button"
          accessibilityLabel={`Agent, ${agentLabel}`}
        >
          <Ionicons {...decorativeAccessibilityProps} name="layers-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.workspaceSelectLabel} numberOfLines={1}>
            {agentLabel}
          </Text>
          <Ionicons {...decorativeAccessibilityProps} name="chevron-forward" size={14} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
      {showModelControls ? (
        <Pressable
          style={({ pressed }) => [
            styles.workspaceSelectBtn,
            pressed && styles.workspaceSelectBtnPressed,
          ]}
          onPress={onOpenModelPicker}
          accessibilityRole="button"
          accessibilityLabel={`Model, ${modelLabel}`}
        >
          <Ionicons {...decorativeAccessibilityProps} name="sparkles-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.workspaceSelectLabel} numberOfLines={1}>
            {modelLabel}
          </Text>
          <Ionicons {...decorativeAccessibilityProps} name="chevron-forward" size={14} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
      {showThinkingControls ? (
        <Pressable
          style={({ pressed }) => [
            styles.workspaceSelectBtn,
            pressed && styles.workspaceSelectBtnPressed,
          ]}
          onPress={onOpenThinkingPicker}
          accessibilityRole="button"
          accessibilityLabel={`Thinking level, ${thinkingLabel}`}
        >
          <Ionicons {...decorativeAccessibilityProps} name="pulse-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.workspaceSelectLabel} numberOfLines={1}>
            {thinkingLabel}
          </Text>
          <Ionicons {...decorativeAccessibilityProps} name="chevron-forward" size={14} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
      <Pressable
        style={({ pressed }) => [
          styles.workspaceSelectBtn,
          pressed && styles.workspaceSelectBtnPressed,
        ]}
        onPress={onOpenCollaborationModePicker}
        accessibilityRole="button"
        accessibilityLabel={`Agent mode, ${collaborationModeLabel}`}
      >
        <Ionicons {...decorativeAccessibilityProps} name="map-outline" size={16} color={theme.colors.textMuted} />
        <Text style={styles.workspaceSelectLabel} numberOfLines={1}>
          {collaborationModeLabel}
        </Text>
        <Ionicons {...decorativeAccessibilityProps} name="chevron-forward" size={14} color={theme.colors.textMuted} />
      </Pressable>
      {showFastMode ? (
        <Pressable
          style={({ pressed }) => [
            styles.workspaceSelectBtn,
            pressed && styles.workspaceSelectBtnPressed,
          ]}
          onPress={onToggleFastMode}
          accessibilityRole="switch"
          accessibilityLabel="Fast mode"
          accessibilityState={{ checked: fastModeEnabled }}
        >
          <Ionicons {...decorativeAccessibilityProps} name="flash-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.workspaceSelectLabel} numberOfLines={1}>
            {fastModeLabel}
          </Text>
          <Ionicons
            {...decorativeAccessibilityProps}
            name={fastModeEnabled ? 'checkmark-circle' : 'ellipse-outline'}
            size={14}
            color={theme.colors.textMuted}
          />
        </Pressable>
      ) : null}
      <View style={styles.suggestions}>
        {SUGGESTIONS.map((s, index) => (
          <Pressable
            key={`${s}-${String(index)}`}
            style={({ pressed }) => [
              styles.suggestionCard,
              pressed && styles.suggestionCardPressed,
            ]}
            onPress={() => onSuggestion(s)}
            accessibilityRole="button"
            accessibilityLabel={`Use suggestion: ${s}`}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}



export function AgentThreadsPanel({
  rows,
  runningCount,
  collapsed,
  onToggleCollapse,
  onSelectThread,
}: {
  rows: AgentThreadPanelRow[];
  runningCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectThread: (threadId: string) => void;
}) {
  const theme = useAppTheme();
  const { height: windowHeight } = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.agentPanelCard}>
      <Pressable
        onPress={onToggleCollapse}
        style={({ pressed }) => [
          styles.agentPanelHeader,
          styles.agentPanelHeaderPressable,
          pressed && styles.agentPanelHeaderPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Agents, ${String(runningCount)} running`}
        accessibilityState={controlAccessibilityState({ expanded: !collapsed })}
      >
        <View style={styles.agentPanelHeaderCopy}>
          <Text style={styles.agentPanelEyebrow}>Agents</Text>
          <Text style={styles.agentPanelSummary}>
            {runningCount === 1
              ? '1 running now'
              : `${String(runningCount)} running now`}
          </Text>
        </View>
        <Ionicons
          {...decorativeAccessibilityProps}
          name={collapsed ? 'chevron-down' : 'chevron-up'}
          size={16}
          color={theme.colors.textMuted}
        />
      </Pressable>

      {!collapsed ? (
        <ScrollView
          style={[
            styles.agentPanelScroll,
            { maxHeight: Math.max(180, Math.floor(windowHeight * 0.5)) },
          ]}
          contentContainerStyle={styles.agentPanelList}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {rows.map((row) => (
            <Pressable
              key={row.chat.id}
              onPress={() => onSelectThread(row.chat.id)}
              style={({ pressed }) => [
                styles.agentPanelRow,
                { borderColor: row.runtime.statusBorderColor },
                row.selected && styles.agentPanelRowSelected,
                pressed && styles.agentPanelRowPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${row.title}, ${row.runtime.label}. ${row.description}`}
              accessibilityState={controlAccessibilityState({ selected: row.selected, busy: row.runtime.isActive })}
            >
              <View
                style={[
                  styles.agentPanelAccent,
                  { backgroundColor: row.runtime.accentColor },
                ]}
              />
              <View style={styles.agentPanelCopy}>
                <View style={styles.agentPanelTitleRow}>
                  <Text
                    style={[
                      styles.agentPanelTitle,
                      { color: row.runtime.accentColor },
                    ]}
                    numberOfLines={1}
                  >
                    {row.title}
                  </Text>
                  {row.selected ? (
                    <Text style={styles.agentPanelSelectedLabel}>Current</Text>
                  ) : null}
                </View>
                <Text style={styles.agentPanelDescription} numberOfLines={1}>
                  {row.description}
                </Text>
              </View>
              <View
                style={[
                  styles.agentPanelStatusBadge,
                  {
                    backgroundColor: row.runtime.statusSurfaceColor,
                    borderColor: row.runtime.statusBorderColor,
                  },
                ]}
              >
                {row.runtime.isActive ? (
                  <ActivityIndicator size="small" color={row.runtime.statusColor} />
                ) : (
                  <Ionicons
                    {...decorativeAccessibilityProps}
                    name={row.runtime.icon}
                    size={12}
                    color={row.runtime.statusColor}
                  />
                )}
                <Text
                  style={[
                    styles.agentPanelStatusText,
                    { color: row.runtime.statusColor },
                  ]}
                  numberOfLines={1}
                >
                  {row.runtime.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}


// ── Chat View ──────────────────────────────────────────────────────

export function ChatOpeningView() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.chatOpeningShell} accessibilityRole="progressbar" accessibilityLabel="Opening chat" accessibilityLiveRegion="polite">
      <View style={styles.chatOpeningCard}>
        <View style={styles.chatOpeningTopRow}>
          <ActivityIndicator size="small" color={theme.colors.textMuted} />
          <Text style={styles.chatOpeningTitle}>Opening chat</Text>
        </View>
        <View style={styles.chatOpeningBubbleWide} />
        <View style={styles.chatOpeningBubbleShort} />
      </View>
    </View>
  );
}