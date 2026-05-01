import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react'

export const ORDERS_PAGE_LIMIT = 10
export const ORDERS_SEARCH_DEBOUNCE_MS = 400

export const ORDER_STATUS_VALUES = ['', 'pending', 'confirmed', 'shipping', 'completed', 'cancelled']
export const ORDER_PAYMENT_STATUS_VALUES = ['pending', 'paid', 'failed']
export const ORDER_PAYMENT_METHOD_VALUES = ['transfer', 'contact', 'vnpay', 'momo', 'zalopay', 'sepay']
export const ORDER_DELIVERY_METHOD_VALUES = ['pickup', 'contact']

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const humanizeOrderDynamicValue = value =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const translateOrderDynamicValue = (t, namespace, value) => {
  const normalizedValue = String(value || '').trim()

  if (!normalizedValue) {
    return t(`${namespace}.unknown`, { value: '--' })
  }

  return t(`${namespace}.${normalizedValue}`, {
    defaultValue: t(`${namespace}.unknown`, {
      value: humanizeOrderDynamicValue(normalizedValue)
    })
  })
}

export const getOrderStatusLabel = (status, t) =>
  t ? translateOrderDynamicValue(t, 'status', status) : status

export const getOrderPaymentStatusLabel = (status, t) =>
  t ? translateOrderDynamicValue(t, 'paymentStatus', status) : status

export const getOrderPaymentMethodLabel = (method, t) =>
  t ? translateOrderDynamicValue(t, 'paymentMethod', method) : method

export const getOrderDeliveryMethodLabel = (method, t) =>
  t ? translateOrderDynamicValue(t, 'deliveryMethod', method) : method

export const getOrderStatusOptions = t =>
  ORDER_STATUS_VALUES.map(value => ({
    value,
    label: value ? getOrderStatusLabel(value, t) : t('status.all')
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

export const getOrdersQueryParams = ({ page, limit, keyword, status }) => ({
  page,
  limit,
  keyword,
  status
})

export const getOrderStatusConfig = (status, t) => {
  const statusKey = ORDER_STATUS_CONFIGS[status] ? status : 'pending'

  return {
    ...ORDER_STATUS_CONFIGS[statusKey],
    label: getOrderStatusLabel(status, t)
  }
}

export const getOrderCode = orderId => `#${String(orderId || '').slice(-6).toUpperCase()}`

export const getOrderCustomerName = (order, fallback = 'Guest customer') => {
  const fullName = [order?.contact?.firstName, order?.contact?.lastName].filter(Boolean).join(' ')
  return fullName || fallback
}

export const getOrderItemProduct = item => {
  if (item?.productId && typeof item.productId === 'object') return item.productId
  if (item?.product && typeof item.product === 'object') return item.product
  return null
}

export const getOrderItemName = (item, language, fallback = '') => {
  const product = getOrderItemProduct(item)
  const translatedProductTitle = isEnglishLanguage(language) ? product?.translations?.en?.title : null
  const translatedItemName = isEnglishLanguage(language) ? item?.translations?.en?.name : null

  if (hasText(translatedProductTitle)) return translatedProductTitle
  if (hasText(translatedItemName)) return translatedItemName
  if (hasText(item?.localizedName)) return item.localizedName
  if (hasText(product?.title)) return product.title
  if (hasText(item?.name)) return item.name

  return fallback
}

export const getOrderItemsSummary = (order, language, t) => {
  const items = Array.isArray(order?.orderItems) ? order.orderItems : []
  const fallbackName = typeof t === 'function' ? t('table.unknownProduct') : ''
  const visibleItems = items
    .slice(0, 2)
    .map(item => {
      const name = getOrderItemName(item, language, fallbackName)
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

export const getOrdersLocale = language => (language?.startsWith('en') ? 'en-US' : 'vi-VN')

export const formatOrderDate = (date, language) => {
  if (!date) {
    return '--'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '--'
  }

  return parsedDate.toLocaleString(getOrdersLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatOrderTotal = (total, language) =>
  new Intl.NumberFormat(getOrdersLocale(language), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(total || 0))

export const getOrdersSummary = ({ page, limit, total }) => {
  if (!total) {
    return { from: 0, to: 0 }
  }

  return {
    from: Math.min((page - 1) * limit + 1, total),
    to: Math.min(page * limit, total)
  }
}

export const getOrdersPageNumbers = ({ page, total, limit, maxVisible = 5 }) => {
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
