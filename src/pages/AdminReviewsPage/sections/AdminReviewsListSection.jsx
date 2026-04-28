import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdminReviewRow from '../components/AdminReviewRow'

function AdminReviewsLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(item => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]"
        >
          <div className="flex gap-3">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[var(--admin-surface-3)]" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-[var(--admin-surface-3)]" />
              <div className="h-3 w-full rounded bg-[var(--admin-surface-3)]" />
              <div className="h-3 w-3/4 rounded bg-[var(--admin-surface-3)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AdminReviewsEmptyState() {
  const { t } = useTranslation('adminReviews')

  return (
    <div className="rounded-2xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] py-20 text-center">
      <Star size={44} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--admin-text-subtle)]" />
      <p className="font-medium text-[var(--admin-text-muted)]">{t('list.empty')}</p>
    </div>
  )
}

export default function AdminReviewsListSection({
  loading,
  reviews,
  onReply,
  onDeleteReply,
  onHide,
  onDelete
}) {
  if (loading) {
    return <AdminReviewsLoadingState />
  }

  if (reviews.length === 0) {
    return <AdminReviewsEmptyState />
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <AdminReviewRow
          key={review._id}
          review={review}
          onReply={onReply}
          onDeleteReply={onDeleteReply}
          onHide={onHide}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
