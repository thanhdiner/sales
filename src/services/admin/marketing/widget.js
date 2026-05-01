import { del, get, patch, post } from '@/utils/request'

export const getWidgets = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return get(query ? `admin/widgets?${query}` : 'admin/widgets')
}

export const createWidget = data => {
  return post('admin/widgets', data)
}

export const updateWidget = (id, data) => {
  return patch(`admin/widgets/${id}`, data)
}

export const deleteWidget = id => {
  return del(`admin/widgets/${id}`)
}

export const getWidget = id => {
  return get(`admin/widgets/${id}`)
}

export const getAdminWidgets = getWidgets
export const updateWidgetById = updateWidget
export const deleteWidgetById = deleteWidget
export const getWidgetById = getWidget
