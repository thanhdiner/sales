import { get, patch, post } from '../utils/request'

export const getAdminPermissions = async group => {
  const g = group ? `group=${group}` : ''
  return await get(`admin/permissions?${g}`)
}

export const createAdminPermissions = async data => {
  return await post('admin/permissions/create', data)
}

export const updatePermissionById = async (id, data) => {
  return await patch(`admin/permissions/edit/${id}`, data)
}

export const deleteAdminPermission = async id => {
  return await patch(`admin/permissions/delete/${id}`, { deleted: true })
}
