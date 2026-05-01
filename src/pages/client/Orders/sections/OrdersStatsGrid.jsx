import React from 'react'

const OrdersStatsGrid = ({ stats }) => {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(item => (
        <div
          key={item.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
        >
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {item.value}
          </div>

          <div className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrdersStatsGrid