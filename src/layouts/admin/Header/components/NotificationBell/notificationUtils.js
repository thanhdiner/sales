export const MAX_NOTIFICATIONS = 20

const getLocale = language => (language?.startsWith('en') ? 'en-US' : 'vi-VN')

function formatVnd(amount, language) {
  return new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(amount || 0))
}

export function createOrderNotification(order, translate = key => key, language) {
  const customerName =
    [order?.contact?.firstName, order?.contact?.lastName].filter(Boolean).join(' ').trim() || translate('notifications.newCustomer')

  return {
    id: order?._id,
    title: translate('notifications.newOrderTitle'),
    body: `${customerName} - ${formatVnd(order?.total, language)}`,
    time: new Date(),
    read: false,
    orderId: order?._id
  }
}

export function formatNotificationTime(time, language) {
  return new Date(time).toLocaleTimeString(getLocale(language), {
    hour: '2-digit',
    minute: '2-digit'
  })
}
