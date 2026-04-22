import { getAdminOrdersPageNumbers, getAdminOrdersSummary } from '../utils'

export default function AdminOrdersPaginationSection({ page, limit, total, totalPages, onPageChange, visible }) {
  if (!visible) {
    return null
  }

  const summary = getAdminOrdersSummary({ page, limit, total })
  const pageNumbers = getAdminOrdersPageNumbers({ page, total, limit })

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Hiển thị <span className="font-medium text-gray-900 dark:text-white">{summary.from}</span> -{' '}
        <span className="font-medium text-gray-900 dark:text-white">{summary.to}</span> của{' '}
        <span className="font-medium text-gray-900 dark:text-white">{total}</span> đơn hàng
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Trước
        </button>

        <div className="flex flex-wrap items-center gap-1">
          {pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                page === pageNumber
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Sau
        </button>
      </div>
    </div>
  )
}