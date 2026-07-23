import { StyleSheet } from 'react-native';

import type { AppTheme } from '../theme';

export const createSelectionSheetStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: theme.colors.overlayBackdrop },
    sheetOuter: { flex: 1, paddingHorizontal: theme.spacing.md },
    sheetOuterExpanded: { paddingHorizontal: theme.spacing.md },
    sheetCard: {
      maxHeight: '82%', borderRadius: 24, borderCurve: 'continuous', borderWidth: 1,
      borderColor: theme.colors.borderLight, backgroundColor: theme.colors.bgElevated,
      paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg, gap: theme.spacing.md,
      boxShadow: theme.isDark
        ? '0 -10px 34px rgba(0, 0, 0, 0.42)'
        : '0 -10px 34px rgba(15, 23, 42, 0.12)',
    },
    sheetCardExpanded: { maxHeight: undefined, minHeight: undefined, borderRadius: 28 },
    handle: {
      alignSelf: 'center', width: 38, height: 4, borderRadius: 999,
      backgroundColor: theme.colors.border,
    },
    header: { gap: 4 },
    eyebrow: {
      ...theme.typography.caption, color: theme.colors.textMuted, fontSize: 10,
      lineHeight: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0,
    },
    title: {
      ...theme.typography.headline, color: theme.colors.textPrimary, fontSize: 18,
      lineHeight: 22, fontWeight: '700',
    },
    subtitle: {
      ...theme.typography.caption, color: theme.colors.textMuted, fontSize: 12, lineHeight: 16,
    },
    body: { flexShrink: 1, minHeight: 0 },
    list: { flexGrow: 0 },
    listExpanded: { minHeight: 0 },
    listContent: { gap: theme.spacing.sm },
    listContentExpanded: { paddingBottom: theme.spacing.xs },
    loadingState: {
      minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm,
    },
    loadingLabel: {
      ...theme.typography.caption, color: theme.colors.textMuted, textAlign: 'center',
    },
    option: {
      minHeight: 64, borderRadius: 18, borderCurve: 'continuous', borderWidth: 1,
      borderColor: theme.colors.borderLight, backgroundColor: theme.colors.bgInput,
      paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm + 2,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    optionSelected: {
      borderColor: theme.colors.borderHighlight, backgroundColor: theme.colors.bgCanvasAccent,
    },
    optionDisabled: { opacity: 0.56 },
    optionPressed: { opacity: 0.88 },
    optionMain: {
      flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm,
    },
    iconWrap: {
      width: 30, height: 30, borderRadius: 10, alignItems: 'center',
      justifyContent: 'center', backgroundColor: theme.colors.bgItem,
      borderWidth: 1, borderColor: theme.colors.borderLight,
    },
    iconWrapSelected: {
      backgroundColor: theme.colors.bgCanvasAccent, borderColor: theme.colors.border,
    },
    iconWrapDanger: { backgroundColor: theme.colors.errorBg, borderColor: theme.colors.error },
    copy: { flex: 1, minWidth: 0, gap: 3 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs + 2 },
    optionTitle: {
      ...theme.typography.body, flex: 1, color: theme.colors.textSecondary,
      fontWeight: '600', lineHeight: 18,
    },
    optionTitleSelected: { color: theme.colors.textPrimary },
    optionDescription: {
      ...theme.typography.caption, color: theme.colors.textMuted, lineHeight: 15,
    },
    badge: {
      borderRadius: 999, borderWidth: 1, borderColor: theme.colors.borderLight,
      backgroundColor: theme.colors.bgItem, paddingHorizontal: theme.spacing.xs + 4,
      paddingVertical: 2,
    },
    badgeText: {
      ...theme.typography.caption, color: theme.colors.textMuted, fontSize: 10,
      lineHeight: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0,
    },
    accessory: { flexShrink: 0, alignItems: 'flex-end', gap: 6 },
    meta: {
      ...theme.typography.caption, color: theme.colors.textMuted, fontSize: 11,
      lineHeight: 14, fontWeight: '600',
    },
    footer: {
      alignItems: 'flex-end', borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.md,
    },
    closeButton: {
      minWidth: 88, borderRadius: 14, borderCurve: 'continuous', borderWidth: 1,
      borderColor: theme.colors.borderLight, backgroundColor: theme.colors.bgInput,
      paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm + 2,
      alignItems: 'center', justifyContent: 'center',
    },
    closeButtonPressed: { opacity: 0.86 },
    closeText: {
      ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600',
    },
  });