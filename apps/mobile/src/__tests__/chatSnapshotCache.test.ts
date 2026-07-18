import type { Chat } from '../api/types';
import {
  CHAT_SNAPSHOT_CACHE_MAX_ENTRIES,
  createEmptyChatSnapshotCache,
  getChatSnapshotCachePath,
  parseChatSnapshotCache,
  updateChatSnapshotCache,
} from '../chatSnapshotCache';

function chat(id: string, message = id): Chat {
  return {
    id,
    title: `Chat ${id}`,
    status: 'idle',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    statusUpdatedAt: '2026-07-01T00:00:00.000Z',
    lastMessagePreview: message,
    messages: [
      {
        id: `message-${id}`,
        role: 'assistant',
        content: message,
        createdAt: '2026-07-01T00:00:00.000Z',
      },
    ],
  };
}

describe('chatSnapshotCache', () => {
  it('round trips exact-version snapshots for one profile', () => {
    const updated = updateChatSnapshotCache(
      createEmptyChatSnapshotCache('profile-a'),
      'thread-1',
      chat('thread-1'),
      '2026-07-17T00:00:00.000Z'
    );

    expect(
      parseChatSnapshotCache(
        JSON.stringify(updated),
        'profile-a',
        Date.parse('2026-07-18T00:00:00.000Z')
      )
    ).toEqual(updated);
    expect(parseChatSnapshotCache(JSON.stringify(updated), 'profile-b').entries).toEqual([]);
  });

  it('rejects old schemas and malformed chats', () => {
    expect(
      parseChatSnapshotCache(JSON.stringify({ version: 0, profileId: 'profile-a', entries: [] }), 'profile-a')
    ).toEqual(expect.objectContaining({ entries: [], selectedChatId: null }));
    expect(
      parseChatSnapshotCache(
        JSON.stringify({
          version: 1,
          profileId: 'profile-a',
          entries: [{ chat: { id: 'bad' }, cachedAt: 'bad', lastAccessedAt: 'bad' }],
        }),
        'profile-a'
      ).entries
    ).toEqual([]);
  });

  it('bounds entries while retaining the selected snapshot', () => {
    let cache = createEmptyChatSnapshotCache('profile-a');
    for (let index = 0; index < CHAT_SNAPSHOT_CACHE_MAX_ENTRIES + 5; index += 1) {
      cache = updateChatSnapshotCache(
        cache,
        index === 0 ? 'thread-0' : cache.selectedChatId,
        chat(`thread-${String(index)}`),
        new Date(Date.UTC(2026, 6, 1, 0, index)).toISOString()
      );
    }

    expect(cache.entries).toHaveLength(CHAT_SNAPSHOT_CACHE_MAX_ENTRIES);
    expect(cache.entries.some((entry) => entry.chat.id === 'thread-0')).toBe(true);
  });

  it('drops expired snapshots', () => {
    const stored = updateChatSnapshotCache(
      createEmptyChatSnapshotCache('profile-a'),
      'thread-old',
      chat('thread-old'),
      '2026-01-01T00:00:00.000Z'
    );

    expect(
      parseChatSnapshotCache(
        JSON.stringify(stored),
        'profile-a',
        Date.parse('2026-07-17T00:00:00.000Z')
      ).entries
    ).toEqual([]);
  });

  it('uses only the profile id in the cache path', () => {
    const path = getChatSnapshotCachePath('profile-a', 'file:///documents/');
    expect(path).toBe('file:///documents/clawdex-chat-cache/profile-a/snapshots.json');
    expect(path).not.toContain('token');
    expect(path).not.toContain('http');
  });
});
