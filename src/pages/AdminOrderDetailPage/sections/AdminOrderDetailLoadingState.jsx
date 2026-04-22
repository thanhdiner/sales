export default function AdminOrderDetailLoadingState() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đang tải đơn hàng...</p>
    </div>
  )
}
