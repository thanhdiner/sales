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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
            <ShieldCheck size={18} strokeWidth={1.8} className="text-[var(--admin-text-muted)]" />
            {isEdit ? 'Chỉnh sửa phản hồi Shop' : 'Phản hồi với tư cách Shop'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--admin-text-subtle)] transition-colors hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <AdminReviewsAvatar user={review?.userId} />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--admin-text)]">
                {review?.userId?.fullName || 'Khách hàng'}
              </p>
              <AdminReviewsStarDisplay value={review?.rating} />
            </div>
          </div>

          {review?.content && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--admin-text-muted)]">
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
            className="w-full resize-none rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 text-sm text-[var(--admin-text)] outline-none transition-colors placeholder:text-[var(--admin-text-subtle)] focus:border-[var(--admin-accent)]"
          />

          <div className="text-right text-xs text-[var(--admin-text-subtle)]">{content.length}/1000</div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
            >
              Huỷ
            </button>

            <button
              type="button"
              onClick={() => onSubmit(content)}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 rounded-xl bg-[var(--admin-accent)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
