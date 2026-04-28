import { get, post, patch } from '../utils/request'

export const getAdminRoles = async () => {
  return await get(`admin/roles`)
}

export const createAdminRole = async data => {
  return await post(`admin/roles/create`, data)
}

export const updateAdminRoleById = async (id, data) => {
  return await patch(`admin/roles/edit/${id}`, data)
}

export const updateAdminRolePermissionsById = async (id, permissions) => {
  return await patch(`admin/roles/permissions/${id}`, { permissions })
}

export const deleteAdminRole = async id => {
  return await patch(`admin/roles/delete/${id}`)
}

export const toggleStatusAdminRole = async (id) => {
  return await patch(`admin/roles/toggle-active/${id}`)
}
