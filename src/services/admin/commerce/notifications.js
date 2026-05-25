import { del, get, patch } from '@/utils/request'

export const getAdminNotifications = ({
  page = 1,
  limit = 10,
  search = '',
  tab = 'all',
  type = 'all',
  priority = 'all',
  status = 'all',
  dateRange = null
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    tab,
    type,
    priority,
    status
  })

  if (search?.trim()) params.set('search', search.trim())
  if (Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
    params.set('startDate', dateRange[0].startOf('day').toISOString())
    params.set('endDate', dateRange[1].endOf('day').toISOString())
  }

  return get(`admin/notifications?${params.toString()}`)
}

export const markAdminNotificationsRead = ids =>
  patch('admin/notifications/read', Array.isArray(ids) ? { ids } : { all: true })

export const archiveAdminNotifications = ids =>
  patch('admin/notifications/archive', { ids: Array.isArray(ids) ? ids : [ids].filter(Boolean) })

export const deleteAdminNotifications = ids =>
  del('admin/notifications', { ids: Array.isArray(ids) ? ids : [ids].filter(Boolean) })
