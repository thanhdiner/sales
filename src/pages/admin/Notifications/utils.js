import {
  AlertTriangle,
  Bell,
  CreditCard,
  Package,
  RefreshCw,
  RotateCcw,
  ShoppingCart,
  Star,
  UserPlus,
  XCircle
} from 'lucide-react'
import { adminNotificationTypeGroups } from './data'

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')
const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getNotificationGroup = notification => adminNotificationTypeGroups[notification.type] || 'system'

export const getLocalizedNotificationField = (notification, field, language) => {
  const translatedValue = isEnglishLanguage(language) ? notification.translations?.en?.[field] : null
  if (hasText(translatedValue)) return translatedValue
  return notification[field] || ''
}

export const getNotificationStatus = notification => (notification.readAt ? 'read' : 'unread')

export const isUrgentNotification = notification =>
  notification.priority === 'high' || notification.actionRequired === true || ['refund_requested', 'payment_failed', 'out_of_stock'].includes(notification.type)

export const getDropdownPriorityScore = notification => {
  const typeScores = {
    refund_requested: 100,
    payment_failed: 90,
    order_created: 80,
    out_of_stock: 72,
    low_stock: 70,
    review_created: 60,
    system_alert: 50
  }

  const priorityScore = notification.priority === 'high' ? 10 : notification.priority === 'normal' ? 4 : 0
  const unreadScore = notification.readAt ? 0 : 6
  const actionScore = notification.actionRequired ? 8 : 0

  return (typeScores[notification.type] || 10) + priorityScore + unreadScore + actionScore
}

export const getNotificationIcon = notification => {
  const icons = {
    order_created: ShoppingCart,
    order_cancelled: XCircle,
    payment_success: CreditCard,
    payment_failed: XCircle,
    low_stock: Package,
    out_of_stock: AlertTriangle,
    review_created: Star,
    refund_requested: RotateCcw,
    user_registered: UserPlus,
    system_alert: Bell
  }

  return icons[notification.type] || Bell
}

export const getNotificationActionRoute = notification => {
  const targetId = notification.targetId

  if (notification.targetType === 'order' || notification.targetType === 'payment' || notification.targetType === 'refund') {
    return targetId ? `/admin/orders/${targetId}` : '/admin/orders'
  }

  if (notification.targetType === 'product') return targetId ? `/admin/products/details/${targetId}` : '/admin/products'
  if (notification.targetType === 'review') return '/admin/reviews'
  if (notification.targetType === 'user') return '/admin/accounts'
  if (notification.targetType === 'system') return '/admin/dashboard'

  return '/admin/dashboard'
}

export const getNotificationActionKey = notification => {
  if (notification.targetType === 'payment') return 'viewPayment'
  if (notification.targetType === 'product') return 'viewProduct'
  if (notification.targetType === 'review') return 'viewReview'
  if (notification.targetType === 'refund') return 'viewRefund'
  if (notification.targetType === 'user') return 'viewUser'
  if (notification.targetType === 'system') return 'viewSystem'
  return 'viewOrder'
}

export function createOrderAdminNotification(order, translate = key => key, language = 'vi') {
  const customerName =
    [order?.contact?.firstName, order?.contact?.lastName].filter(Boolean).join(' ').trim() || translate('messages.newCustomer', { defaultValue: 'New customer' })
  const total = new Intl.NumberFormat(String(language || '').startsWith('en') ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(order?.total || 0))
  const orderId = order?.code || order?.orderCode || order?._id

  return {
    _id: `socket_order_${order?._id || Date.now()}`,
    type: 'order_created',
    priority: 'high',
    title: translate('socket.orderTitle', { orderId, defaultValue: `New order #${orderId || ''}` }),
    message: translate('socket.orderMessage', {
      customerName,
      total,
      defaultValue: `${customerName} has placed an order worth ${total}.`
    }),
    targetType: 'order',
    targetId: order?._id || orderId,
    actionRequired: true,
    readAt: null,
    createdAt: new Date().toISOString()
  }
}

export const formatNotificationRelativeTime = (value, language = 'vi') => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  const isEnglish = isEnglishLanguage(language)

  if (diffSeconds < 60) return isEnglish ? 'now' : 'vừa xong'

  const units = [
    { seconds: 60, vi: 'phút trước', en: 'minutes ago' },
    { seconds: 60 * 60, vi: 'giờ trước', en: 'hours ago' },
    { seconds: 60 * 60 * 24, vi: 'ngày trước', en: 'days ago' }
  ]

  if (diffSeconds < units[1].seconds) {
    const valueInMinutes = Math.floor(diffSeconds / units[0].seconds)
    return isEnglish ? `${valueInMinutes} ${valueInMinutes === 1 ? 'minute' : 'minutes'} ago` : `${valueInMinutes} phút trước`
  }

  if (diffSeconds < units[2].seconds) {
    const valueInHours = Math.floor(diffSeconds / units[1].seconds)
    return isEnglish ? `${valueInHours} ${valueInHours === 1 ? 'hour' : 'hours'} ago` : `${valueInHours} giờ trước`
  }

  if (diffSeconds < units[2].seconds * 7) {
    const valueInDays = Math.floor(diffSeconds / units[2].seconds)
    return isEnglish ? `${valueInDays} ${valueInDays === 1 ? 'day' : 'days'} ago` : `${valueInDays} ngày trước`
  }

  return new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const createNotificationStats = notifications => {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

  return {
    total: notifications.length,
    unread: notifications.filter(notification => !notification.readAt).length,
    actionRequired: notifications.filter(notification => notification.actionRequired).length,
    today: notifications.filter(notification => new Date(notification.createdAt).getTime() >= startOfToday).length
  }
}

export const notificationMatchesFilters = (notification, filters, language) => {
  const group = getNotificationGroup(notification)
  const status = getNotificationStatus(notification)
  const tab = filters.tab || 'all'

  if (tab === 'unread' && status !== 'unread') return false
  if (tab === 'actionRequired' && !notification.actionRequired) return false
  if (!['all', 'unread', 'actionRequired'].includes(tab) && group !== tab) return false

  if (filters.type && filters.type !== 'all' && notification.type !== filters.type) return false
  if (filters.priority && filters.priority !== 'all' && notification.priority !== filters.priority) return false
  if (filters.status === 'read' && status !== 'read') return false
  if (filters.status === 'unread' && status !== 'unread') return false
  if (filters.status === 'actionRequired' && !notification.actionRequired) return false

  if (Array.isArray(filters.dateRange) && filters.dateRange[0] && filters.dateRange[1]) {
    const createdAt = new Date(notification.createdAt).getTime()
    const startAt = filters.dateRange[0].startOf('day').valueOf()
    const endAt = filters.dateRange[1].endOf('day').valueOf()
    if (createdAt < startAt || createdAt > endAt) return false
  }

  const search = String(filters.search || '').trim().toLowerCase()
  if (!search) return true

  return [
    getLocalizedNotificationField(notification, 'title', language),
    getLocalizedNotificationField(notification, 'message', language),
    notification.targetId,
    notification.type,
    notification.priority
  ]
    .filter(Boolean)
    .some(value => String(value).toLowerCase().includes(search))
}

export const getPriorityClassName = priority => {
  if (priority === 'high') return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'
  if (priority === 'low') return 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
  return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
}

export const getGroupIconClassName = notification => {
  if (!notification.readAt) return 'border-[var(--admin-accent-soft)] bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
  return 'border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]'
}

export const refreshIcon = RefreshCw
