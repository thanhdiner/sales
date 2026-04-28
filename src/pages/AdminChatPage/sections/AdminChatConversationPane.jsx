import { useCallback, useEffect, useMemo, useState } from 'react'
import { Empty, Popover, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ImagePlus,
  Loader2,
  Lock,
  MessageCircle,
  Search,
  Send,
  TextQuote,
  UserCheck,
  X
} from 'lucide-react'

import AgentMessageBubble from '../components/AgentMessageBubble'
import ChatAvatar, { getAvatarSrc, getInitials } from '../components/ChatAvatar'
import StatusBadge from '../components/StatusBadge'

const SCROLL_TO_LATEST_THRESHOLD = 96
const QUICK_REPLY_CATEGORY_ORDER = ['greeting', 'info', 'order', 'payment', 'shipping', 'warranty', 'product', 'closing', 'other']

function getQuickReplyCategoryRank(category) {
  const index = QUICK_REPLY_CATEGORY_ORDER.indexOf(category || 'other')
  return index === -1 ? QUICK_REPLY_CATEGORY_ORDER.length : index
}

function sortQuickReplyCategories(left, right) {
  const rankDiff = getQuickReplyCategoryRank(left) - getQuickReplyCategoryRank(right)
  return rankDiff || String(left || '').localeCompare(String(right || ''))
}

function sortQuickReplies(left, right) {
  const rankDiff = getQuickReplyCategoryRank(left?.category) - getQuickReplyCategoryRank(right?.category)
  return rankDiff || String(left?.title || '').localeCompare(String(right?.title || ''))
}

function CustomerAvatar({ name, src }) {
  return (
    <ChatAvatar
      src={src}
      alt=""
      className="h-10 w-10 rounded-xl bg-[var(--admin-surface-2)] text-sm font-semibold text-[var(--admin-text)]"
    >
      {getInitials(name, 'K')}
    </ChatAvatar>
  )
}

function MessageSkeletonList() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="h-8 w-8 rounded-xl bg-[var(--admin-surface-3)]" />
        <div className="h-16 w-64 max-w-[70%] animate-pulse rounded-2xl rounded-bl-sm bg-[var(--admin-surface-3)]" />
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-72 max-w-[70%] animate-pulse rounded-2xl rounded-br-sm bg-[var(--admin-surface-3)]" />
      </div>
      <div className="flex items-end gap-2">
        <div className="h-8 w-8 rounded-xl bg-[var(--admin-surface-3)]" />
        <div className="h-20 w-80 max-w-[70%] animate-pulse rounded-2xl rounded-bl-sm bg-[var(--admin-surface-3)]" />
      </div>
    </div>
  )
}

