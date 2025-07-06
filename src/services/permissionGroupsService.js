import { get, post, patch } from '../utils/request'

export const getAdminPermissionGroups = async () => {
  return await get(`admin/permission-groups`)
}

export const createAdminPermissionGroup = async data => {
  return await post(`admin/permission-groups/create`, data)
}

export const updateAdminPermissionGroupById = async (id, data) => {
  return await patch(`admin/permission-groups/edit/${id}`, data)
}

export const deleteAdminPermissionGroup = async id => {
  return await patch(`admin/permission-groups/delete/${id}`)
}

export const toggleAdminPermissionGroupActive = async (id, isActive) => {
  return await patch(`admin/permission-groups/toggle-active/${id}`, { isActive })
}
