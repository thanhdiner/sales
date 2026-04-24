import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AdminReviewsPaginationSection({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1)

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <ChevronLeft size={16} strokeWidth={1.8} />
      </button>

      {pageNumbers.map(pageNumber => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`h-9 w-9 rounded-xl border text-sm font-medium transition-colors ${
            pageNumber === page
              ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <ChevronRight size={16} strokeWidth={1.8} />
      </button>
    </div>
  )
}
