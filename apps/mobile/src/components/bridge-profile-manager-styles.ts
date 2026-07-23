import { StyleSheet } from 'react-native';

import type { AppTheme } from '../theme';

export const createBridgeProfileManagerStyles = (theme: AppTheme) => {
  const cardBorder = theme.colors.borderHighlight;
  const raisedFill = theme.isDark ? theme.colors.bgCanvasAccent : theme.colors.bgItem;
  const subtleFill = theme.colors.bgInput;

  return StyleSheet.create({
    backdrop: {
      flex: 1, backgroundColor: theme.colors.overlayBackdrop,
      justifyContent: 'center', paddingHorizontal: theme.spacing.lg,
    },
    keyboardAvoider: { flex: 1, justifyContent: 'center' },
    safeArea: { justifyContent: 'center' },
    sheetCard: {
      borderRadius: theme.radius.lg, borderWidth: StyleSheet.hairlineWidth,
      borderColor: cardBorder, backgroundColor: theme.colors.bgElevated,
      overflow: 'hidden', paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg,
      gap: theme.spacing.md,
      boxShadow: theme.isDark
        ? '0px 24px 64px rgba(0, 0, 0, 0.34)'
        : '0px 18px 40px rgba(15, 31, 54, 0.18)',
    },
    handle: {
      alignSelf: 'center', width: 44, height: 5, borderRadius: 999,
      backgroundColor: theme.colors.borderHighlight,
    },
    header: { gap: theme.spacing.xs },
    eyebrow: {
      ...theme.typography.caption, color: theme.colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0,
    },
    title: { ...theme.typography.largeTitle, color: theme.colors.textPrimary },
    subtitle: {
      ...theme.typography.body, color: theme.colors.textSecondary, lineHeight: 21,
    },
    errorBanner: {
      borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.errorBorder,
      backgroundColor: theme.colors.errorBg, paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm, flexDirection: 'row', alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },
    errorBannerText: {
      ...theme.typography.caption, color: theme.colors.error, flex: 1, lineHeight: 18,
    },
    list: { flexGrow: 0 },
    listContent: { gap: theme.spacing.md },
    profileRow: {
      borderRadius: theme.radius.md, borderWidth: 1, borderColor: cardBorder,
      backgroundColor: raisedFill, padding: theme.spacing.md, gap: theme.spacing.sm,
    },
    profileRowActive: {
      borderColor: theme.colors.successBorder, backgroundColor: theme.colors.successBg,
    },
    profileHeader: {
      flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md,
    },
    profileCopy: { flex: 1, gap: theme.spacing.xs },
    profileTitleRow: {
      flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: theme.spacing.xs,
    },
    profileTitle: {
      ...theme.typography.body, color: theme.colors.textPrimary,
      fontWeight: '700', flexShrink: 1,
    },
    activeBadge: {
      borderRadius: 999, paddingHorizontal: theme.spacing.sm, paddingVertical: 4,
      backgroundColor: theme.colors.successBg,
    },
    activeBadgeText: {
      ...theme.typography.caption, color: theme.colors.statusComplete, fontWeight: '700',
    },
    profileMetaRow: {
      flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: theme.spacing.sm,
    },
    metaBadge: {
      borderRadius: 999, paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4, backgroundColor: subtleFill,
    },
    metaBadgeText: {
      ...theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '600',
    },
    metaText: { ...theme.typography.caption, color: theme.colors.textMuted },
    profileUrl: {
      ...theme.typography.caption, color: theme.colors.textSecondary, lineHeight: 18,
    },
    activateButton: {
      minWidth: 64, minHeight: 36, borderRadius: theme.radius.md,
      backgroundColor: subtleFill, paddingHorizontal: theme.spacing.md,
      alignItems: 'center', justifyContent: 'center',
    },
    activateButtonPressed: { opacity: 0.88 },
    activateButtonText: {
      ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '700',
    },
    activeState: {
      minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center',
    },
    profileToolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    toolButton: {
      minHeight: 34, borderRadius: 999, borderWidth: 1, borderColor: cardBorder,
      backgroundColor: subtleFill, paddingHorizontal: theme.spacing.md,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    toolButtonPressed: { opacity: 0.88 },
    toolButtonText: {
      ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '600',
    },
    toolButtonDanger: {
      backgroundColor: theme.colors.errorBg, borderColor: theme.colors.errorBorder,
    },
    toolButtonDangerPressed: { opacity: 0.9 },
    toolButtonDangerText: {
      ...theme.typography.caption, color: theme.colors.error, fontWeight: '700',
    },
    inlineEditor: {
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: cardBorder,
      paddingTop: theme.spacing.sm, gap: theme.spacing.sm,
    },
    inlineLabel: {
      ...theme.typography.caption, color: theme.colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0,
    },
    inlineInput: {
      minHeight: 46, borderRadius: theme.radius.md, borderWidth: 1,
      borderColor: cardBorder, backgroundColor: theme.colors.bgMain,
      paddingHorizontal: theme.spacing.md, color: theme.colors.textPrimary,
      ...theme.typography.body,
    },
    inlineActions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    inlineButton: {
      minHeight: 38, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md,
      alignItems: 'center', justifyContent: 'center',
    },
    inlineButtonPressed: { opacity: 0.88 },
    inlineButtonSecondary: { borderWidth: 1, borderColor: cardBorder, backgroundColor: subtleFill },
    inlineButtonSecondaryText: {
      ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '600',
    },
    inlineButtonPrimary: { backgroundColor: theme.colors.accent },
    inlineButtonPrimaryPressed: { backgroundColor: theme.colors.accentPressed },
    inlineButtonPrimaryText: {
      ...theme.typography.caption, color: theme.colors.accentText, fontWeight: '700',
    },
    inlineButtonDisabled: { opacity: 0.45 },
    deleteConfirm: {
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: cardBorder,
      paddingTop: theme.spacing.sm, gap: theme.spacing.sm,
    },
    deleteConfirmTitle: {
      ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '700',
    },
    deleteConfirmBody: {
      ...theme.typography.caption, color: theme.colors.textSecondary, lineHeight: 18,
    },
    deleteButton: { backgroundColor: theme.colors.error },
    deleteButtonPressed: { opacity: 0.9 },
    deleteButtonText: {
      ...theme.typography.caption, color: theme.colors.white, fontWeight: '700',
    },
    emptyState: {
      borderRadius: theme.radius.md, borderWidth: 1, borderColor: cardBorder,
      backgroundColor: raisedFill, padding: theme.spacing.lg, gap: theme.spacing.xs,
    },
    emptyStateTitle: {
      ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '700',
    },
    emptyStateBody: {
      ...theme.typography.caption, color: theme.colors.textSecondary, lineHeight: 18,
    },
    closeButton: {
      minHeight: 44, borderRadius: theme.radius.md, backgroundColor: subtleFill,
      alignItems: 'center', justifyContent: 'center',
    },
    closeButtonPressed: { opacity: 0.88 },
    closeButtonText: {
      ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '700',
    },
  });
};