const OrdersEmptyState = ({ onStartShopping }) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">Lịch sử mua hàng</p>

      <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">Chưa có đơn hàng nào</h1>

      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-600 dark:text-gray-300">
        Hãy khám phá các sản phẩm và tạo đơn hàng đầu tiên của bạn.
      </p>

      <button
        type="button"
        onClick={onStartShopping}
        className="mt-6 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
      >
        Mua sắm ngay
      </button>
    </div>
  )
}

export default OrdersEmptyState
