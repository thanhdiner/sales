import { get, patch, post } from '@/utils/request'

export const getPermissions = group => {
  const query = group ? `?group=${group}` : ''
  return get(`admin/permissions${query}`)
}

export const createPermissions = data => {
  return post('admin/permissions/create', data)
}

export const updatePermission = (id, data) => {
  return patch(`admin/permissions/edit/${id}`, data)
}

export const deletePermission = id => {
  return patch(`admin/permissions/delete/${id}`, { deleted: true })
}

export const updatePermissionById = updatePermission
