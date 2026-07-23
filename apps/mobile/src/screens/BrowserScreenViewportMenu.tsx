import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppTheme } from '../theme';
import { createBrowserScreenStyles } from './browserScreenStyles';
import { DESKTOP_VIEWPORT_PRESETS } from './browserScreenShared';

export function ViewportMenu({
  showViewportMenu,
  handleCloseViewportMenu,
  viewportMenuFocusRef,
  desktopViewportSize,
  showCustomViewportEditor,
  desktopViewportMatchesPreset,
  desktopViewportDraft,
  setDesktopViewportDraft,
  handleSelectDesktopPreset,
  handleShowCustomViewportEditor,
  handleApplyDesktopViewport,
}: {
  showViewportMenu: boolean;
  handleCloseViewportMenu: () => void;
  viewportMenuFocusRef: (instance: Text | null) => void;
  desktopViewportSize: { width: number; height: number };
  showCustomViewportEditor: boolean;
  desktopViewportMatchesPreset: boolean;
  desktopViewportDraft: { width: string; height: string };
  setDesktopViewportDraft: (
    updater: (current: { width: string; height: string }) => { width: string; height: string }
  ) => void;
  handleSelectDesktopPreset: (viewport: { width: number; height: number }) => void;
  handleShowCustomViewportEditor: () => void;
  handleApplyDesktopViewport: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createBrowserScreenStyles(theme), [theme]);
  const { colors } = theme;

  return (
    <Modal
      visible={showViewportMenu}
      transparent
      animationType="fade"
      onRequestClose={handleCloseViewportMenu}
    >
      <Pressable
        style={styles.viewportMenuBackdrop}
        onPress={handleCloseViewportMenu}
        accessibilityRole="button"
        accessibilityLabel="Close viewport menu"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
          style={styles.viewportMenuKeyboardLayer}
        >
          <Pressable
            accessibilityViewIsModal
            importantForAccessibility="yes"
            style={styles.viewportMenuCard}
            onPress={() => {}}
          >
            <View style={styles.viewportMenuHeader}>
              <Text
                ref={viewportMenuFocusRef}
                accessibilityRole="header"
                style={styles.viewportMenuTitle}
              >
                Viewport
              </Text>
              <Text style={styles.viewportMenuSubtitle}>Applies to Desktop.</Text>
            </View>
            <View style={styles.viewportMenuPresetGrid}>
              {DESKTOP_VIEWPORT_PRESETS.map((preset) => {
                const active =
                  desktopViewportSize.width === preset.width &&
                  desktopViewportSize.height === preset.height;
                return (
                  <Pressable
                    key={preset.label}
                    onPress={() => handleSelectDesktopPreset(preset)}
                    style={({ pressed }) => [
                      styles.viewportPresetChip,
                      styles.viewportMenuPresetChip,
                      active && styles.viewportPresetChipActive,
                      pressed && styles.viewportPresetChipPressed,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                  >
                    <Text
                      style={[
                        styles.viewportPresetChipText,
                        active && styles.viewportPresetChipTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={handleShowCustomViewportEditor}
                style={({ pressed }) => [
                  styles.viewportPresetChip,
                  styles.viewportMenuPresetChip,
                  (showCustomViewportEditor || !desktopViewportMatchesPreset) &&
                    styles.viewportPresetChipActive,
                  pressed && styles.viewportPresetChipPressed,
                ]}
                accessibilityRole="radio"
                accessibilityState={{
                  checked: showCustomViewportEditor || !desktopViewportMatchesPreset,
                }}
              >
                <Text
                  style={[
                    styles.viewportPresetChipText,
                    (showCustomViewportEditor || !desktopViewportMatchesPreset) &&
                      styles.viewportPresetChipTextActive,
                  ]}
                >
                  Custom
                </Text>
              </Pressable>
            </View>
            {showCustomViewportEditor ? (
              <View style={styles.viewportInputRow}>
                <View style={styles.viewportField}>
                  <Text style={styles.viewportFieldLabel}>W</Text>
                  <TextInput
                    value={desktopViewportDraft.width}
                    onChangeText={(value) =>
                      setDesktopViewportDraft((current) => ({ ...current, width: value }))
                    }
                    keyboardType="number-pad"
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={styles.viewportFieldInput}
                    placeholder="1920"
                    placeholderTextColor={colors.textMuted}
                    accessibilityLabel="Viewport width"
                  />
                </View>
                <View style={styles.viewportField}>
                  <Text style={styles.viewportFieldLabel}>H</Text>
                  <TextInput
                    value={desktopViewportDraft.height}
                    onChangeText={(value) =>
                      setDesktopViewportDraft((current) => ({ ...current, height: value }))
                    }
                    keyboardType="number-pad"
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={styles.viewportFieldInput}
                    placeholder="1080"
                    placeholderTextColor={colors.textMuted}
                    accessibilityLabel="Viewport height"
                  />
                </View>
                <Pressable
                  onPress={handleApplyDesktopViewport}
                  style={({ pressed }) => [
                    styles.viewportApplyButton,
                    pressed && styles.viewportApplyButtonPressed,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.viewportApplyButtonText}>Apply</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.viewportCurrentLabel}>
                Current viewport: {desktopViewportSize.width}×{desktopViewportSize.height}
              </Text>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
