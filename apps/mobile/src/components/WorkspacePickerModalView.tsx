import { Ionicons } from '@expo/vector-icons';
import type { RefObject } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { FileSystemEntry, WorkspaceSummary } from '../api/types';
import { decorativeAccessibilityProps } from '../accessibility';
import type { AppTheme } from '../theme';
import { WorkspacePickerBrowser } from './WorkspacePickerBrowser';
import { WorkspacePickerFooter } from './WorkspacePickerFooter';
import type { WorkspacePickerStyles } from './workspacePickerStyles';
import { WorkspacePickerTopSection } from './WorkspacePickerTopSection';

export interface WorkspacePickerModalViewProps {
  visible: boolean; styles: WorkspacePickerStyles; theme: AppTheme;
  topInset: number; bottomInset: number; cardHeight: number;
  modalFocusRef: RefObject<Text | null>; onClose: () => void;
  selectedPath: string | null; bridgeRoot: string | null;
  searchQuery: string; setSearchQuery: (query: string) => void;
  onSelectPath: (path: string | null) => void;
  actionLabel: string | null; actionDescription: string | null; actionDisabled: boolean;
  onActionPress?: () => void; favoriteWorkspaces: WorkspaceSummary[];
  favoritePathSet: Set<string>; pendingSelectionPath: string | null;
  onBrowsePath: (path: string | null) => void;
  onToggleFavorite?: (path: string | null) => void;
  parentPath: string | null; loadingEntries: boolean; filteredEntries: FileSystemEntry[];
  normalizedSearch: string; currentFolderTitle: string; currentFolderPath: string | null;
  error: string | null; truncationMessage: string | null; footerPath: string | null;
  footerTitle: string; footerSubtitle: string; footerIsFavorite: boolean;
}

export function WorkspacePickerModalView(props: WorkspacePickerModalViewProps) {
  return (
    <Modal visible={props.visible} transparent animationType="fade" presentationStyle="overFullScreen" onRequestClose={props.onClose}>
      <View style={props.styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill} onPress={props.onClose}
          accessibilityRole="button" accessibilityLabel="Close workspace picker"
        />
        <View style={[props.styles.outer, { paddingTop: props.topInset, paddingBottom: props.bottomInset }]}>
          <View
            accessibilityViewIsModal importantForAccessibility="yes"
            style={[props.styles.card, { height: props.cardHeight }]}
          >
            <View style={props.styles.header}>
              <View style={props.styles.headerSpacer} />
              <Text ref={props.modalFocusRef} accessibilityRole="header" style={props.styles.title}>Choose Workspace</Text>
              <Pressable
                onPress={props.onClose}
                style={({ pressed }) => [props.styles.closeButton, pressed && props.styles.pressed]}
                accessibilityRole="button" accessibilityLabel="Close workspace picker"
              >
                <Ionicons {...decorativeAccessibilityProps} name="close" size={18} color={props.theme.colors.textSecondary} />
              </Pressable>
            </View>
            <View style={props.styles.body}>
              <WorkspacePickerTopSection {...props} hasVisibleEntries={props.filteredEntries.length > 0} />
              <WorkspacePickerBrowser
                styles={props.styles} theme={props.theme} entries={props.filteredEntries}
                loadingEntries={props.loadingEntries} normalizedSearch={props.normalizedSearch}
                favoritePathSet={props.favoritePathSet} onBrowsePath={props.onBrowsePath}
                onToggleFavorite={props.onToggleFavorite}
              />
              <WorkspacePickerFooter {...props} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}