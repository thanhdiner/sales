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
    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
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

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-colors">
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
          className="w-8 h-8 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-600 flex items-center justify-center flex-shrink-0 transition-colors"
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
          className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 leading-5 py-1"
          style={{ maxHeight: '80px', overflowY: 'auto' }}
        />

        <button
          onClick={onSendMessage}
          disabled={!canSend || isUploadingImage}
          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
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
