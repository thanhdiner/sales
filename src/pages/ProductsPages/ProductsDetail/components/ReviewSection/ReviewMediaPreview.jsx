import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ImageIcon, VideoIcon, X } from 'lucide-react'
import { getReviewMedia } from './utils'

export const Lightbox = ({ items, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex)

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const item = items[idx]

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 px-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {idx > 0 && (
        <button
          type="button"
          className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          onClick={event => {
            event.stopPropagation()
            setIdx(current => current - 1)
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {idx < items.length - 1 && (
        <button
          type="button"
          className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          onClick={event => {
            event.stopPropagation()
            setIdx(current => current + 1)
          }}
        >
          <ChevronRight size={28} />
        </button>
      )}

      <div
        className="flex max-h-[90vh] max-w-5xl items-center justify-center"
        onClick={event => event.stopPropagation()}
      >
        {item?.isVideo ? (
          <video src={item.url} controls autoPlay className="max-h-[85vh] max-w-full rounded-xl" />
        ) : (
          <img src={item.url} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
        )}
      </div>

      <div className="absolute bottom-5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
        {idx + 1} / {items.length}
      </div>
    </div>
  )
}

export const FilePreview = ({ files, onRemove }) => {
  if (!files.length) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="group relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        >
          {file.type.startsWith('video') ? (
            <video src={URL.createObjectURL(file)} className="h-full w-full object-cover" muted />
          ) : (
            <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
          )}

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}

export const MediaGallery = ({ reviews }) => {
  const [lightbox, setLightbox] = useState(null)
  const allMedia = reviews.flatMap(getReviewMedia)

  if (!allMedia.length) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Ảnh & video từ khách hàng
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">{allMedia.length} tệp</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {allMedia.slice(0, 12).map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setLightbox(index)}
            className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-transform hover:scale-[1.03] sm:h-20 sm:w-20 dark:border-gray-700 dark:bg-gray-800"
          >
            {item.isVideo ? (
              <>
                <video src={item.url} className="h-full w-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <VideoIcon size={18} className="text-white" />
                </div>
              </>
            ) : (
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}

        {allMedia.length > 12 && (
          <button
            type="button"
            onClick={() => setLightbox(12)}
            className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 sm:h-20 sm:w-20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            +{allMedia.length - 12}
          </button>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox items={allMedia} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}

export const MediaUploadButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
  >
    <ImageIcon size={16} />
    <VideoIcon size={16} />
    Thêm ảnh / video
  </button>
)
