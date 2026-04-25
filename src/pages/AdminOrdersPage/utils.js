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
    badgeClassName:
      'border border-[color-mix(in_srgb,#22c55e_32%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_16%,var(--admin-surface-2))] text-[#15803d] dark:text-[#4ade80]',
    iconClassName: 'text-[#16a34a] dark:text-[#4ade80]'
  },
  confirmed: {
    label: 'Đã xác nhận',
    icon: CheckCircle,
    badgeClassName:
      'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    iconClassName: 'text-[#2563eb] dark:text-[#93c5fd]'
  },
  pending: {
    label: 'Chờ xác nhận',
    icon: Clock,
    badgeClassName:
      'border border-[color-mix(in_srgb,#f59e0b_36%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_16%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]',
    iconClassName: 'text-[#d97706] dark:text-[#fbbf24]'
  },
  shipping: {
    label: 'Đang giao',
    icon: Truck,
    badgeClassName:
      'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    iconClassName: 'text-[#2563eb] dark:text-[#93c5fd]'
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    badgeClassName:
      'border border-[color-mix(in_srgb,#ef4444_30%,var(--admin-border))] bg-[color-mix(in_srgb,#ef4444_14%,var(--admin-surface-2))] text-[#b91c1c] dark:text-[#fca5a5]',
    iconClassName: 'text-[#dc2626] dark:text-[#fca5a5]'
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
