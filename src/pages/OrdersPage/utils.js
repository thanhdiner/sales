export const getOrderStatusText = status => {
  switch (status) {
    case 'completed':
      return 'Hoàn tất'
    case 'confirmed':
      return 'Đang xử lý'
    case 'pending':
      return 'Chờ xác nhận'
    case 'shipping':
      return 'Đã bàn giao'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return status
  }
}

export const getOrderStatusClassName = status => {
  switch (status) {
    case 'completed':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
    case 'shipping':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300'
    case 'confirmed':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300'
    case 'pending':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'
    case 'cancelled':
      return 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
    default:
      return 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

export const formatOrderDate = date =>
  new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const formatOrderTotal = total => `${Number(total || 0).toLocaleString('vi-VN')}₫`

export const getOrderItemCount = order => order.orderItems?.length || order.items || 0

export const buildOrderStats = orders => [
  {
    label: 'Hoàn tất',
    value: orders.filter(order => order.status === 'completed').length,
  },
  {
    label: 'Đang xử lý',
    value: orders.filter(order => order.status === 'confirmed').length,
  },
  {
    label: 'Đã bàn giao',
    value: orders.filter(order => order.status === 'shipping').length,
  },
  {
    label: 'Chờ xác nhận',
    value: orders.filter(order => order.status === 'pending').length,
  },
  {
    label: 'Đã hủy',
    value: orders.filter(order => order.status === 'cancelled').length,
  },
  {
    label: 'Tổng đơn hàng',
    value: orders.length,
  },
]
