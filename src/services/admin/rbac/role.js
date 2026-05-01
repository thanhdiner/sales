import { get, patch, post } from '@/utils/request'

export const getRoles = () => {
  return get('admin/roles')
}

export const createRole = data => {
  return post('admin/roles/create', data)
}

export const updateRole = (id, data) => {
  return patch(`admin/roles/edit/${id}`, data)
}

export const updateRolePermissions = (id, permissions) => {
  return patch(`admin/roles/permissions/${id}`, { permissions })
}

export const deleteRole = id => {
  return patch(`admin/roles/delete/${id}`)
}

export const toggleRoleStatus = id => {
  return patch(`admin/roles/toggle-active/${id}`)
}

export const updateRoleById = updateRole
export const updateRolePermissionsById = updateRolePermissions
export const toggleStatusRole = toggleRoleStatus
