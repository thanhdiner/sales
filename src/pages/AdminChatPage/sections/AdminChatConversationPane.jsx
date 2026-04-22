import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ImagePlus,
  Loader2,
  Lock,
  Send,
  User,
  UserCheck,
  X
} from 'lucide-react'

import AgentMessageBubble from '../components/AgentMessageBubble'
import StatusBadge from '../components/StatusBadge'

function CustomerTypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
        <User className="h-4 w-4 text-white" />
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
    return null
  }

  return (
    <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex gap-1">
        <button
          type="button"
          onClick={onSwitchToReplyMode}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            !isNote
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Send className="h-3 w-3" />
          Phản hồi
        </button>
        <button
          type="button"
          onClick={onSwitchToNoteMode}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isNote
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Lock className="h-3 w-3" />
          Ghi chú nội bộ
        </button>
      </div>

      {pendingImage && !isNote && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="h-16 w-16 overflow-hidden rounded-lg ring-1 ring-black/5">
            <img src={pendingImage.previewUrl} alt={pendingImage.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Ảnh đính kèm</p>
            <p className="truncate text-xs text-gray-600 dark:text-gray-300">{pendingImage.name}</p>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">Ảnh sẽ được gửi khi bấm Send</p>
          </div>
          <button
            type="button"
            onClick={onClearPendingImage}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white hover:text-red-500 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-red-400"
            title="Xóa ảnh đính kèm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        className={`flex items-end gap-3 rounded-xl border px-4 py-3 transition-colors ${
          isNote
            ? 'border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/10'
            : 'border-gray-200 bg-gray-50 focus-within:border-blue-400 dark:border-gray-700 dark:bg-gray-800'
        }`}
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
          disabled={isNote || isUploadingImage}
          title={isNote ? 'Chỉ gửi ảnh ở chế độ phản hồi' : pendingImage ? 'Đổi ảnh đính kèm' : 'Đính kèm ảnh'}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 dark:disabled:text-gray-600"
        >
          {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </button>

        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={onComposerChange}
          onKeyDown={onKeyDown}
          placeholder={
            isNote
              ? '📝 Ghi chú (chỉ agent thấy)...'
              : pendingImage
                ? 'Thêm lời nhắn cho ảnh... (Enter để gửi)'
                : 'Nhập phản hồi... (Enter để gửi)'
          }
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100"
          style={{ maxHeight: '100px', overflowY: 'auto' }}
        />

        <button
          type="button"
          onClick={onSendReply}
          disabled={!canSend || isUploadingImage}
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white transition-all active:scale-95 disabled:cursor-not-allowed ${
            isNote
              ? 'bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-700'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700'
          }`}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>

      {!isAssignedToMe && selectedStatus === 'unassigned' && (
        <p className="mt-2 flex items-center gap-1 text-xs text-orange-500">
          <AlertCircle className="h-3 w-3" />
          Nhận chat trước khi phản hồi khách hàng
        </p>
      )}
    </div>
  )
}

export default function AdminChatConversationPane({
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
  messagesViewportRef,
  pendingImage,
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
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col border-r border-gray-100 dark:border-gray-800">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-3 py-3.5 dark:border-gray-800 dark:bg-gray-900 md:px-5">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className="p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white md:h-9 md:w-9 md:text-sm">
            {(selectedConversation?.customer?.name || 'K')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {selectedConversation?.customer?.name || 'Khách ẩn danh'}
            </p>
            <StatusBadge status={selectedConversation?.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedConversation?.status === 'unassigned' && (
            <button
              type="button"
              onClick={onAssign}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-700"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Nhận chat
            </button>
          )}
          {isAssignedToMe && !isResolved && (
            <button
              type="button"
              onClick={onResolve}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-700"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Giải quyết
            </button>
          )}
          {isResolved && (
            <span className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-3.5 w-3.5" />
              Đã giải quyết
            </span>
          )}
        </div>
      </div>

      <div ref={messagesViewportRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gray-50/50 px-5 py-4 dark:bg-gray-950">
        {messages.map((message, index) => (
          <AgentMessageBubble key={message._id || index} message={message} />
        ))}
        {customerTyping && <CustomerTypingIndicator />}
      </div>

      <AdminChatComposer
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
    </div>
  )
}
