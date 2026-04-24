export const MAX_NOTIFICATIONS = 20
export const CLIENT_NOTIFICATIONS_STORAGE_KEY = 'client_order_notifications'

const isBrowser = typeof window !== 'undefined'

export const statusMap = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ'
}

export function getStatusLabel(status) {
  return statusMap[status] || status || 'Cập nhật'
}

export function createOrderStatusNotification(order) {
  const shortOrderId = String(order?._id || '').slice(-6).toUpperCase()

  return {
    id: `${order?._id}-${order?.status}-${Date.now()}`,
    title: `Đơn hàng #${shortOrderId}`,
    body: `Đã chuyển sang trạng thái ${getStatusLabel(order?.status)}`,
    time: new Date(),
    read: false,
    orderId: order?._id
  }
}

export function formatNotificationTime(time) {
  return new Date(time).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  })
}

export function getUnreadCount(list) {
  return list.filter(item => !item.read).length
}

export function hasUnread(list) {
  return list.some(item => !item.read)
}

export function getUnreadLabel(count) {
  if (count <= 0) return 'Tất cả đã đọc'
  if (count === 1) return '1 thông báo chưa đọc'
  return `${count} thông báo chưa đọc`
}

export function getNotificationAriaLabel(unreadCount) {
  return unreadCount > 0 ? `Thông báo, ${getUnreadLabel(unreadCount)}` : 'Thông báo'
}

export function getNotificationBadgeText(unreadCount) {
  return unreadCount > 99 ? '99+' : unreadCount
}

export function getNotificationBellClassName() {
  return 'header__action__notification--btn relative flex items-center justify-center text-gray-700 transition-colors dark:text-gray-200'
}

export function getNotificationButtonTitle() {
  return 'Thông báo'
}

export function getNotificationNewDotClassName() {
  return 'absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-gray-800'
}

export function getNotificationNewDotVisible(list) {
  return list.length > 0 && !hasUnread(list)
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

export function shouldClosePanelAfterMarkAll() {
  return true
}

export function shouldClosePanelAfterClick() {
  return true
}

export function getNotificationPanelTitle(list) {
  return list.length === 0 ? 'Thông báo' : 'Cập nhật đơn hàng'
}

export function getNotificationEmptyLabel() {
  return 'Chưa có cập nhật đơn hàng nào'
}

export function getMarkAllReadLabel() {
  return 'Đọc tất cả'
}

export function getNotificationCloseLabel() {
  return 'Đóng thông báo'
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
  return notif.read ? '' : 'bg-gray-50 dark:bg-gray-800/70'
}

export function getNotificationDotColor(notif) {
  return notif.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'
}

export function getNotificationTitleColor(notif) {
  return notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'
}

export function getNotificationPanelRowClassName(notif) {
  return `flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${getNotificationRowColor(notif)}`
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
  return 'mt-2 h-2 w-2 shrink-0 rounded-full bg-gray-900 dark:bg-gray-100'
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

export function getNotificationItemAriaLabel(notif) {
  return `${notif.title}: ${notif.body}`
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
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function getDesktopNotificationBody(order) {
  const shortOrderId = String(order?._id || '').slice(-6).toUpperCase()
  return `Đơn hàng #${shortOrderId} đã chuyển sang ${getStatusLabel(order?.status)}`
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

export function clearStoredNotifications() {
  if (!isBrowser) return

  try {
    window.localStorage.removeItem(CLIENT_NOTIFICATIONS_STORAGE_KEY)
  } catch {
    // ignore storage failures
  }
}
