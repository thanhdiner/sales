export const MAX_NOTIFICATIONS = 20

export function createOrderNotification(order) {
  const customerName =
    [order?.contact?.firstName, order?.contact?.lastName].filter(Boolean).join(' ').trim() || 'Khách hàng mới'

  return {
    id: order?._id,
    title: 'Đơn hàng mới!',
    body: `${customerName} — ${Number(order?.total || 0).toLocaleString('vi-VN')}₫`,
    time: new Date(),
    read: false,
    orderId: order?._id
  }
}

export function formatNotificationTime(time) {
  return new Date(time).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
