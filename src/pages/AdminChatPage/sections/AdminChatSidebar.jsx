import { Inbox, Loader2, Search } from 'lucide-react'

import ConversationItem from '../components/ConversationItem'

function ConversationSkeletonList() {
  return (
    <div className="divide-y divide-[var(--admin-border)]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-3 px-4 py-3.5">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[var(--admin-surface-3)]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--admin-surface-3)]" />
            <div className="h-3 w-full animate-pulse rounded bg-[var(--admin-surface-3)]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--admin-surface-3)]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminChatSidebar({
  filteredConversations,
  hasMore,
  loading,
  loadingMore,
  searchQuery,
  selectedSession,
  totalConversations,
  onLoadMore,
  onSearchChange,
  onSelectConversation,
  showChatPane
}) {
  const hasConversations = filteredConversations.length > 0
  const conversationCountText = totalConversations > filteredConversations.length
    ? `${filteredConversations.length}/${totalConversations} hội thoại đang hiển thị`
    : hasConversations
      ? `${filteredConversations.length} hội thoại đang hiển thị`
      : 'Chọn bộ lọc để bắt đầu'

  const handleConversationScroll = event => {
    if (!hasMore || loading || loadingMore) return

    const viewport = event.currentTarget
    const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight

    if (distanceFromBottom < 160) {
      onLoadMore?.()
    }
  }

  return (
    <aside
      className={`${
        showChatPane ? 'hidden md:flex' : 'flex'
      } absolute z-10 h-full w-full shrink-0 flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface)] md:relative md:w-[300px] xl:w-[320px]`}
    >
      <div className="shrink-0 border-b border-[var(--admin-border)] px-4 py-4">
        <div className="mb-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--admin-text)]">Hộp thư</h2>
            <p className="text-xs text-[var(--admin-text-muted)]">
              {conversationCountText}
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-subtle)]" />
          <input
            type="text"
            placeholder="Tìm khách hàng, mã phiên, nội dung"
            value={searchQuery}
            onChange={onSearchChange}
            className="h-10 w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] pl-9 pr-3 text-sm text-[var(--admin-text)] outline-none transition-colors placeholder-[var(--admin-text-subtle)] focus:border-[var(--admin-accent)] focus:bg-[var(--admin-surface)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--admin-accent)_18%,transparent)]"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto" onScroll={handleConversationScroll}>
        {loading && !hasConversations ? (
          <ConversationSkeletonList />
        ) : hasConversations ? (
          <div className="divide-y divide-[var(--admin-border)]">
            {filteredConversations.map(conversation => (
              <ConversationItem
                key={conversation.sessionId}
                conversation={conversation}
                isSelected={selectedSession === conversation.sessionId}
                onSelect={() => onSelectConversation(conversation)}
              />
            ))}
            {(loadingMore || hasMore) && (
              <div className="px-4 py-3 text-center">
                {loadingMore ? (
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--admin-text-muted)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Đang tải thêm
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onLoadMore}
                    className="inline-flex h-8 items-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-xs font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
                  >
                    Tải thêm
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-subtle)]">
              <Inbox className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <p className="text-sm font-medium text-[var(--admin-text)]">
              {searchQuery ? 'Không tìm thấy hội thoại' : 'Không có cuộc trò chuyện'}
            </p>
            <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
              {searchQuery ? 'Thử tìm bằng tên khách, mã phiên hoặc nội dung khác.' : 'Danh sách này sẽ tự cập nhật khi có tin nhắn mới.'}
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
