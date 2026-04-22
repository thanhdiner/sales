import { formatAdminOrderDetailCurrency } from '../utils'

export default function AdminOrderSummarySection({ order }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Tổng quan đơn hàng</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Tạm tính</span>
          <span>{formatAdminOrderDetailCurrency(order.subtotal)}</span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600 dark:text-green-300">
            <span>Giảm giá</span>
            <span>-{formatAdminOrderDetailCurrency(order.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Phí vận chuyển</span>
          <span>{order.shipping === 0 ? 'Miễn phí' : formatAdminOrderDetailCurrency(order.shipping)}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-white">
            <span>Tổng cộng</span>
            <span>{formatAdminOrderDetailCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
