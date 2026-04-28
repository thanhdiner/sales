import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'

export const ADMIN_ORDER_DETAIL_STATUS_VALUES = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled']
export const ADMIN_ORDER_PAYMENT_STATUS_VALUES = ['pending', 'paid', 'failed']
export const ADMIN_ORDER_PAYMENT_METHOD_VALUES = ['transfer', 'contact', 'vnpay', 'momo', 'zalopay', 'sepay']
export const ADMIN_ORDER_DELIVERY_METHOD_VALUES = ['pickup', 'contact']
export const ADMIN_ORDER_DELIVERY_TYPE_VALUES = ['manual', 'instant_account']

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const humanizeAdminOrderDetailDynamicValue = value =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const translateAdminOrderDetailDynamicValue = (t, namespace, value) => {
  const normalizedValue = String(value || '').trim()

  if (!normalizedValue) {
    return t(`${namespace}.unknown`, { value: '--' })
  }

  return t(`${namespace}.${normalizedValue}`, {
    defaultValue: t(`${namespace}.unknown`, {
      value: humanizeAdminOrderDetailDynamicValue(normalizedValue)
    })
  })
}

export const getAdminOrderDetailStatusLabel = (status, t) =>
  t ? translateAdminOrderDetailDynamicValue(t, 'status', status) : status

export const getAdminOrderPaymentStatusLabel = (status, t) =>
  t ? translateAdminOrderDetailDynamicValue(t, 'paymentStatus', status) : status

export const getAdminOrderPaymentMethodLabel = (method, t) =>
  t ? translateAdminOrderDetailDynamicValue(t, 'paymentMethod', method) : method

export const getAdminOrderDeliveryMethodLabel = (method, t) =>
  t ? translateAdminOrderDetailDynamicValue(t, 'deliveryMethod', method) : method

export const getAdminOrderDeliveryTypeLabel = (deliveryType, t) =>
  t ? translateAdminOrderDetailDynamicValue(t, 'deliveryType', deliveryType) : deliveryType

export const getAdminOrderDetailStatusOptions = t =>
  ADMIN_ORDER_DETAIL_STATUS_VALUES.map(value => ({
    value,
    label: getAdminOrderDetailStatusLabel(value, t)
  }))

export const getAdminOrderPaymentStatusOptions = t =>
  ADMIN_ORDER_PAYMENT_STATUS_VALUES.map(value => ({
    value,
    label: getAdminOrderPaymentStatusLabel(value, t)
  }))

const ORDER_STATUS_INFO = {
  pending: {
    color:
      'border border-[color-mix(in_srgb,#f59e0b_36%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_16%,var(--admin-surface-2))] text-[#b45309] dark:text-[#fbbf24]',
    icon: Clock
  },
  confirmed: {
    color:
      'border border-[color-mix(in_srgb,#3b82f6_32%,var(--admin-border))] bg-[color-mix(in_srgb,#3b82f6_16%,var(--admin-surface-2))] text-[#1d4ed8] dark:text-[#93c5fd]',
    icon: CheckCircle
  },
  shipping: {
    color:
      'border border-[color-mix(in_srgb,#8b5cf6_34%,var(--admin-border))] bg-[color-mix(in_srgb,#8b5cf6_16%,var(--admin-surface-2))] text-[#6d28d9] dark:text-[#c4b5fd]',
    icon: Truck
  },
  completed: {
    color:
      'border border-[color-mix(in_srgb,#22c55e_32%,var(--admin-border))] bg-[color-mix(in_srgb,#22c55e_16%,var(--admin-surface-2))] text-[#15803d] dark:text-[#4ade80]',
    icon: CheckCircle
  },
  cancelled: {
    color:
      'border border-[color-mix(in_srgb,#ef4444_30%,var(--admin-border))] bg-[color-mix(in_srgb,#ef4444_14%,var(--admin-surface-2))] text-[#b91c1c] dark:text-[#fca5a5]',
    icon: XCircle
  }
}

export function getAdminOrderDetailStatusInfo(status, t) {
  const statusKey = ORDER_STATUS_INFO[status] ? status : 'pending'

  return {
    ...ORDER_STATUS_INFO[statusKey],
    label: getAdminOrderDetailStatusLabel(status, t)
  }
}

export function getAdminOrderDetailCode(orderId) {
  return `#${String(orderId || '').slice(-6).toUpperCase()}`
}

export function getAdminOrderDetailLocale(language) {
  return language?.startsWith('en') ? 'en-US' : 'vi-VN'
}

export function formatAdminOrderDetailCurrency(value, language) {
  return new Intl.NumberFormat(getAdminOrderDetailLocale(language), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

export function formatAdminOrderDetailDate(value, language) {
  if (!value) {
    return '--'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return '--'
  }

  return parsedDate.toLocaleString(getAdminOrderDetailLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getAdminOrderItemThumbnail(item) {
  return (
    item?.image ||
    item?.thumbnail ||
    item?.product?.image ||
    item?.product?.thumbnail ||
    item?.productId?.image ||
    item?.productId?.thumbnail ||
    ''
  )
}

export function getAdminOrderItemName(item, language, fallback = '') {
  const product = item?.productId && typeof item.productId === 'object' ? item.productId : item?.product
  const translatedProductTitle = isEnglishLanguage(language) ? product?.translations?.en?.title : null
  const translatedItemName = isEnglishLanguage(language) ? item?.translations?.en?.name : null

  if (hasText(translatedProductTitle)) return translatedProductTitle
  if (hasText(translatedItemName)) return translatedItemName
  if (hasText(item?.localizedName)) return item.localizedName
  if (hasText(product?.title)) return product.title
  if (hasText(item?.name)) return item.name

  return fallback
}

export function getAdminOrderItemKey(item) {
  return item?.productId?._id || item?.product?._id || item?.productId || item?._id || item?.name
}

export function getAdminOrderItemFallbackIcon() {
  return Package
}
