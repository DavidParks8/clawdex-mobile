export {
  dedupeRecentPreviewTargets,
  type BrowserPreviewViewportPreset,
  type BrowserPreviewViewportSpec,
  normalizeBrowserPreviewViewportSpec,
  normalizePreviewTargetInput,
} from './browserPreview/constants';
export {
  extractLocalPreviewUrls,
  isLocalPreviewCandidateUrl,
  pushRecentPreviewTarget,
} from './browserPreview/discovery';
export {
  applyBrowserPreviewShellMode,
  applyBrowserPreviewViewportPreset,
  buildBrowserPreviewBootstrapUrl,
  buildBrowserPreviewViewportNavigationUrl,
  getBrowserPreviewOrigin,
  getBrowserPreviewShellRequestKey,
  getNativeBrowserPreviewShellMode,
  isSameOriginUrl,
  mapBrowserPreviewNavigationUrlToTargetUrl,
} from './browserPreview/navigation';
