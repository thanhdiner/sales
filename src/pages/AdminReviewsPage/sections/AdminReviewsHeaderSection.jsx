import { RefreshCw } from 'lucide-react'

export default function AdminReviewsHeaderSection({ onRefresh }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Quản lý đánh giá
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Xem, phản hồi và kiểm duyệt đánh giá sản phẩm.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <RefreshCw size={14} strokeWidth={1.8} />
        Làm mới
      </button>
    </div>
  )
}
