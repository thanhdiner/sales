import { useCallback, useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ImagePlus,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  User,
  UserCheck,
  X
} from 'lucide-react'

import AgentMessageBubble from '../components/AgentMessageBubble'
import StatusBadge from '../components/StatusBadge'

const SCROLL_TO_LATEST_THRESHOLD = 96

function CustomerAvatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-surface-2)] text-sm font-semibold text-[var(--admin-text)]">
      {(name || 'K')[0].toUpperCase()}
    </div>
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

function CustomerTypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-surface)] shadow-sm ring-1 ring-[var(--admin-border)]">
        <User className="h-4 w-4 text-[var(--admin-text-muted)]" />
      </div>

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
  selectedStatus,
  onClearPendingImage,
  onComposerChange,
  onImageChange,
  onKeyDown,
  onOpenImagePicker,
  onSendReply,
  onSwitchToNoteMode,
  onSwitchToReplyMode
}) {
  if (isResolved) {
    return (
      <div className="shrink-0 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3">
        <div className="rounded-lg border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] px-3 py-2 text-sm font-medium text-[#15803d] dark:text-[#4ade80]">
          Hội thoại đã được đánh dấu giải quyết.
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
          Phản hồi
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
          Ghi chú nội bộ
        </button>
      </div>

      {pendingImage && !isNote && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-2.5">
          <div className="h-16 w-16 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <img src={pendingImage.previewUrl} alt={pendingImage.name} className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-text-subtle)]">
              Ảnh đính kèm
            </p>
            <p className="truncate text-sm text-[var(--admin-text)]">{pendingImage.name}</p>
            <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">
              Ảnh sẽ được gửi cùng phản hồi.
            </p>
          </div>

          <button
            type="button"
            onClick={onClearPendingImage}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface)] hover:text-red-500 dark:hover:text-red-400"
            title="Xóa ảnh đính kèm"
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
          title={isNote ? 'Chỉ gửi ảnh ở chế độ phản hồi' : pendingImage ? 'Đổi ảnh đính kèm' : 'Đính kèm ảnh'}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:text-[var(--admin-text-subtle)]"
        >
          {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </button>

        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={onComposerChange}
          onKeyDown={onKeyDown}
          disabled={inputDisabled}
          placeholder={
            !canReplyToConversation
              ? 'Nhận chat để phản hồi khách hàng'
              : isNote
                ? 'Ghi chú nội bộ, chỉ agent thấy...'
                : pendingImage
                  ? 'Thêm lời nhắn cho ảnh...'
                  : 'Nhập phản hồi...'
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
          aria-label={isNote ? 'Gửi ghi chú' : 'Gửi phản hồi'}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {!isAssignedToMe && selectedStatus === 'unassigned' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#b45309] dark:text-[#fbbf24]">
          <AlertCircle className="h-3.5 w-3.5" />
          Nhận chat trước khi phản hồi khách hàng.
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
  resolving,
  selectedConversation,
  onAssign,
  onBackToList,
  onClearPendingImage,
  onComposerChange,
  onImageChange,
  onKeyDown,
  onOpenImagePicker,
  onResolve,
  onSendReply,
  onSwitchToNoteMode,
  onSwitchToReplyMode
}) {
  const customerName = selectedConversation?.customer?.name || 'Khách ẩn danh'
  const currentPage = selectedConversation?.customer?.currentPage
  const [showScrollToLatest, setShowScrollToLatest] = useState(false)
  const sessionLabel = selectedConversation?.sessionId
    ? `#${selectedConversation.sessionId.slice(-8).toUpperCase()}`
    : 'Phiên mới'

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
            aria-label="Quay lại danh sách hội thoại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <CustomerAvatar name={customerName} />

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
              <span className="hidden sm:inline">{assigning ? 'Đang nhận' : 'Nhận chat'}</span>
              <span className="sm:hidden">{assigning ? '...' : 'Nhận'}</span>
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
              <span className="hidden sm:inline">{resolving ? 'Đang lưu' : 'Giải quyết'}</span>
              <span className="sm:hidden">{resolving ? '...' : 'Xong'}</span>
            </button>
          )}

          {isResolved && (
            <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,#22c55e_30%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_14%,var(--admin-surface-2))] px-3 text-xs font-semibold text-[#15803d] dark:text-[#4ade80]">
              <CheckCircle className="h-3.5 w-3.5" />
              Đã giải quyết
            </span>
          )}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={messagesViewportRef}
          className="h-full space-y-3 overflow-y-auto bg-[var(--admin-bg-soft)] px-4 py-4 md:px-5"
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
                  Chưa có tin nhắn
                </p>
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                  Khi khách hàng nhắn tin, lịch sử sẽ xuất hiện tại đây.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <AgentMessageBubble key={message._id || index} message={message} />
            ))
          )}
          {customerTyping && <CustomerTypingIndicator />}
        </div>

        <button
          type="button"
          onClick={scrollToLatestMessage}
          aria-label="Scroll to newest message"
          title="Xuong tin nhan moi nhat"
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
        selectedStatus={selectedConversation?.status}
        onClearPendingImage={onClearPendingImage}
        onComposerChange={onComposerChange}
        onImageChange={onImageChange}
        onKeyDown={onKeyDown}
        onOpenImagePicker={onOpenImagePicker}
        onSendReply={onSendReply}
        onSwitchToNoteMode={onSwitchToNoteMode}
        onSwitchToReplyMode={onSwitchToReplyMode}
      />
    </main>
  )
}
