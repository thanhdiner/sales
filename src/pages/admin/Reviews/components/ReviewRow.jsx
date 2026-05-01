import { EyeOff, ExternalLink, MessageSquare, ShieldCheck, Trash2, X } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { useTranslation } from 'react-i18next'
import { ReviewsAvatar, ReviewsRatingBadge } from './ReviewsPrimitives'
import { getLocalizedReviewProductTitle, getLocalizedSellerReplyContent, getReviewMediaItems } from '../utils'

dayjs.extend(relativeTime)

export default function ReviewRow({ review, onReply, onDeleteReply, onHide, onDelete }) {
  const { t, i18n } = useTranslation('adminReviews')
  const language = i18n.resolvedLanguage || i18n.language
  const mediaItems = getReviewMediaItems(review)
  const dayjsLocale = String(language || '').startsWith('en') ? 'en' : 'vi'
  const productTitle = getLocalizedReviewProductTitle(review, language, review.productId?.title || '')
  const sellerReplyContent = getLocalizedSellerReplyContent(review, language)

  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)] transition-colors hover:border-[var(--admin-border-strong)]">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <ReviewsAvatar user={review.userId} />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--admin-text)]">
                  {review.userId?.fullName || review.userId?.username || t('common.customer')}
                </p>
                <p className="truncate text-xs text-[var(--admin-text-subtle)]">{review.userId?.email}</p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              {review.hidden && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,#f59e0b_35%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_14%,var(--admin-surface-2))] px-2 py-0.5 text-[11px] font-semibold text-[color-mix(in_srgb,#f59e0b_76%,var(--admin-text))]">
                  <EyeOff size={10} strokeWidth={1.8} />
                  {t('common.hidden')}
                </span>
              )}

              <ReviewsRatingBadge rating={review.rating} />
              <span className="text-xs text-[var(--admin-text-subtle)]">{dayjs(review.createdAt).locale(dayjsLocale).fromNow()}</span>
            </div>
          </div>

          {review.productId && (
            <a
              href={`/product/${review.productId.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)]"
            >
              <ExternalLink size={12} strokeWidth={1.8} />
              <span className="truncate">{productTitle}</span>
            </a>
          )}

          {review.title && <p className="text-sm font-semibold text-[var(--admin-text)]">{review.title}</p>}

          {review.content && <p className="text-sm leading-6 text-[var(--admin-text-muted)]">{review.content}</p>}

          {mediaItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mediaItems.slice(0, 6).map((item, index) => (
                <div
                  key={`${item.url}-${index}`}
                  className="h-14 w-14 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)]"
                >
                  {item.isVideo ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      aria-label={t('row.mediaVideoLabel', { index: index + 1 })}
                    />
                  ) : (
                    <img src={item.url} alt={t('row.mediaImageAlt', { index: index + 1 })} className="h-full w-full object-cover" />
                  )}
                </div>
              ))}

              {mediaItems.length > 6 && (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-xs font-medium text-[var(--admin-text-muted)]">
                  +{mediaItems.length - 6}
                </div>
              )}
            </div>
          )}

          {sellerReplyContent && (
            <div className="space-y-1 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--admin-text)]">
                  <ShieldCheck size={13} strokeWidth={1.8} />
                  {t('row.sellerReply')}
                </span>

                <span className="text-[10px] text-[var(--admin-text-subtle)]">
                  {dayjs(review.sellerReply.repliedAt).locale(dayjsLocale).fromNow()}
                </span>
              </div>

              <p className="text-sm leading-6 text-[var(--admin-text-muted)]">{sellerReplyContent}</p>
            </div>
          )}

          {review.hidden && (
            <div className="rounded-xl border border-[color-mix(in_srgb,#f59e0b_35%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_14%,var(--admin-surface-2))] px-3 py-2 text-xs text-[color-mix(in_srgb,#f59e0b_76%,var(--admin-text))]">
              {t('row.hiddenNotice')}
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onReply(review)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-1.5 text-xs font-medium text-[var(--admin-text)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)]"
          >
            <MessageSquare size={13} strokeWidth={1.8} />
            {review.sellerReply?.content ? t('row.editReply') : t('row.reply')}
          </button>

          {review.sellerReply?.content && (
            <button
              type="button"
              onClick={() => onDeleteReply(review._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-1.5 text-xs font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
            >
              <X size={13} strokeWidth={1.8} />
              {t('row.deleteReply')}
            </button>
          )}

          {!review.hidden && (
            <button
              type="button"
              onClick={() => onHide(review._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,#f59e0b_35%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_14%,var(--admin-surface-2))] px-3 py-1.5 text-xs font-medium text-[color-mix(in_srgb,#f59e0b_76%,var(--admin-text))] transition-colors hover:bg-[color-mix(in_srgb,#f59e0b_22%,var(--admin-surface-2))]"
            >
              <EyeOff size={13} strokeWidth={1.8} />
              {t('row.hideReview')}
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(review._id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,#ef4444_35%,var(--admin-border))] bg-[color-mix(in_srgb,#ef4444_12%,var(--admin-surface-2))] px-3 py-1.5 text-xs font-medium text-[color-mix(in_srgb,#ef4444_76%,var(--admin-text))] transition-colors hover:bg-[color-mix(in_srgb,#ef4444_20%,var(--admin-surface-2))]"
          >
            <Trash2 size={13} strokeWidth={1.8} />
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
