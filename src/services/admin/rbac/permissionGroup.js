import { get, patch, post } from '@/utils/request'

export const getPermissionGroups = () => {
  return get('admin/permission-groups')
}

export const createPermissionGroup = data => {
  return post('admin/permission-groups/create', data)
}

export const updatePermissionGroup = (id, data) => {
  return patch(`admin/permission-groups/edit/${id}`, data)
}

export const deletePermissionGroup = id => {
  return patch(`admin/permission-groups/delete/${id}`)
}

export const togglePermissionGroupActive = (id, isActive) => {
  return patch(`admin/permission-groups/toggle-active/${id}`, { isActive })
}

export const updatePermissionGroupById = updatePermissionGroup
