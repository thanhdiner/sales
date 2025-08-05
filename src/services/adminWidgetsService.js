import { get, post, patch, del } from '@/utils/request'

//# ADMIN WIDGETS

export const getAdminWidgets = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return await get(query ? `admin/widgets?${query}` : 'admin/widgets')
}

export const createWidget = async data => {
  return await post('admin/widgets', data)
}

export const updateWidgetById = async (id, data) => {
  return await patch(`admin/widgets/${id}`, data)
}

export const deleteWidgetById = async id => {
  return await del(`admin/widgets/${id}`)
}

export const getWidgetById = async id => {
  return await get(`admin/widgets/${id}`)
}
