import { XCircle } from 'lucide-react'

export default function AdminOrderDetailEmptyState({ onBack }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 dark:border-red-900/60 dark:bg-red-900/20">
        <XCircle className="h-6 w-6" />
      </div>

      <p className="text-base font-semibold text-gray-900 dark:text-white">Không tìm thấy đơn hàng</p>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Quay lại danh sách
      </button>
    </div>
  )
}
