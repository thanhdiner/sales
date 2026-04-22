import React from 'react'
import { getOrderStatusClassName, getOrderStatusText } from '../utils'

const OrderDetailHeader = ({ orderId, status, onBack }) => {
  return (
    <header className="mb-8">
      <button
        type="button"
        className="mb-5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        onClick={onBack}
      >
        Quay lại danh sách đơn hàng
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Chi tiết đơn hàng
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
              Đơn hàng #{orderId}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
              Xem trạng thái xử lý, sản phẩm đã mua và thông tin bàn giao tài khoản của đơn hàng.
            </p>
          </div>

          <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-sm font-medium ${getOrderStatusClassName(status)}`}>
            {getOrderStatusText(status)}
          </span>
        </div>
      </div>
    </header>
  )
}

export default OrderDetailHeader
