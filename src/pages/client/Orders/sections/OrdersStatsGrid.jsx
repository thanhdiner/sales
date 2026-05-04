import React from 'react'

const OrdersStatsGrid = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-8 lg:grid-cols-3 lg:gap-4">
      {stats.map(item => (
        <div
          key={item.label}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 lg:rounded-2xl lg:p-5"
        >
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">
            {item.value}
          </div>

          <div className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 lg:text-sm lg:leading-6">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrdersStatsGrid