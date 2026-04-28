import { useCallback, useState } from 'react'
import SEO from '@/components/SEO'
import { CheckCircle, Inbox, MessageCircle, RefreshCw, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAdminChatPage } from './hooks/useAdminChatPage'
import ImagePreviewModal from './components/ImagePreviewModal'
import AdminChatConversationPane from './sections/AdminChatConversationPane'
import AdminChatDetailsPane from './sections/AdminChatDetailsPane'
import AdminChatEmptyState from './sections/AdminChatEmptyState'
import AdminChatSidebar from './sections/AdminChatSidebar'

const CHAT_FILTERS = [
  {
    key: 'unassigned',
    labelKey: 'tabs.unassigned',
    Icon: Inbox
  },
  {
    key: 'mine',
    labelKey: 'tabs.mine',
    Icon: UserCheck
  },
  {
    key: 'open',
    labelKey: 'tabs.open',
    Icon: MessageCircle
  },
  {
    key: 'resolved',
    labelKey: 'tabs.resolved',
    Icon: CheckCircle
  }
]

function AdminChatFilters({ activeTab, counts, onTabChange }) {
  const { t } = useTranslation('adminChat')

  return (
    <div className="flex flex-wrap gap-2">
      {CHAT_FILTERS.map(({ key, labelKey, Icon }) => {
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
            <span>{t(labelKey)}</span>
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
  const { t } = useTranslation('adminChat')
  const [previewImage, setPreviewImage] = useState(null)
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
    quickReplies,
    quickRepliesLoading,
    reactionActor,
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
    handleInsertQuickReply,
    handleKeyDown,
    handleLoadMoreConversations,
    handleRefresh,
    handleReactToMessage,
    handleResolve,
    handleSearchChange,
    handleSelectConversation,
    handleTabChange,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode
  } = useAdminChatPage()

  const handleOpenImagePreview = useCallback(image => {
    setPreviewImage(image)
  }, [])

  const handleCloseImagePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])

  return (
    <div className="admin-chat-page flex h-full min-h-0 overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-[var(--admin-shadow)]">
      <SEO title={t('seo.title')} noIndex />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-[var(--admin-text)]">{t('page.title')}</h1>
            <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">
              {t('page.description')}
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
              {refreshing ? t('page.refreshing') : t('page.refresh')}
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
              quickReplies={quickReplies}
              quickRepliesLoading={quickRepliesLoading}
              reactionActor={reactionActor}
              resolving={resolving}
              selectedConversation={selectedConversation}
              onAssign={handleAssign}
              onBackToList={handleBackToList}
              onClearPendingImage={clearPendingImage}
              onComposerChange={handleComposerChange}
              onImageChange={handleImageChange}
              onInsertQuickReply={handleInsertQuickReply}
              onKeyDown={handleKeyDown}
              onOpenImagePreview={handleOpenImagePreview}
              onOpenImagePicker={openImagePicker}
              onReactToMessage={handleReactToMessage}
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

      <ImagePreviewModal image={previewImage} onClose={handleCloseImagePreview} />
    </div>
  )
}
