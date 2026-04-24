import { useEffect, useState } from 'react'
import { Send, ShieldCheck, X } from 'lucide-react'
import {
  AdminReviewsAvatar,
  AdminReviewsStarDisplay
} from '../components/AdminReviewsPrimitives'

export default function AdminReviewsReplyModal({
  review,
  open,
  loading,
  onClose,
  onSubmit
}) {
  const [content, setContent] = useState(review?.sellerReply?.content || '')
  const isEdit = !!review?.sellerReply?.content

  useEffect(() => {
    if (open) {
      setContent(review?.sellerReply?.content || '')
    }
  }, [open, review])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            <ShieldCheck size={18} strokeWidth={1.8} className="text-gray-600 dark:text-gray-300" />
            {isEdit ? 'Chỉnh sửa phản hồi Shop' : 'Phản hồi với tư cách Shop'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center gap-2.5">
            <AdminReviewsAvatar user={review?.userId} />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {review?.userId?.fullName || 'Khách hàng'}
              </p>
              <AdminReviewsStarDisplay value={review?.rating} />
            </div>
          </div>

          {review?.content && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              “{review.content}”
            </p>
          )}
        </div>

        <div className="space-y-3 px-5 py-4">
          <textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Nhập nội dung phản hồi của Shop..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-500"
          />

          <div className="text-right text-xs text-gray-400">{content.length}/1000</div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Huỷ
            </button>

            <button
              type="button"
              onClick={() => onSubmit(content)}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Send size={14} strokeWidth={1.8} />
              {loading ? 'Đang gửi...' : isEdit ? 'Cập nhật' : 'Gửi phản hồi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
