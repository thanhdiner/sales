import React from 'react'
import { ImagePlus, Loader2, Send, Sparkles, User, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function MessageInput({
  input,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onImageChange,
  onOpenImagePicker,
  onRemovePendingImage,
  onClearPendingImages,
  messages,
  conversation,
  onSwitchToBot,
  onRequestHuman,
  inputRef,
  imageInputRef,
  pendingImages,
  canSend,
  isUploadingImage,
  maxImages
}) {
  const { t } = useTranslation('clientChat')
  const hasPendingImages = pendingImages.length > 0

  return (
    <div className="p-2.5 bg-white/95 dark:bg-[#101415] border-t border-gray-100/80 dark:border-white/[0.06] flex-shrink-0">
      {hasPendingImages && (
        <div className="mb-2 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                {t('input.attachmentsTitle', { current: pendingImages.length, max: maxImages })}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                {t('input.attachmentsDescription')}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearPendingImages}
              className="rounded-lg px-2 py-1 text-[11px] text-gray-500 hover:bg-white hover:text-red-500 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-red-400 transition-colors"
              title={t('input.clearAllTitle')}
            >
              {t('input.clearAll')}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {pendingImages.map(image => (
              <div key={image.id} className="relative overflow-hidden rounded-lg ring-1 ring-black/5">
                <img src={image.previewUrl} alt={image.name} className="h-16 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemovePendingImage(image.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/65 p-1 text-white transition-colors hover:bg-black/80"
                  title={t('input.removeImage', { name: image.name })}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="smartmall-live-chat-composer flex items-end gap-2 rounded-2xl border border-gray-200/80 bg-gray-50/90 px-2 py-1.5 shadow-sm transition-all focus-within:border-emerald-400/70 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.055] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:focus-within:border-emerald-400/60">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onImageChange}
        />
        <button
          type="button"
          onClick={onOpenImagePicker}
          disabled={isUploadingImage}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:disabled:text-gray-600"
          title={hasPendingImages ? t('input.addImage') : t('input.attachImage')}
        >
          {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
        </button>

        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder={hasPendingImages ? t('input.imagePlaceholder') : t('input.placeholder')}
          className="smartmall-live-chat-composer__input min-h-8 flex-1 resize-none rounded-none !border-0 !bg-transparent px-1 py-1.5 text-sm leading-5 text-gray-800 !shadow-none outline-none placeholder:text-gray-400 focus:!border-0 focus:!bg-transparent focus:!shadow-none dark:text-gray-100 dark:placeholder:!text-gray-500"
          style={{ maxHeight: '80px', overflowY: 'auto' }}
        />

        <button
          onClick={onSendMessage}
          disabled={!canSend || isUploadingImage}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:bg-emerald-500/90 dark:hover:bg-emerald-400 dark:disabled:bg-white/10 dark:disabled:text-gray-500"
          aria-label={t('input.send')}
          title={t('input.send')}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {messages.length > 0 && (
        <>
          {conversation?.botStats?.escalated || conversation?.assignedAgent?.agentId ? (
            <button
              onClick={onSwitchToBot}
              className="w-full mt-2 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {t('input.switchToBot')}
            </button>
          ) : (
            <button
              onClick={onRequestHuman}
              className="w-full mt-2 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3" />
              {t('input.requestHuman')}
            </button>
          )}
        </>
      )}
    </div>
  )
}
