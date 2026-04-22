import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Share2, X } from 'lucide-react'

const MAX_DIRECT_IMAGES = 6

function GalleryLightbox({ title, images, currentIndex, onClose, onSelectImage }) {
  const totalImages = images.length

  useEffect(() => {
    if (!totalImages) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        onSelectImage((currentIndex - 1 + totalImages) % totalImages)
        return
      }

      if (event.key === 'ArrowRight') {
        onSelectImage((currentIndex + 1) % totalImages)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, onClose, onSelectImage, totalImages])

  if (!totalImages) return null

  return (
    <div className="fixed inset-0 z-[1200] bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="flex h-full flex-col px-4 py-4 sm:px-6 sm:py-5" onClick={event => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold sm:text-lg">{title}</p>
            <p className="text-sm text-white/65">
              {currentIndex + 1} / {totalImages}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {totalImages > 1 && (
            <button
              type="button"
              onClick={() => onSelectImage((currentIndex - 1 + totalImages) % totalImages)}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div className="flex h-full w-full items-center justify-center px-12 sm:px-20">
            <img src={images[currentIndex]} alt={`${title} ${currentIndex + 1}`} className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl" />
          </div>

          {totalImages > 1 && (
            <button
              type="button"
              onClick={() => onSelectImage((currentIndex + 1) % totalImages)}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {totalImages > 1 && (
          <div className="mt-4 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-3">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => onSelectImage(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border transition-all sm:h-20 sm:w-20 ${
                    currentIndex === index
                      ? 'border-white opacity-100 ring-2 ring-white/40'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`${title} thumb ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductGallery({
  title,
  currentImage,
  galleryImages = [],
  selectedImage,
  discountPercent,
  isLiked,
  onSelectImage,
  onToggleLike
}) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const hasOverflowImages = galleryImages.length > MAX_DIRECT_IMAGES
  const visibleImages = useMemo(
    () => (hasOverflowImages ? galleryImages.slice(0, MAX_DIRECT_IMAGES + 1) : galleryImages),
    [galleryImages, hasOverflowImages]
  )
  const hiddenImageCount = Math.max(galleryImages.length - MAX_DIRECT_IMAGES, 0)

  const openGallery = startIndex => {
    onSelectImage(startIndex)
    setIsGalleryOpen(true)
  }

  const handleThumbnailClick = index => {
    const isSummaryImage = hasOverflowImages && index === MAX_DIRECT_IMAGES

    if (isSummaryImage) {
      openGallery(index)
      return
    }

    onSelectImage(index)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
            <button type="button" onClick={() => openGallery(selectedImage)} className="block w-full cursor-zoom-in">
              <div className="aspect-[16/9] max-h-[430px]">
                <img src={currentImage} alt={title} className="h-full w-full object-contain" />
              </div>
            </button>

            {discountPercent > 0 && (
              <div className="absolute left-3 top-3 rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
                -{discountPercent}%
              </div>
            )}

            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={onToggleLike}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Heart className={`h-[18px] w-[18px] ${isLiked ? 'fill-gray-900 text-gray-900 dark:fill-white dark:text-white' : ''}`} />
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Share2 className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mẫu ảnh</p>
              <span className="text-xs text-gray-400">{galleryImages.length} ảnh</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {visibleImages.map((image, index) => {
                const isSummaryImage = hasOverflowImages && index === MAX_DIRECT_IMAGES
                const isSelected = isSummaryImage ? selectedImage >= MAX_DIRECT_IMAGES : selectedImage === index

                return (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition-colors dark:bg-gray-900 ${
                      isSelected ? 'border-gray-900 dark:border-white' : 'border-gray-200 opacity-70 hover:opacity-100 dark:border-gray-700'
                    }`}
                  >
                    <img src={image} alt={`${title} mẫu ${index + 1}`} className="h-full w-full object-cover" />

                    {isSummaryImage && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                        +{hiddenImageCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {isGalleryOpen && (
        <GalleryLightbox
          title={title}
          images={galleryImages}
          currentIndex={selectedImage}
          onClose={() => setIsGalleryOpen(false)}
          onSelectImage={onSelectImage}
        />
      )}
    </>
  )
}

export default ProductGallery
