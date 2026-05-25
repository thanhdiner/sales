import { get, patch } from '@/utils/clientRequest'

export const getClientNotifications = ({ limit = 50, category = '', status = 'all' } = {}) => {
  const params = new URLSearchParams({
    limit: String(limit),
    status
  })

  if (category) params.set('category', category)

  return get(`notifications?${params.toString()}`)
}

export const markClientNotificationsRead = ids =>
  patch('notifications/read', Array.isArray(ids) ? { ids } : { all: true })

export const getClientNotificationPreferences = () =>
  get('user/notification-preferences')

export const updateClientNotificationPreferences = preferences =>
  patch('user/notification-preferences', preferences)
