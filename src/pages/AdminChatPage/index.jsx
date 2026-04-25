import SEO from '@/components/SEO'
import { CheckCircle, Inbox, MessageCircle, RefreshCw, UserCheck } from 'lucide-react'
import { useAdminChatPage } from './hooks/useAdminChatPage'
import AdminChatConversationPane from './sections/AdminChatConversationPane'
import AdminChatDetailsPane from './sections/AdminChatDetailsPane'
import AdminChatEmptyState from './sections/AdminChatEmptyState'
import AdminChatSidebar from './sections/AdminChatSidebar'

const CHAT_FILTERS = [
  {
    key: 'unassigned',
    label: 'Chờ xử lý',
    Icon: Inbox
  },
  {
    key: 'mine',
    label: 'Của tôi',
    Icon: UserCheck
  },
  {
    key: 'open',
    label: 'Đang mở',
    Icon: MessageCircle
  },
  {
    key: 'resolved',
    label: 'Đã xong',
    Icon: CheckCircle
  }
]

function AdminChatFilters({ activeTab, counts, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CHAT_FILTERS.map(({ key, label, Icon }) => {
        const isActive = activeTab === key

        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            aria-pressed={isActive}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-[var(--admin-accent)] bg-[var(--admin-accent)] text-[#f4f5f8]'
                : 'border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            <span>{label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                isActive
                  ? 'bg-white/20 text-[#f4f5f8]'
                  : 'bg-[var(--admin-surface-2)] text-[var(--admin-text-subtle)]'
              }`}
            >
              {counts[key] || 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function AdminChatPage() {
  const {
    activeTab,
    assigning,
    canReplyToConversation,
    canSend,
    conversationsHasMore,
    conversationsLoading,
    conversationsLoadingMore,
    conversationsTotal,
    counts,
    customerTyping,
    filteredConversations,
    input,
    inputRef,
    imageInputRef,
    isAssignedToMe,
    isNote,
    isResolved,
    isUploadingImage,
    messages,
    messagesLoading,
    messagesViewportRef,
    pendingImage,
    resolving,
    refreshing,
    searchQuery,
    selectedConversation,
    selectedSession,
    clearPendingImage,
    handleAssign,
    handleBackToList,
    handleComposerChange,
    handleImageChange,
    handleKeyDown,
    handleLoadMoreConversations,
    handleRefresh,
    handleResolve,
    handleSearchChange,
    handleSelectConversation,
    handleTabChange,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode
  } = useAdminChatPage()

  return (
    <div className="admin-chat-page flex h-full min-h-0 overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-[var(--admin-shadow)]">
      <SEO title="Admin - Live Chat" noIndex />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-[var(--admin-text)]">Live Chat</h1>
            <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">
              Theo dõi, phân luồng và phản hồi hội thoại khách hàng theo thời gian thực.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <AdminChatFilters activeTab={activeTab} counts={counts} onTabChange={handleTabChange} />

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-4 text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-3)] hover:text-[var(--admin-text)] disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={1.8} />
              {refreshing ? 'Đang tải' : 'Làm mới'}
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <AdminChatSidebar
            filteredConversations={filteredConversations}
            hasMore={conversationsHasMore}
            loading={conversationsLoading}
            loadingMore={conversationsLoadingMore}
            searchQuery={searchQuery}
            selectedSession={selectedSession}
            showChatPane={!!selectedSession}
            totalConversations={conversationsTotal}
            onLoadMore={handleLoadMoreConversations}
            onSearchChange={handleSearchChange}
            onSelectConversation={handleSelectConversation}
          />

          {selectedSession ? (
            <AdminChatConversationPane
              canReplyToConversation={canReplyToConversation}
              canSend={canSend}
              assigning={assigning}
              customerTyping={customerTyping}
              input={input}
              inputRef={inputRef}
              imageInputRef={imageInputRef}
              isAssignedToMe={isAssignedToMe}
              isNote={isNote}
              isResolved={isResolved}
              isUploadingImage={isUploadingImage}
              messages={messages}
              messagesLoading={messagesLoading}
              messagesViewportRef={messagesViewportRef}
              pendingImage={pendingImage}
              resolving={resolving}
              selectedConversation={selectedConversation}
              onAssign={handleAssign}
              onBackToList={handleBackToList}
              onClearPendingImage={clearPendingImage}
              onComposerChange={handleComposerChange}
              onImageChange={handleImageChange}
              onKeyDown={handleKeyDown}
              onOpenImagePicker={openImagePicker}
              onResolve={handleResolve}
              onSendReply={sendReply}
              onSwitchToNoteMode={switchToNoteMode}
              onSwitchToReplyMode={switchToReplyMode}
            />
          ) : (
            <AdminChatEmptyState />
          )}

          <AdminChatDetailsPane
            isAssignedToMe={isAssignedToMe}
            isResolved={isResolved}
            messages={messages}
            assigning={assigning}
            resolving={resolving}
            selectedConversation={selectedConversation}
            onAssign={handleAssign}
            onResolve={handleResolve}
          />
        </div>
      </div>
    </div>
  )
}
