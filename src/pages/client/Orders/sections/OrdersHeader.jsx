import React from 'react'

const OrdersHeader = () => {
  return (
    <header className="mb-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
        Đơn hàng
      </p>

      <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
        Đơn hàng của tôi
      </h1>

      <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
        Quản lý trạng thái xử lý và bàn giao tài khoản số của bạn.
      </p>
    </header>
  )
}

export default OrdersHeader
