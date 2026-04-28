import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react'

export const ADMIN_ORDERS_PAGE_LIMIT = 10
export const ADMIN_ORDERS_SEARCH_DEBOUNCE_MS = 400

export const ADMIN_ORDER_STATUS_VALUES = ['', 'pending', 'confirmed', 'shipping', 'completed', 'cancelled']
export const ADMIN_ORDER_PAYMENT_STATUS_VALUES = ['pending', 'paid', 'failed']
export const ADMIN_ORDER_PAYMENT_METHOD_VALUES = ['transfer', 'contact', 'vnpay', 'momo', 'zalopay', 'sepay']
export const ADMIN_ORDER_DELIVERY_METHOD_VALUES = ['pickup', 'contact']

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const humanizeAdminOrderDynamicValue = value =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const translateAdminOrderDynamicValue = (t, namespace, value) => {
  const normalizedValue = String(value || '').trim()

  if (!normalizedValue) {
    return t(`${namespace}.unknown`, { value: '--' })
  }

  return t(`${namespace}.${normalizedValue}`, {
    defaultValue: t(`${namespace}.unknown`, {
      value: humanizeAdminOrderDynamicValue(normalizedValue)
    })
  })
}

export const getAdminOrderStatusLabel = (status, t) =>
  t ? translateAdminOrderDynamicValue(t, 'status', status) : status

export const getAdminOrderPaymentStatusLabel = (status, t) =>
  t ? translateAdminOrderDynamicValue(t, 'paymentStatus', status) : status

export const getAdminOrderPaymentMethodLabel = (method, t) =>
  t ? translateAdminOrderDynamicValue(t, 'paymentMethod', method) : method

export const getAdminOrderDeliveryMethodLabel = (method, t) =>
  t ? translateAdminOrderDynamicValue(t, 'deliveryMethod', method) : method

export const getAdminOrderStatusOptions = t =>
  ADMIN_ORDER_STATUS_VALUES.map(value => ({
    value,
    label: value ? getAdminOrderStatusLabel(value, t) : t('status.all')
  }))

const ORDER_STATUS_CONFIGS = {
  completed: {
    icon: CheckCircle,
    badgeClassName:
      'border border-[color-mix(in_srgb,#22c55e_32%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_16%,var(--admin-surface-2))] text-[#15803d] dark:text-[#4ade80]',
    iconClassName: 'text-[#16a34a] dark:text-[#4ade80]'
  },
  confirmed: {
    icon: CheckCircle,
    badgeClassName:
      'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    iconClassName: 'text-[#2563eb] dark:text-[#93c5fd]'
  },
  pending: {
    icon: Clock,
    badgeClassName:
      'border border-[color-mix(in_srgb,#f59e0b_36%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_16%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]',
    iconClassName: 'text-[#d97706] dark:text-[#fbbf24]'
  },
  shipping: {
    icon: Truck,
    badgeClassName:
      'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    iconClassName: 'text-[#2563eb] dark:text-[#93c5fd]'
  },
  cancelled: {
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

export const getAdminOrderStatusConfig = (status, t) => {
  const statusKey = ORDER_STATUS_CONFIGS[status] ? status : 'pending'

  return {
    ...ORDER_STATUS_CONFIGS[statusKey],
    label: getAdminOrderStatusLabel(status, t)
  }
}

export const getAdminOrderCode = orderId => `#${String(orderId || '').slice(-6).toUpperCase()}`

export const getAdminOrderCustomerName = (order, fallback = 'Guest customer') => {
  const fullName = [order?.contact?.firstName, order?.contact?.lastName].filter(Boolean).join(' ')
  return fullName || fallback
}

export const getAdminOrderItemProduct = item => {
  if (item?.productId && typeof item.productId === 'object') return item.productId
  if (item?.product && typeof item.product === 'object') return item.product
  return null
}

export const getAdminOrderItemName = (item, language, fallback = '') => {
  const product = getAdminOrderItemProduct(item)
  const translatedProductTitle = isEnglishLanguage(language) ? product?.translations?.en?.title : null
  const translatedItemName = isEnglishLanguage(language) ? item?.translations?.en?.name : null

  if (hasText(translatedProductTitle)) return translatedProductTitle
  if (hasText(translatedItemName)) return translatedItemName
  if (hasText(item?.localizedName)) return item.localizedName
  if (hasText(product?.title)) return product.title
  if (hasText(item?.name)) return item.name

  return fallback
}

export const getAdminOrderItemsSummary = (order, language, t) => {
  const items = Array.isArray(order?.orderItems) ? order.orderItems : []
  const fallbackName = typeof t === 'function' ? t('table.unknownProduct') : ''
  const visibleItems = items
    .slice(0, 2)
    .map(item => {
      const name = getAdminOrderItemName(item, language, fallbackName)
      if (!name) return ''

      const quantity = Number(item?.quantity || 0)
      return quantity > 1 ? `${name} x${quantity}` : name
    })
    .filter(Boolean)

  if (!visibleItems.length) return ''

  const summary = visibleItems.join(', ')
  const remainingCount = items.length - visibleItems.length

  if (remainingCount <= 0 || typeof t !== 'function') return summary

  return t('table.itemsSummary.more', {
    summary,
    count: remainingCount
  })
}

export const getAdminOrdersLocale = language => (language?.startsWith('en') ? 'en-US' : 'vi-VN')

export const formatAdminOrderDate = (date, language) => {
  if (!date) {
    return '--'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '--'
  }

  return parsedDate.toLocaleString(getAdminOrdersLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatAdminOrderTotal = (total, language) =>
  new Intl.NumberFormat(getAdminOrdersLocale(language), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(total || 0))

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
