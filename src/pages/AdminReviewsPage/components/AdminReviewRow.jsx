import { EyeOff, ExternalLink, MessageSquare, ShieldCheck, Trash2, X } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import {
  AdminReviewsAvatar,
  AdminReviewsRatingBadge
} from './AdminReviewsPrimitives'
import { getReviewMediaItems } from '../utils'

dayjs.extend(relativeTime)
dayjs.locale('vi')

export default function AdminReviewRow({
  review,
  onReply,
  onDeleteReply,
  onHide,
  onDelete
}) {
  const mediaItems = getReviewMediaItems(review)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AdminReviewsAvatar user={review.userId} />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {review.userId?.fullName || review.userId?.username || 'Khách hàng'}
                </p>
                <p className="truncate text-xs text-gray-400">{review.userId?.email}</p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              {review.hidden && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                  <EyeOff size={10} strokeWidth={1.8} />
                  Ẩn
                </span>
              )}

              <AdminReviewsRatingBadge rating={review.rating} />
              <span className="text-xs text-gray-400">{dayjs(review.createdAt).fromNow()}</span>
            </div>
          </div>

          {review.productId && (
            <a
              href={`/product/${review.productId.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ExternalLink size={12} strokeWidth={1.8} />
              <span className="truncate">{review.productId.title}</span>
            </a>
          )}

          {review.title && (
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {review.title}
            </p>
          )}

          {review.content && (
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{review.content}</p>
          )}

          {mediaItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mediaItems.slice(0, 6).map((item, index) => (
                <div
                  key={`${item.url}-${index}`}
                  className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                >
                  {item.isVideo ? (
                    <video src={item.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              ))}

              {mediaItems.length > 6 && (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  +{mediaItems.length - 6}
                </div>
              )}
            </div>
          )}

          {review.sellerReply?.content && (
            <div className="space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  <ShieldCheck size={13} strokeWidth={1.8} />
                  Phản hồi của Shop
                </span>

                <span className="text-[10px] text-gray-400">
                  {dayjs(review.sellerReply.repliedAt).fromNow()}
                </span>
              </div>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {review.sellerReply.content}
              </p>
            </div>
          )}

          {review.hidden && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Review này đang bị ẩn khỏi trang sản phẩm.
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onReply(review)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <MessageSquare size={13} strokeWidth={1.8} />
            {review.sellerReply?.content ? 'Sửa phản hồi' : 'Phản hồi'}
          </button>

          {review.sellerReply?.content && (
            <button
              type="button"
              onClick={() => onDeleteReply(review._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X size={13} strokeWidth={1.8} />
              Xoá phản hồi
            </button>
          )}

          {!review.hidden && (
            <button
              type="button"
              onClick={() => onHide(review._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-900 dark:text-amber-300 dark:hover:bg-amber-950/20"
            >
              <EyeOff size={13} strokeWidth={1.8} />
              Ẩn review
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(review._id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-gray-700 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 size={13} strokeWidth={1.8} />
            Xoá
          </button>
        </div>
      </div>
    </div>
  )
}
