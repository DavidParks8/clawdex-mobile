import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { controlAccessibilityState, decorativeAccessibilityProps } from '../accessibility';
import { BrandMark } from '../components/BrandMark';
import { formatCompactCount } from './drawerContentHelpers';
import { DrawerChatList } from './DrawerChatList';
import { useDrawerContentViewModel } from './drawerContentViewContext';

export function DrawerContentView() {
  const {
    chatFilterOptions,
    chats,
    filterMenuVisible,
    filteredChatCount,
    handleNavigate,
    handleNewChat,
    handleToggleFilterMenu,
    hasActiveFilters,
    isSearching,
    runningChatCount,
    searchQuery,
    selectedAgentIdSet,
    setSearchQuery,
    styles,
    theme,
    toggleAgentFilter,
    wsConnected,
  } = useDrawerContentViewModel();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContent}>
          <View style={styles.topDeck}>
            <View style={styles.heroCard}>
              <View style={styles.heroHeaderRow}>
                <View style={styles.brandBadge}>
                  <BrandMark size={18} />
                </View>
                <View style={styles.heroCopy}>
                  <Text style={styles.heroTitle}>TetherCode</Text>
                  <Text style={styles.heroMeta} numberOfLines={1}>
                    {formatCompactCount(chats.length)} chats · {formatCompactCount(runningChatCount)} live
                  </Text>
                </View>
                <View
                  accessible
                  accessibilityLabel={wsConnected ? 'Bridge connected, live' : 'Bridge disconnected, offline'}
                  accessibilityLiveRegion="polite"
                  style={[
                    styles.connectionBadge,
                    wsConnected
                      ? styles.connectionBadgeConnected
                      : styles.connectionBadgeDisconnected,
                  ]}
                >
                  <View
                    style={[
                      styles.connectionDot,
                      wsConnected
                        ? styles.connectionDotConnected
                        : styles.connectionDotDisconnected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.connectionText,
                      wsConnected
                        ? styles.connectionTextConnected
                        : styles.connectionTextDisconnected,
                    ]}
                  >
                    {wsConnected ? 'Live' : 'Offline'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryActionButton,
                  pressed && styles.primaryActionButtonPressed,
                ]}
                onPress={handleNewChat}
                accessibilityRole="button"
                accessibilityLabel="New chat"
              >
                <Ionicons {...decorativeAccessibilityProps} name="add" size={16} color={theme.colors.accentText} />
                <Text style={styles.primaryActionText}>New chat</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Open preview browser"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.secondaryActionButton,
                  pressed && styles.secondaryActionButtonPressed,
                ]}
                onPress={() => handleNavigate('Browser')}
              >
                <Ionicons {...decorativeAccessibilityProps} name="globe-outline" size={15} color={theme.colors.textPrimary} />
                <Text style={styles.secondaryActionText}>Browser</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chats</Text>
            <View style={styles.sectionHeaderRight}>
              <View style={styles.filterMenuAnchor}>
                <Pressable
                  accessibilityLabel="Filter chat agents"
                  accessibilityRole="button"
                  accessibilityState={controlAccessibilityState({ expanded: filterMenuVisible })}
                  hitSlop={6}
                  onPress={handleToggleFilterMenu}
                  style={({ pressed }) => [
                    styles.filterTriggerButton,
                    filterMenuVisible && styles.filterTriggerButtonOpen,
                    hasActiveFilters && styles.filterTriggerButtonActive,
                    pressed && styles.filterTriggerButtonPressed,
                  ]}
                >
                  <Ionicons
                    {...decorativeAccessibilityProps}
                    name="funnel-outline"
                    size={14}
                    color={hasActiveFilters || filterMenuVisible ? theme.colors.textPrimary : theme.colors.textMuted}
                  />
                </Pressable>
              </View>
              <View style={styles.sectionCountBadge}>
                <Text style={styles.sectionCountText}>
                  {formatCompactCount(filteredChatCount)}
                </Text>
              </View>
            </View>
          </View>

          {filterMenuVisible ? (
            <View style={styles.filterPanel}>
              <View style={styles.searchField}>
                <Ionicons {...decorativeAccessibilityProps} name="search" size={16} color={theme.colors.textMuted} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  keyboardAppearance={theme.keyboardAppearance}
                  placeholder="Search chats"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.searchInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  clearButtonMode="never"
                  accessibilityLabel="Search chats"
                />
                {isSearching ? (
                  <Pressable
                    accessibilityLabel="Clear chat search"
                    hitSlop={6}
                    onPress={() => setSearchQuery('')}
                    style={({ pressed }) => [
                      styles.searchClearButton,
                      pressed && styles.searchClearButtonPressed,
                    ]}
                  >
                    <Ionicons
                      {...decorativeAccessibilityProps}
                      name="close"
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                  </Pressable>
                ) : null}
              </View>
              <View style={styles.filterChipRow}>
                {chatFilterOptions.map((option) => {
                  const selected = selectedAgentIdSet.has(option.agentId);
                  return (
                    <Pressable
                      key={option.agentId}
                      accessibilityLabel={`Toggle ${option.displayName} chats`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      onPress={() => toggleAgentFilter(option.agentId)}
                      style={({ pressed }) => [
                        styles.filterChip,
                        selected && styles.filterChipSelected,
                        pressed && styles.filterChipPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selected && styles.filterChipTextSelected,
                        ]}
                      >
                        {option.displayName}
                      </Text>
                      {selected ? (
                        <Ionicons
                          {...decorativeAccessibilityProps}
                          name="checkmark"
                          size={14}
                          color={theme.colors.textPrimary}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <DrawerChatList />
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityLabel="Open settings"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.footerSettingsButton,
              pressed && styles.footerSettingsButtonPressed,
            ]}
            onPress={() => handleNavigate('Settings')}
          >
            <Ionicons {...decorativeAccessibilityProps} name="settings-outline" size={15} color={theme.colors.textPrimary} />
            <Text style={styles.footerSettingsText}>Settings</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );;
}
