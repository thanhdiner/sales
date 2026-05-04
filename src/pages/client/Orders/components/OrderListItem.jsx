import { Copy, Headphones, MessageSquare, RotateCcw, Star, XCircle } from 'lucide-react'
import {
  formatOrderDate,
  formatOrderTotal,
  getOrderItemCount,
  getOrderStatusClassName,
  getOrderStatusText,
} from '../utils'

const statusActions = {
  pending: [
    { label: 'Xem chi tiết', variant: 'primary' },
    { label: 'Hủy đơn', Icon: XCircle },
  ],
  confirmed: [
    { label: 'Xem chi tiết', variant: 'primary' },
    { label: 'Liên hệ hỗ trợ', Icon: Headphones },
  ],
  completed: [
    { label: 'Xem chi tiết', variant: 'primary' },
    { label: 'Mua lại', Icon: RotateCcw },
    { label: 'Đánh giá', Icon: Star },
  ],
  shipping: [
    { label: 'Xem chi tiết', variant: 'primary' },
    { label: 'Sao chép tài khoản', Icon: Copy },
    { label: 'Liên hệ hỗ trợ', Icon: Headphones },
  ],
  cancelled: [
    { label: 'Xem chi tiết', variant: 'primary' },
    { label: 'Mua lại', Icon: RotateCcw },
  ],
}

const getMainProductName = order => order.orderItems?.[0]?.name || order.items?.[0]?.name || 'Sản phẩm'

const hasDigitalDelivery = order =>
  (order.orderItems || []).some(item => Array.isArray(item.digitalDeliveries) && item.digitalDeliveries.length > 0)

const OrderListItem = ({ order, onSelectOrder }) => {
  const shortOrderId = String(order._id).slice(-8).toUpperCase()
  const itemCount = getOrderItemCount(order)
  const extraCount = Math.max(itemCount - 1, 0)
  const actions = statusActions[order.status] || [{ label: 'Xem chi tiết', variant: 'primary' }]

  const handleActionClick = event => {
    event.stopPropagation()
    onSelectOrder(order._id)
  }

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-5">
      <button
        type="button"
        onClick={() => onSelectOrder(order._id)}
        className="block w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">Mã đơn</p>
            <h2 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">#{shortOrderId}</h2>
          </div>

          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusClassName(order.status)}`}>
            {getOrderStatusText(order.status)}
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-900/70">
          <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{getMainProductName(order)}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{itemCount} sản phẩm</span>
            {extraCount > 0 && <span>+ {extraCount} sản phẩm khác</span>}
            <span>{formatOrderDate(order.createdAt)}</span>
          </div>
        </div>

        {hasDigitalDelivery(order) ? (
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
            Xem thông tin bàn giao trong chi tiết đơn hàng
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">Tổng tiền</span>
          <strong className="text-lg font-semibold text-gray-950 dark:text-white">{formatOrderTotal(order.total)}</strong>
        </div>
      </button>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {actions.map(action => {
          const Icon = action.Icon

          return (
            <button
              key={action.label}
              type="button"
              onClick={handleActionClick}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors ${
                action.variant === 'primary'
                  ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-300'
              }`}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              {action.label}
            </button>
          )
        })}
      </div>
    </article>
  )
}

export default OrderListItem
