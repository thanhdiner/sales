import { useRef, useState } from 'react'
import { message } from 'antd'
import { Send, Star, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FilePreview, MediaUploadButton } from './ReviewMediaPreview'

export default function ReviewForm({ initial, onSubmit, onCancel, loading }) {
  const { t } = useTranslation('clientProducts')
  const [rating, setRating] = useState(initial?.rating || 5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [newFiles, setNewFiles] = useState([])
  const [keepImages, setKeepImages] = useState(initial?.images || [])
  const [keepVideos, setKeepVideos] = useState(initial?.videos || [])
  const fileInputRef = useRef()

  const handleFiles = event => {
    const pickedFiles = Array.from(event.target.files)
    setNewFiles(prevFiles => [...prevFiles, ...pickedFiles])
    event.target.value = ''
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (!rating) {
      message.warning(t('productDetail.reviewForm.message.ratingRequired'))
      return
    }

    const formData = new FormData()
    formData.append('rating', rating)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('keepImages', JSON.stringify(keepImages))
    formData.append('keepVideos', JSON.stringify(keepVideos))
    newFiles.forEach(file => formData.append('files', file))

    onSubmit(formData)
  }

  const displayRating = hoverRating || rating

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">{t('productDetail.reviewForm.ratingLabel')}</p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={t('productDetail.reviewForm.ratingButton', { count: star })}
                title={t('productDetail.reviewForm.ratingButton', { count: star })}
                className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={28}
                  className={star <= displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                />
              </button>
            ))}
          </div>

          {displayRating > 0 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {t(`productDetail.reviewForm.starLabels.${displayRating}`)}
            </span>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder={t('productDetail.reviewForm.titlePlaceholder')}
        value={title}
        onChange={event => setTitle(event.target.value)}
        maxLength={200}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500"
      />

      <div>
        <textarea
          placeholder={t('productDetail.reviewForm.contentPlaceholder')}
          value={content}
          onChange={event => setContent(event.target.value)}
          maxLength={2000}
          rows={4}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500"
        />

        <div className="mt-1 text-right text-xs text-gray-400">{content.length}/2000</div>
      </div>

      {(keepImages.length > 0 || keepVideos.length > 0) && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">{t('productDetail.reviewForm.currentMedia')}</p>

          <div className="flex flex-wrap gap-2">
            {keepImages.map((url, index) => (
              <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <img src={url} alt="" className="h-full w-full object-cover" />

                <button
                  type="button"
                  onClick={() => setKeepImages(prevImages => prevImages.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label={t('productDetail.reviewForm.removeImage')}
                  title={t('productDetail.reviewForm.removeImage')}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {keepVideos.map((url, index) => (
              <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <video src={url} className="h-full w-full object-cover" muted />

                <button
                  type="button"
                  onClick={() => setKeepVideos(prevVideos => prevVideos.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label={t('productDetail.reviewForm.removeVideo')}
                  title={t('productDetail.reviewForm.removeVideo')}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <MediaUploadButton onClick={() => fileInputRef.current?.click()} />

        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFiles} />

        <FilePreview
          files={newFiles}
          onRemove={index => setNewFiles(prevFiles => prevFiles.filter((_, itemIndex) => itemIndex !== index))}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {loading ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <Send size={16} />
          )}

          {initial ? t('productDetail.reviewForm.update') : t('productDetail.reviewForm.submit')}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {t('productDetail.reviewForm.cancel')}
          </button>
        )}
      </div>
    </form>
  )
}
