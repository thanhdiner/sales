import { useEffect, useRef, useState } from 'react'
import { MoreVertical, Pencil, Send, ShieldCheck, ThumbsUp, Trash2, VideoIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Lightbox } from './ReviewMediaPreview'
import { Avatar, StarDisplay } from './ReviewShared'
import { getReviewMedia, timeAgo } from './utils'

export default function ReviewCard({
  review,
  currentUserId,
  isAdmin,
  onVote,
  onEdit,
  onDelete,
  onReply,
  onDeleteReply,
  canEdit = review?.canEdit,
  canDelete = review?.isOwner,
  ownerNote = ''
}) {
  const { t } = useTranslation('clientProducts')
  const [lightbox, setLightbox] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyContent, setReplyContent] = useState(review.sellerReply?.content || '')
  const [replyLoading, setReplyLoading] = useState(false)
  const menuRef = useRef()
  const allMedia = getReviewMedia(review)
  const showOwnerMenu = review.isOwner && (canEdit || canDelete)
  const canReplyAsShop = isAdmin && !review.isOwner

  useEffect(() => {
    const handleMouseDown = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return

    setReplyLoading(true)

    try {
      await onReply(review._id, replyContent)
      setReplyOpen(false)
    } finally {
      setReplyLoading(false)
    }
  }

  const voteTitle = review.isOwner
    ? t('productDetail.reviewCard.vote.ownerDisabled')
    : !currentUserId
      ? t('productDetail.reviewCard.vote.loginRequired')
      : ''

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar user={review.userId} />

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {review.userId?.fullName || review.userId?.username || t('productDetail.reviewCard.anonymousCustomer')}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StarDisplay value={review.rating} size={14} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {showOwnerMenu && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              aria-label={t('productDetail.reviewCard.menu.more')}
              title={t('productDetail.reviewCard.menu.more')}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 z-20 min-w-[150px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(review)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Pencil size={14} />
                    {t('productDetail.reviewCard.menu.edit')}
                  </button>
                )}

                {canDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(review._id)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={14} />
                    {t('productDetail.reviewCard.menu.delete')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {review.hidden && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
          {t('productDetail.reviewCard.hiddenNotice')}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {review.title && <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.title}</p>}

        {review.content && <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{review.content}</p>}
      </div>

      {allMedia.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {allMedia.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setLightbox(index)}
              aria-label={t('productDetail.reviewCard.media.open')}
              title={t('productDetail.reviewCard.media.open')}
              className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-transform hover:scale-[1.03] dark:border-gray-700 dark:bg-gray-800"
            >
              {item.isVideo ? (
                <>
                  <video src={item.url} className="h-full w-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <VideoIcon size={16} className="text-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={t('productDetail.reviewCard.media.imageAlt', { index: index + 1 })}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}

          {lightbox !== null && <Lightbox items={allMedia} startIndex={lightbox} onClose={() => setLightbox(null)} />}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onVote(review._id)}
          disabled={review.isOwner || !currentUserId}
          title={voteTitle}
          aria-label={voteTitle || t('productDetail.reviewCard.vote.helpful')}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
            review.isVoted
              ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white'
          } ${review.isOwner || !currentUserId ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <ThumbsUp size={14} className={review.isVoted ? 'fill-current' : ''} />
          {review.helpfulCount > 0
            ? t('productDetail.reviewCard.vote.helpfulWithCount', { count: review.helpfulCount })
            : t('productDetail.reviewCard.vote.helpful')}
        </button>
      </div>

      {ownerNote && <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{ownerNote}</p>}

      {review.sellerReply?.content && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <ShieldCheck size={15} />
              {t('productDetail.reviewCard.sellerReply.title')}
            </div>

            {canReplyAsShop && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setReplyContent(review.sellerReply.content)
                    setReplyOpen(true)
                  }}
                  aria-label={t('productDetail.reviewCard.sellerReply.edit')}
                  title={t('productDetail.reviewCard.sellerReply.edit')}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <Pencil size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteReply(review._id)}
                  aria-label={t('productDetail.reviewCard.sellerReply.delete')}
                  title={t('productDetail.reviewCard.sellerReply.delete')}
                  className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{review.sellerReply.content}</p>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{timeAgo(review.sellerReply.repliedAt)}</p>
        </div>
      )}

      {canReplyAsShop &&
        !review.sellerReply?.content &&
        (replyOpen ? (
          <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <textarea
              value={replyContent}
              onChange={event => setReplyContent(event.target.value)}
              rows={3}
              placeholder={t('productDetail.reviewCard.sellerReply.placeholder')}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReplySubmit}
                disabled={replyLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <Send size={13} />
                {t('productDetail.reviewCard.sellerReply.send')}
              </button>

              <button
                type="button"
                onClick={() => setReplyOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t('productDetail.reviewCard.sellerReply.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setReplyOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ShieldCheck size={14} />
            {t('productDetail.reviewCard.sellerReply.replyAsShop')}
          </button>
        ))}

      {canReplyAsShop && review.sellerReply?.content && replyOpen && (
        <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
          <textarea
            value={replyContent}
            onChange={event => setReplyContent(event.target.value)}
            rows={3}
            placeholder={t('productDetail.reviewCard.sellerReply.placeholder')}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReplySubmit}
              disabled={replyLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Send size={13} />
              {t('productDetail.reviewCard.sellerReply.update')}
            </button>

            <button
              type="button"
              onClick={() => setReplyOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t('productDetail.reviewCard.sellerReply.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