function CustomerTypingIndicator({ name, src }) {
  return (
    <div className="flex items-end gap-2">
      <ChatAvatar
        src={src}
        alt=""
        className="h-8 w-8 rounded-xl bg-[var(--admin-surface)] text-xs font-semibold text-[var(--admin-text-muted)] shadow-sm ring-1 ring-[var(--admin-border)]"
      >
        {getInitials(name, 'K')}
      </ChatAvatar>

      <div className="rounded-2xl rounded-bl-sm border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 shadow-sm">
        <div className="flex h-4 items-center gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  )
}

function getQuickReplyCategoryLabel(category, t) {
  const categoryKey = category || 'other'
  return t(`quickReplies.categories.${categoryKey}`, {
    defaultValue: category || t('quickReplies.categories.other')
  })
}

function QuickRepliesPopover({
  disabled,
  loading,
  quickReplies = [],
  onInsertQuickReply
}) {
  const { t } = useTranslation('adminChat')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    const values = new Set()
    quickReplies.forEach(reply => {
      if (reply?.category) values.add(reply.category)
    })

    return Array.from(values).sort(sortQuickReplyCategories)
  }, [quickReplies])

  const filteredReplies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return quickReplies.filter(reply => {
      if (category !== 'all' && reply.category !== category) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      return [
        reply.title,
        reply.shortcut,
        reply.category,
        reply.content
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(normalizedSearch))
    }).sort(sortQuickReplies)
  }, [category, quickReplies, search])

  const handleInsert = reply => {
    onInsertQuickReply(reply)
    setOpen(false)
    setSearch('')
    setCategory('all')
  }

  useEffect(() => {
    if (disabled && open) {
      setOpen(false)
    }
  }, [disabled, open])

  const content = (
    <div className="admin-chat-quick-replies-panel w-[min(400px,calc(100vw-32px))]">
      <div className="mb-3">
        <p className="text-sm font-semibold text-[var(--admin-text)]">
          {t('quickReplies.title')}
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3">
        <Search className="h-4 w-4 shrink-0 text-[var(--admin-text-subtle)]" strokeWidth={1.8} />
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder={t('quickReplies.searchPlaceholder')}
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-subtle)]"
        />
      </div>

      {categories.length > 0 && (
        <div className="mb-3 flex max-h-16 flex-wrap gap-2 overflow-y-auto">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
              category === 'all'
                ? 'border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
                : 'border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)]'
            }`}
          >
            {t('quickReplies.all')}
          </button>

          {categories.map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                category === value
                  ? 'border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
                  : 'border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)]'
              }`}
            >
              {getQuickReplyCategoryLabel(value, t)}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-80 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex h-28 items-center justify-center">
            <Spin size="small" />
          </div>
        ) : filteredReplies.length > 0 ? (
          <div className="space-y-2">
            {filteredReplies.map(reply => (
              <button
                key={reply._id || `${reply.shortcut}-${reply.title}`}
                type="button"
                onClick={() => handleInsert(reply)}
                className="block w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 text-left transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[var(--admin-text)]">
                      {reply.title}
                    </span>
                    <span className="mt-1 block max-h-10 overflow-hidden text-xs leading-5 text-[var(--admin-text-muted)]">
                      {reply.content}
                    </span>
                  </span>

                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="rounded-md bg-[var(--admin-surface-2)] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[var(--admin-accent)]">
                      {reply.shortcut}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--admin-text-subtle)]">
                      {t('quickReplies.insert')}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('quickReplies.empty')} />
        )}
      </div>

      <div className="mt-3 border-t border-[var(--admin-border)] pt-3">
        <Link
          to="/admin/live-chat/quick-replies"
          onClick={() => setOpen(false)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[var(--admin-accent)] transition-colors hover:bg-[var(--admin-accent-soft)]"
        >
          <span aria-hidden="true">+</span>
          {t('quickReplies.manage')}
        </Link>
      </div>
    </div>
  )

  return (
    <Popover
      trigger="click"
      placement="topLeft"
      open={open}
      onOpenChange={nextOpen => setOpen(nextOpen)}
      content={content}
      overlayClassName="admin-chat-quick-replies-popover"
    >
      <button
        type="button"
        disabled={disabled}
        title={t('quickReplies.button')}
        aria-label={t('quickReplies.button')}
        className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 ${
          open ? 'bg-[var(--admin-surface)] text-[var(--admin-text)]' : ''
        }`}
      >
        <TextQuote className="h-4 w-4" />
        <span className="hidden sm:inline">{t('quickReplies.button')}</span>
      </button>
    </Popover>
  )
}

function AdminChatComposer({
  canReplyToConversation,
  canSend,
  input,
  inputRef,
  imageInputRef,
  isAssignedToMe,
  isNote,
  isResolved,
  isUploadingImage,
  pendingImage,
  quickReplies,
  quickRepliesLoading,
  selectedStatus,
  onClearPendingImage,
  onComposerChange,
  onImageChange,
  onInsertQuickReply,
  onKeyDown,
  onOpenImagePicker,
  onSendReply,
  onSwitchToNoteMode,
  onSwitchToReplyMode
}) {
  const { t } = useTranslation('adminChat')

  if (isResolved) {
    return (
      <div className="shrink-0 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3">
        <div className="rounded-lg border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] px-3 py-2 text-sm font-medium text-[#15803d] dark:text-[#4ade80]">
          {t('composer.resolvedNotice')}
        </div>
      </div>
    )
  }

  const inputDisabled = !canReplyToConversation || isUploadingImage

  return (
    <div className="shrink-0 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSwitchToReplyMode}
          disabled={!canReplyToConversation}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            !isNote
              ? 'bg-[var(--admin-accent)] text-[#f4f5f8] hover:bg-[color-mix(in_srgb,var(--admin-accent)_88%,#000000)]'
              : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)]'
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          {t('composer.replyMode')}
        </button>

        <button
          type="button"
          onClick={onSwitchToNoteMode}
          disabled={!canReplyToConversation}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isNote
              ? 'border border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_14%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]'
              : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)]'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          {t('composer.noteMode')}
        </button>

      </div>

      {pendingImage && !isNote && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-2.5">
          <div className="h-16 w-16 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <img src={pendingImage.previewUrl} alt={pendingImage.name} className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)]">
              {t('composer.attachedImage')}
            </p>
            <p className="truncate text-sm text-[var(--admin-text)]">{pendingImage.name}</p>
            <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">
              {t('composer.attachedImageDescription')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClearPendingImage}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface)] hover:text-red-500 dark:hover:text-red-400"
            title={t('composer.removeAttachedImage')}
            aria-label={t('composer.removeAttachedImage')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        className={`flex items-end gap-3 rounded-xl border px-3 py-3 transition-colors ${
          isNote
            ? 'border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_12%,var(--admin-surface-2))]'
            : 'border-[var(--admin-border)] bg-[var(--admin-surface-2)] focus-within:border-[var(--admin-accent)] focus-within:bg-[var(--admin-surface)]'
        } ${!canReplyToConversation ? 'opacity-75' : ''}`}
      >
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />

        <button
          type="button"
          onClick={onOpenImagePicker}
          disabled={isNote || isUploadingImage || !canReplyToConversation}
          title={isNote ? t('composer.replyImageOnly') : pendingImage ? t('composer.changeImage') : t('composer.attachImage')}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:text-[var(--admin-text-subtle)]"
        >
          {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </button>

        <QuickRepliesPopover
          disabled={!canReplyToConversation || isNote || isUploadingImage}
          loading={quickRepliesLoading}
          quickReplies={quickReplies}
          onInsertQuickReply={onInsertQuickReply}
        />

        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={onComposerChange}
          onKeyDown={onKeyDown}
          disabled={inputDisabled}
          placeholder={
            !canReplyToConversation
              ? t('composer.takeChatPlaceholder')
              : isNote
                ? t('composer.notePlaceholder')
                : pendingImage
                  ? t('composer.imagePlaceholder')
                  : t('composer.replyPlaceholder')
          }
          className="min-h-9 flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-[var(--admin-text)] outline-none placeholder-[var(--admin-text-subtle)] disabled:cursor-not-allowed"
          style={{ maxHeight: '100px', overflowY: 'auto' }}
        />

        <button
          type="button"
          onClick={onSendReply}
          disabled={!canSend || isUploadingImage}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#f4f5f8] transition-colors disabled:cursor-not-allowed disabled:bg-[var(--admin-surface-3)] disabled:text-[var(--admin-text-subtle)] ${
            isNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[var(--admin-accent)] hover:bg-[color-mix(in_srgb,var(--admin-accent)_88%,#000000)]'
          }`}
          aria-label={isNote ? t('composer.sendNote') : t('composer.sendReply')}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {!isAssignedToMe && selectedStatus === 'unassigned' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#b45309] dark:text-[#fbbf24]">
          <AlertCircle className="h-3.5 w-3.5" />
          {t('composer.assignFirst')}
        </p>
      )}
    </div>
  )
}

