export const MAX_NOTIFICATIONS = 100
export const CLIENT_NOTIFICATIONS_STORAGE_KEY = 'client_order_notifications'
export const CLIENT_NOTIFICATIONS_UPDATED_EVENT = 'client-notifications-updated'

const isBrowser = typeof window !== 'undefined'

export function getShortOrderId(orderId) {
  return String(orderId || '')
    .slice(-6)
    .toUpperCase()
}

export function getNotificationStatusKey(status) {
  return status ? `notification.status.${status}` : 'notification.status.fallback'
}

export function getStatusLabel(status, t) {
  return t(getNotificationStatusKey(status), {
    defaultValue: status || t('notification.status.fallback')
  })
}

export function createOrderStatusNotification(order, t) {
  const shortOrderId = getShortOrderId(order?._id)
  const statusLabel = getStatusLabel(order?.status, t)

  return {
    id: `${order?._id}-${order?.status}-${Date.now()}`,
    title: t('notification.orderTitle', { orderId: shortOrderId }),
    body: t('notification.orderStatusBody', { status: statusLabel }),
    time: new Date(),
    read: false,
    orderId: order?._id,
    status: order?.status
  }
}

export function formatNotificationTime(time, language = 'vi') {
  return new Date(time).toLocaleString(language === 'en' ? 'en-US' : 'vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  })
}

export function formatNotificationRelativeTime(time, language = 'vi') {
  const timestamp = new Date(time).getTime()

  if (Number.isNaN(timestamp)) return ''

  const diffSeconds = Math.round((timestamp - Date.now()) / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const locale = language === 'en' ? 'en-US' : 'vi-VN'
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (absSeconds < 45) return formatter.format(0, 'second')
  if (absSeconds < 2700) return formatter.format(Math.round(diffSeconds / 60), 'minute')
  if (absSeconds < 86400) return formatter.format(Math.round(diffSeconds / 3600), 'hour')
  if (absSeconds < 2592000) return formatter.format(Math.round(diffSeconds / 86400), 'day')

  return formatNotificationTime(time, language)
}

export function getUnreadCount(list) {
  return list.filter(item => !item.read).length
}

export function hasUnread(list) {
  return list.some(item => !item.read)
}

export function getUnreadLabel(count, t) {
  if (count <= 0) return t('notification.allRead')
  if (count === 1) return t('notification.oneUnread')
  return t('notification.manyUnread', { count })
}

export function getNotificationAriaLabel(unreadCount, t) {
  return unreadCount > 0 ? t('notification.ariaLabel', { count: unreadCount }) : t('notification.bellTitle')
}

export function getNotificationBadgeText(unreadCount) {
  return unreadCount > 99 ? '99+' : unreadCount
}

export function getNotificationBellClassName() {
  return 'header__action__notification--btn relative flex h-8 w-8 items-center justify-center text-gray-700 transition-colors dark:text-gray-200'
}

export function getNotificationButtonTitle(t) {
  return t('notification.bellTitle')
}

export function getNotificationNewDotClassName() {
  return 'client-notification-dot absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-gray-800'
}

export function getNotificationNewDotVisible(list) {
  return hasUnread(list)
}

export function shouldShowUnreadBadge(unreadCount) {
  return unreadCount > 0
}

export function shouldMarkOneRead(list, notificationId) {
  return list.some(item => item.id === notificationId && !item.read)
}

export function shouldMarkAllRead(list) {
  return list.some(item => !item.read)
}

export function markNotificationRead(list, notificationId) {
  return list.map(item => (item.id === notificationId ? { ...item, read: true } : item))
}

export function markAllNotificationsRead(list) {
  return list.map(item => ({ ...item, read: true }))
}

export function markNotificationReadIfNeeded(list, notificationId) {
  return shouldMarkOneRead(list, notificationId) ? markNotificationRead(list, notificationId) : list
}

export function markAllNotificationsReadIfNeeded(list) {
  return shouldMarkAllRead(list) ? markAllNotificationsRead(list) : list
}

export function getNotificationCategory(notif) {
  if (notif?.category) return notif.category
  if (notif?.type) return notif.type
  if (notif?.paymentId || notif?.paymentStatus) return 'payments'
  if (notif?.orderId || notif?.status) return 'orders'
  return 'system'
}

export function shouldClosePanelAfterMarkAll() {
  return false
}

export function shouldClosePanelAfterClick() {
  return true
}

export function getNotificationPanelTitle(list, t) {
  return list.length === 0 ? t('notification.panelTitle') : t('notification.panelOrderTitle')
}

export function getNotificationEmptyLabel(t) {
  return t('notification.empty')
}

export function getMarkAllReadLabel(t) {
  return t('notification.markAllRead')
}

export function getNotificationCloseLabel(t) {
  return t('notification.close')
}

export function getNotificationTitleTextClassName() {
  return 'font-semibold text-gray-900 dark:text-gray-100'
}

export function getNotificationPanelHeaderClassName() {
  return 'flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700'
}

export function getNotificationPanelListClassName() {
  return 'max-h-80 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700'
}

export function getNotificationPanelEmptyWrapperClassName() {
  return 'flex flex-col items-center justify-center py-10 text-gray-400'
}

export function getNotificationPanelEmptyIconClassName() {
  return 'mb-2 h-8 w-8 opacity-30'
}

export function getNotificationEmptyTextClassName() {
  return 'text-sm'
}

export function getNotificationCloseButtonClassName() {
  return 'rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200'
}

export function getNotificationMarkAllClassName() {
  return 'flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
}

export function getNotificationRowColor(notif) {
  return notif.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50/80 dark:bg-blue-950/30'
}

export function getNotificationDotColor(notif) {
  return notif.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/60'
}

export function getNotificationTitleColor(notif) {
  return notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-blue-950 dark:text-blue-100'
}

export function getNotificationPanelRowClassName(notif) {
  return `flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50 dark:hover:bg-gray-700 ${getNotificationRowColor(notif)}`
}

export function getNotificationPanelIconWrapClassName(notif) {
  return `mt-0.5 shrink-0 rounded-lg p-1.5 ${getNotificationDotColor(notif)}`
}

export function getNotificationPanelTitleClassName(notif) {
  return `truncate text-sm font-semibold ${getNotificationTitleColor(notif)}`
}

export function getNotificationPanelBodyClassName() {
  return 'truncate text-xs text-gray-500 dark:text-gray-400'
}

export function getNotificationPanelTimeClassName() {
  return 'mt-0.5 text-[10px] text-gray-400'
}

export function getNotificationUnreadDotClassName() {
  return 'mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-300'
}

export function getNotificationItemTitle(notif) {
  return notif.title
}

export function getNotificationItemBody(notif) {
  return notif.body
}

export function getNotificationItemTime(notif) {
  return notif.time
}

export function getNotificationItemAriaLabel(notif, t) {
  return `${t('notification.openNotification')}: ${notif.title}`
}

export function createNotificationRowKey(notif) {
  return `${notif.id}-${notif.time}`
}

export function shouldShowEmptyState(list) {
  return list.length === 0
}

export function getClientOrderRoute(orderId) {
  return `/orders/${orderId}`
}

export function requestDesktopNotificationPermission() {
  if (!isBrowser) return

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function getDesktopNotificationBody(order, t) {
  const shortOrderId = getShortOrderId(order?._id)
  const statusLabel = getStatusLabel(order?.status, t)

  return t('notification.desktopBody', {
    orderId: shortOrderId,
    status: statusLabel
  })
}

export function prependNotification(list, notification) {
  return [notification, ...list].slice(0, MAX_NOTIFICATIONS)
}

export function loadStoredNotifications() {
  if (!isBrowser) return []

  try {
    const raw = window.localStorage.getItem(CLIENT_NOTIFICATIONS_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_NOTIFICATIONS) : []
  } catch {
    return []
  }
}

export function saveStoredNotifications(notifications) {
  if (!isBrowser) return

  try {
    window.localStorage.setItem(CLIENT_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)))
  } catch {
    // ignore storage failures
  }
}

export function emitStoredNotificationsUpdated(notifications) {
  if (!isBrowser) return

  window.dispatchEvent(
    new CustomEvent(CLIENT_NOTIFICATIONS_UPDATED_EVENT, {
      detail: {
        notifications: Array.isArray(notifications) ? notifications.slice(0, MAX_NOTIFICATIONS) : []
      }
    })
  )
}

export function updateStoredNotifications(notifications) {
  saveStoredNotifications(notifications)
  emitStoredNotificationsUpdated(notifications)
}

export function clearStoredNotifications() {
  if (!isBrowser) return

  try {
    window.localStorage.removeItem(CLIENT_NOTIFICATIONS_STORAGE_KEY)
  } catch {
    // ignore storage failures
  }
}
