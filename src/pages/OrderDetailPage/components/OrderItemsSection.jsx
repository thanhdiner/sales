import React from 'react'
import { formatOrderPrice } from '../utils'

const OrderItemsSection = ({ items = [] }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Danh sách sản phẩm</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Các sản phẩm số có trong đơn hàng này.</p>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div
            key={`${item.productId}-${item.name}`}
            className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="relative shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />

              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {item.quantity}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>

              {item.category && <p className="mb-0 mt-1 text-xs text-gray-500 dark:text-gray-400">{item.category}</p>}
              {item.digitalDeliveries?.length > 0 && (
                <p className="mb-0 mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  Đã bàn giao {item.digitalDeliveries.length} tài khoản/license
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatOrderPrice(item.price)}</p>
              <p className="mb-0 text-xs text-gray-500 dark:text-gray-400">x{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OrderItemsSection
