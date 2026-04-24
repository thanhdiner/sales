import { Star } from 'lucide-react'
import AdminReviewRow from '../components/AdminReviewRow'

function AdminReviewsLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(item => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex gap-3">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AdminReviewsEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
      <Star size={44} strokeWidth={1.5} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
      <p className="font-medium text-gray-400 dark:text-gray-500">Không có đánh giá nào</p>
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
