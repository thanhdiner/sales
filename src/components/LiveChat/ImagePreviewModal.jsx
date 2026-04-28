import { useEffect } from 'react'
import { Download, ExternalLink, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const getDownloadFileName = url => {
  try {
    const parsedUrl = new URL(url, window.location.href)
    const fileName = parsedUrl.pathname.split('/').filter(Boolean).pop()
    return fileName || 'chat-image'
  } catch {
    return 'chat-image'
  }
}

export default function ImagePreviewModal({ image, onClose }) {
  const { t, i18n } = useTranslation('clientChat')

  useEffect(() => {
    if (!image) return undefined

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [image, onClose])

  if (!image) return null

  const timeLocale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
  const timeLabel = image.createdAt
    ? new Intl.DateTimeFormat(timeLocale, { hour: '2-digit', minute: '2-digit' }).format(new Date(image.createdAt))
    : ''
  const senderName = image.senderName || t('imagePreview.unknownSender')
  const metadata = timeLabel
    ? t('imagePreview.metadata', { senderName, time: timeLabel })
    : senderName

  const handleOpenNewTab = () => {
    window.open(image.url, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = getDownloadFileName(image.url)
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3 pt-16 text-white backdrop-blur-sm sm:p-5 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-label={t('imagePreview.title')}
      onClick={onClose}
    >
      <div
        className="absolute right-3 top-3 flex gap-2 sm:right-5 sm:top-5"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleOpenNewTab}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">{t('imagePreview.open')}</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <Download className="h-4 w-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">{t('imagePreview.download')}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label={t('imagePreview.close')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div
        className="flex max-h-[calc(100vh-5rem)] max-w-full flex-col items-center justify-center gap-3 sm:gap-4"
        onClick={event => event.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.alt || t('imagePreview.title')}
          className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/15"
        />

        <p className="max-w-[90vw] truncate text-center text-sm text-white/75">
          {metadata}
        </p>
      </div>
    </div>
  )
}
