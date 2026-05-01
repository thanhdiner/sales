import React from 'react'

const LoadingState = () => {
  return (
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100" />
      <p className="mt-5 text-sm font-medium text-gray-600 dark:text-gray-300">Đang tải chi tiết đơn hàng...</p>
    </div>
  )
}

export default LoadingState
