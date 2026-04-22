import { Star } from 'lucide-react'

export const ReviewListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map(item => (
      <div
        key={item}
        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        <div className="mt-4 h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-2 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    ))}
  </div>
)

export const ReviewEmptyState = () => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
    <Star size={42} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />

    <p className="text-base font-semibold text-gray-900 dark:text-white">Chưa có đánh giá nào</p>

    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Hãy là người đầu tiên đánh giá sản phẩm này.
    </p>
  </div>
)

export const ReviewPagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-wrap justify-center gap-2 pt-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        Trước
      </button>

      {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
        const pageNumber = index + 1

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              pageNumber === page
                ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {pageNumber}
          </button>
        )
      })}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        Tiếp
      </button>
    </div>
  )
}
