import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react'

export const ADMIN_ORDERS_PAGE_LIMIT = 10
export const ADMIN_ORDERS_SEARCH_DEBOUNCE_MS = 400

export const ADMIN_ORDER_SEARCH_PLACEHOLDER = 'Tìm kiếm theo tên, số điện thoại, mã đơn...'

export const ADMIN_ORDER_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]

const ORDER_STATUS_CONFIGS = {
  completed: {
    label: 'Hoàn thành',
    icon: CheckCircle,
    badgeClassName: 'bg-emerald-100 text-emerald-800',
    iconClassName: 'text-emerald-600'
  },
  confirmed: {
    label: 'Đã xác nhận',
    icon: CheckCircle,
    badgeClassName: 'bg-blue-100 text-blue-800',
    iconClassName: 'text-blue-600'
  },
  pending: {
    label: 'Chờ xác nhận',
    icon: Clock,
    badgeClassName: 'bg-amber-100 text-amber-800',
    iconClassName: 'text-amber-600'
  },
  shipping: {
    label: 'Đang giao',
    icon: Truck,
    badgeClassName: 'bg-blue-100 text-blue-800',
    iconClassName: 'text-blue-600'
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    badgeClassName: 'bg-gray-100 text-gray-800',
    iconClassName: 'text-gray-600'
  }
}

export const getAdminOrdersQueryParams = ({ page, limit, keyword, status }) => ({
  page,
  limit,
  keyword,
  status
})

export const getAdminOrderStatusConfig = status => ORDER_STATUS_CONFIGS[status] || ORDER_STATUS_CONFIGS.pending

export const getAdminOrderCode = orderId => `#${String(orderId || '').slice(-6).toUpperCase()}`

export const getAdminOrderCustomerName = order => {
  const fullName = [order?.contact?.firstName, order?.contact?.lastName].filter(Boolean).join(' ')
  return fullName || 'Khách vãng lai'
}

export const formatAdminOrderDate = date =>
  new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

export const formatAdminOrderTotal = total => `${Number(total || 0).toLocaleString('vi-VN')}₫`

export const getAdminOrdersSummary = ({ page, limit, total }) => {
  if (!total) {
    return { from: 0, to: 0 }
  }

  return {
    from: Math.min((page - 1) * limit + 1, total),
    to: Math.min(page * limit, total)
  }
}

export const getAdminOrdersPageNumbers = ({ page, total, limit, maxVisible = 5 }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1)
  }

  const halfWindow = Math.floor(maxVisible / 2)
  let startPage = Math.max(1, page - halfWindow)
  let endPage = startPage + maxVisible - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = endPage - maxVisible + 1
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx)
}
