import React from 'react'
import {
  formatOrderDate,
  formatOrderTotal,
  getOrderItemCount,
  getOrderStatusClassName,
  getOrderStatusText,
} from '../utils'

const OrderListItem = ({ order, onSelectOrder }) => {
  const shortOrderId = String(order._id).slice(-8).toUpperCase()

  return (
    <button
      type="button"
      onClick={() => onSelectOrder(order._id)}
      className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              #{shortOrderId}
            </h2>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusClassName(order.status)}`}
            >
              {getOrderStatusText(order.status)}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
            <p className="mb-0">
              Sản phẩm:{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {getOrderItemCount(order)} sản phẩm
              </span>
            </p>

            <p className="mb-0">
              Ngày đặt:{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatOrderDate(order.createdAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 lg:block lg:min-w-[160px] lg:text-right">
          <div>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              Tổng tiền
            </p>
            <p className="mb-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatOrderTotal(order.total)}
            </p>
          </div>

          <p className="mb-0 text-sm font-medium text-gray-500 dark:text-gray-400 lg:mt-2">
            Xem chi tiết
          </p>
        </div>
      </div>
    </button>
  )
}

export default OrderListItem