export default function AdminChatConversationPane({
  assigning,
  canReplyToConversation,
  canSend,
  customerTyping,
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
  selectedConversation,
  onAssign,
  onBackToList,
  onClearPendingImage,
  onComposerChange,
  onImageChange,
  onInsertQuickReply,
  onKeyDown,
  onOpenImagePreview,
  onOpenImagePicker,
  onReactToMessage,
  onResolve,
  onSendReply,
  onSwitchToNoteMode,
  onSwitchToReplyMode
}) {
  const { t } = useTranslation('adminChat')
  const customerName = selectedConversation?.customer?.name || t('conversation.anonymousCustomer')
  const customerAvatar = getAvatarSrc(
    selectedConversation?.customer?.avatar,
    selectedConversation?.customer?.avatarUrl,
    selectedConversation?.customer?.photoURL,
    selectedConversation?.customer?.photoUrl,
    selectedConversation?.customer?.picture
  )
  const currentPage = selectedConversation?.customer?.currentPage
  const [showScrollToLatest, setShowScrollToLatest] = useState(false)
  const sessionLabel = selectedConversation?.sessionId
    ? `#${selectedConversation.sessionId.slice(-8).toUpperCase()}`
    : t('conversation.newSession')

  const syncScrollToLatestButton = useCallback(() => {
    const viewport = messagesViewportRef.current
    if (!viewport) {
      setShowScrollToLatest(false)
      return
    }

    const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    setShowScrollToLatest(distanceFromBottom > SCROLL_TO_LATEST_THRESHOLD)
  }, [messagesViewportRef])

  const scrollToLatestMessage = useCallback(() => {
    const viewport = messagesViewportRef.current
    if (!viewport) return

    const top = Math.max(viewport.scrollHeight - viewport.clientHeight, 0)

    if (typeof viewport.scrollTo === 'function') {
      viewport.scrollTo({ top, behavior: 'smooth' })
    } else {
      viewport.scrollTop = top
    }

    setShowScrollToLatest(false)
  }, [messagesViewportRef])

  useEffect(() => {
    const viewport = messagesViewportRef.current
    if (!viewport) {
      setShowScrollToLatest(false)
      return undefined
    }

    syncScrollToLatestButton()
    viewport.addEventListener('scroll', syncScrollToLatestButton, { passive: true })
    window.addEventListener('resize', syncScrollToLatestButton)

    return () => {
      viewport.removeEventListener('scroll', syncScrollToLatestButton)
      window.removeEventListener('resize', syncScrollToLatestButton)
    }
  }, [messagesViewportRef, syncScrollToLatestButton])

  useEffect(() => {
    const frameId = requestAnimationFrame(syncScrollToLatestButton)
    return () => cancelAnimationFrame(frameId)
  }, [customerTyping, messages, messagesLoading, selectedConversation?.sessionId, syncScrollToLatestButton])

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-3.5 md:px-5">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)] md:hidden"
            aria-label={t('conversation.backToList')}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <CustomerAvatar name={customerName} src={customerAvatar} />

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold text-[var(--admin-text)]">
                {customerName}
              </p>
              <span className="hidden rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--admin-text-subtle)] sm:inline-flex">
                {sessionLabel}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={selectedConversation?.status} />
              {currentPage && (
                <span className="hidden max-w-[260px] truncate text-xs text-[var(--admin-text-muted)] xl:inline">
                  {currentPage}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {selectedConversation?.status === 'unassigned' && (
            <button
              type="button"
              onClick={onAssign}
              disabled={assigning}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--admin-accent)] px-3 text-xs font-semibold text-[#f4f5f8] transition-colors hover:bg-[color-mix(in_srgb,var(--admin-accent)_88%,#000000)] disabled:cursor-wait disabled:opacity-70"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{assigning ? t('conversation.assigning') : t('conversation.assign')}</span>
              <span className="sm:hidden">{assigning ? '...' : t('conversation.assignShort')}</span>
            </button>
          )}

          {isAssignedToMe && !isResolved && (
            <button
              type="button"
              onClick={onResolve}
              disabled={resolving}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{resolving ? t('conversation.resolving') : t('conversation.resolve')}</span>
              <span className="sm:hidden">{resolving ? '...' : t('conversation.resolveShort')}</span>
            </button>
          )}

          {isResolved && (
            <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] px-3 text-xs font-semibold text-[#15803d] dark:text-[#4ade80]">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('conversation.resolved')}
            </span>
          )}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={messagesViewportRef}
          className="h-full space-y-3 overflow-x-hidden overflow-y-auto bg-[var(--admin-bg-soft)] px-4 py-4 md:px-5"
        >
          {messagesLoading ? (
            <MessageSkeletonList />
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-xs text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-subtle)]">
                  <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-medium text-[var(--admin-text)]">
                  {t('conversation.emptyTitle')}
                </p>
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                  {t('conversation.emptyDescription')}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <AgentMessageBubble
                key={message._id || index}
                message={message}
                onOpenImagePreview={onOpenImagePreview}
                onReactToMessage={onReactToMessage}
                reactionActor={reactionActor}
              />
            ))
          )}
          {customerTyping && <CustomerTypingIndicator name={customerName} src={customerAvatar} />}
        </div>

        <button
          type="button"
          onClick={scrollToLatestMessage}
          aria-label={t('conversation.scrollLatest')}
          title={t('conversation.scrollLatest')}
          className={`absolute bottom-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-surface)_92%,transparent)] text-[var(--admin-text-muted)] shadow-[var(--admin-shadow)] backdrop-blur transition-all duration-200 hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text)] ${
            showScrollToLatest
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-2 opacity-0 pointer-events-none'
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <AdminChatComposer
        canReplyToConversation={canReplyToConversation}
        canSend={canSend}
        input={input}
        inputRef={inputRef}
        imageInputRef={imageInputRef}
        isAssignedToMe={isAssignedToMe}
        isNote={isNote}
        isResolved={isResolved}
        isUploadingImage={isUploadingImage}
        pendingImage={pendingImage}
        quickReplies={quickReplies}
        quickRepliesLoading={quickRepliesLoading}
        selectedStatus={selectedConversation?.status}
        onClearPendingImage={onClearPendingImage}
        onComposerChange={onComposerChange}
        onImageChange={onImageChange}
        onInsertQuickReply={onInsertQuickReply}
        onKeyDown={onKeyDown}
        onOpenImagePicker={onOpenImagePicker}
        onSendReply={onSendReply}
        onSwitchToNoteMode={onSwitchToNoteMode}
        onSwitchToReplyMode={onSwitchToReplyMode}
      />
    </main>
  )
}
