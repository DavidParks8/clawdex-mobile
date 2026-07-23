import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, RefreshControl, SectionList, Text, View } from 'react-native';
import { controlAccessibilityState, decorativeAccessibilityProps } from '../accessibility';
import { findAgentDescriptor } from '../agents';
import { AgentIcon } from '../components/AgentIcon';
import { formatCompactCount, getDrawerChatSubtitle, relativeTime } from './drawerContentHelpers';
import { isDrawerChatRunning, isDrawerWorkspaceSectionRunning } from './drawerRuntimeIndicators';
import { useDrawerContentViewModel } from './drawerContentViewContext';

export function DrawerChatList() {
  const { agents, chatSections, visibleChatSections, chatSectionByKey, collapsedWorkspaceKeys,
    handleSelectChat, isSearching, loadChats, loading, loadingOlderChats,
    normalizedWorkspaceChatLimit, partialHistoryDiagnostics, pinnedChatIdSet,
    pinnedWorkspacePathSet, refreshing, resolvedEmptyHint, resolvedEmptyTitle,
    retryDeepChatListRef, runIndicatorsByThread, selectedChatId, showAllWorkspaceChats,
    showChatPinAction, showWorkspacePinAction, styles, theme, toggleWorkspaceSection } = useDrawerContentViewModel();
  return (
    <>
{loading ? (
            <View style={styles.emptyStateCard} accessibilityRole="progressbar" accessibilityLabel="Loading chats" accessibilityLiveRegion="polite">
              <ActivityIndicator color={theme.colors.textMuted} style={styles.loader} />
              <Text style={styles.emptyTitle}>Loading chats</Text>
              <Text style={styles.emptyHint}>Syncing recent threads from your bridge.</Text>
            </View>
          ) : chatSections.length === 0 ? (
            <View style={styles.emptyStateCard} accessibilityLiveRegion="polite">
              <View style={styles.emptyStateIconWrap}>
                <Ionicons
                  name={isSearching ? 'search-outline' : 'chatbubbles-outline'}
                  size={18}
                  color={theme.colors.textPrimary}
                />
              </View>
              <Text style={styles.emptyTitle}>{resolvedEmptyTitle}</Text>
              <Text style={styles.emptyHint}>{resolvedEmptyHint}</Text>
            </View>
          ) : (
            <SectionList
              sections={visibleChatSections}
              keyExtractor={(item) => item.chat.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
              removeClippedSubviews={false}
              initialNumToRender={12}
              maxToRenderPerBatch={10}
              windowSize={9}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    void loadChats(true, true);
                  }}
                  tintColor={theme.colors.textMuted}
                />
              }
              ListHeaderComponent={
                partialHistoryDiagnostics.length > 0 ? (
                  <Pressable
                    style={styles.emptyStateCard}
                    onPress={() => {
                      void retryDeepChatListRef.current();
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Chat history is partial. Retry loading all chats"
                  >
                    <Text style={styles.emptyTitle}>Some chat history could not be listed</Text>
                    <Text style={styles.emptyHint}>
                      {`${partialHistoryDiagnostics.join(' ')} Tap to retry.`}
                    </Text>
                  </Pressable>
                ) : null
              }
              ListFooterComponent={
                loadingOlderChats ? (
                  <View style={styles.loadingMoreFooter}>
                    <ActivityIndicator size="small" color={theme.colors.textMuted} />
                  </View>
                ) : null
              }
              renderSectionHeader={({ section }) => {
                const isPinnedWorkspace = pinnedWorkspacePathSet.has(section.key);
                const collapsed = !isSearching && collapsedWorkspaceKeys.has(section.key);
                const hasLiveChat = isDrawerWorkspaceSectionRunning(
                  chatSectionByKey.get(section.key) ?? section,
                  runIndicatorsByThread
                );
                return (
                  <Pressable
                    disabled={isSearching}
                    style={({ pressed }) => [
                      styles.workspaceGroupHeader,
                      collapsed
                        ? styles.workspaceGroupHeaderCollapsed
                        : styles.workspaceGroupHeaderExpanded,
                      isPinnedWorkspace && styles.workspaceGroupHeaderPinned,
                      pressed &&
                        !isSearching &&
                        styles.workspaceGroupHeaderPressed,
                    ]}
                    onPress={() => toggleWorkspaceSection(section.key)}
                    onLongPress={() => showWorkspacePinAction(section)}
                    accessibilityRole="button"
                    accessibilityLabel={`${section.title}, ${String(section.itemCount)} chats${hasLiveChat ? ', has live chat' : ''}`}
                    accessibilityHint={isSearching ? undefined : 'Toggles this workspace. Long press to pin or unpin.'}
                    accessibilityState={controlAccessibilityState({ disabled: isSearching, expanded: isSearching ? undefined : !collapsed })}
                  >
                    <View style={styles.workspaceGroupHeaderRow}>
                      {isPinnedWorkspace ? (
                        <Ionicons
                          {...decorativeAccessibilityProps}
                          name="pin-outline"
                          size={11}
                          color={theme.colors.textMuted}
                          style={styles.workspaceGroupPinIcon}
                        />
                      ) : null}
                      {hasLiveChat ? (
                        <View
                          {...decorativeAccessibilityProps}
                          style={styles.workspaceGroupLiveDot}
                        />
                      ) : null}
                      <View style={styles.workspaceGroupIconTile}>
                        <Ionicons
                          {...decorativeAccessibilityProps}
                          name="folder-outline"
                          size={13}
                          color={theme.colors.textMuted}
                          style={styles.workspaceGroupIcon}
                        />
                      </View>
                      <View style={styles.workspaceGroupTitleBlock}>
                        <Text style={styles.workspaceGroupTitle} numberOfLines={1}>
                          {section.title}
                        </Text>
                        {section.subtitle ? (
                          <Text style={styles.workspaceGroupSubtitle} numberOfLines={1}>
                            {section.subtitle}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.workspaceGroupCountBadge}>
                        <Text style={styles.workspaceGroupCountText}>
                          {formatCompactCount(section.itemCount)}
                        </Text>
                      </View>
                      {!isSearching ? (
                        <View style={styles.workspaceGroupHeaderMeta}>
                          <Ionicons
                            {...decorativeAccessibilityProps}
                            name={collapsed ? 'chevron-forward' : 'chevron-down'}
                            size={14}
                            color={theme.colors.textMuted}
                          />
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              renderSectionFooter={({ section }) => {
                const collapsed = !isSearching && collapsedWorkspaceKeys.has(section.key);
                const pageSize = normalizedWorkspaceChatLimit;
                const hiddenCount =
                  !isSearching && !collapsed && pageSize !== null
                    ? Math.max(0, section.itemCount - section.data.length)
                    : 0;
                if (hiddenCount === 0 || pageSize === null) {
                  return null;
                }

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Show all chats in ${section.title}`}
                    onPress={() => showAllWorkspaceChats(section)}
                    style={({ pressed }) => [
                      styles.workspaceShowMoreRow,
                      pressed && styles.workspaceShowMoreRowPressed,
                    ]}
                  >
                    <Text style={styles.workspaceShowMoreText}>Show all</Text>
                    <Ionicons {...decorativeAccessibilityProps} name="chevron-down" size={14} color={theme.colors.textSecondary} />
                  </Pressable>
                );
              }}
              renderItem={({ item, index, section }) => {
                const chat = item.chat;
                const isSelected = chat.id === selectedChatId;
                const isLast = index === section.data.length - 1;
                const isRunning = isDrawerChatRunning(chat, runIndicatorsByThread);
                const isSubAgent = item.indentLevel > 0 || Boolean(chat.parentThreadId);
                const isPinnedChat = pinnedChatIdSet.has(chat.id);
                const chatSubtitle = getDrawerChatSubtitle(chat);
                const chatIndent = Math.min(item.indentLevel, 4) * 14;
                return (
                  <Pressable
                    style={[
                      styles.chatItemFrame,
                      isSubAgent && {
                        marginLeft: theme.spacing.md + chatIndent,
                      },
                      isLast && styles.chatItemLast,
                    ]}
                    onPress={() => handleSelectChat(chat.id)}
                    onLongPress={() => showChatPinAction(chat)}
                    accessibilityRole="button"
                    accessibilityLabel={`${chat.title || 'Untitled chat'}${chatSubtitle ? `, ${chatSubtitle}` : ''}${isRunning ? ', running' : ''}${isPinnedChat ? ', pinned' : ''}`}
                    accessibilityHint="Opens this chat. Long press to pin or unpin."
                    accessibilityState={controlAccessibilityState({ selected: isSelected })}
                  >
                    {({ pressed }) => (
                      <View
                        style={[
                          styles.chatItem,
                          isSubAgent && styles.chatItemSubAgent,
                          isSelected && styles.chatItemSelected,
                          pressed && styles.chatItemPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.chatItemAccent,
                            isSubAgent && styles.chatItemAccentSubAgent,
                            isSelected && styles.chatItemAccentSelected,
                            isRunning && styles.chatItemAccentRunning,
                            chat.status === 'error' && styles.chatItemAccentError,
                          ]}
                        />
                        <View style={styles.chatItemContent}>
                          <View style={styles.chatItemTextBlock}>
                            <Text
                              style={[
                                styles.chatTitle,
                                isSubAgent && styles.chatTitleSubAgent,
                                isSelected && styles.chatTitleSelected,
                              ]}
                              numberOfLines={chatSubtitle ? 1 : 2}
                            >
                              {chat.title || 'Untitled'}
                            </Text>
                            {chatSubtitle ? (
                              <Text
                                style={[
                                  styles.chatSubtitle,
                                  isSelected && styles.chatSubtitleSelected,
                                ]}
                                numberOfLines={1}
                              >
                                {chatSubtitle}
                              </Text>
                            ) : null}
                          </View>
                          <View style={styles.chatItemMeta}>
                            {isPinnedChat ? (
                              <Ionicons
                                {...decorativeAccessibilityProps}
                                name="pin-outline"
                                size={10}
                                color={theme.colors.textMuted}
                                style={styles.chatPinnedIcon}
                              />
                            ) : null}
                            <AgentIcon
                              agent={findAgentDescriptor(agents, chat.agentId)}
                              size={16}
                              style={styles.chatAgentIcon}
                            />
                            <Text
                              style={[
                                styles.chatAge,
                                isSelected && styles.chatAgeSelected,
                              ]}
                            >
                              {relativeTime(chat.updatedAt)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </Pressable>
                );
              }}
            />
          )}
    </>
  );
}
