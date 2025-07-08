import { get, patch, post } from '../utils/request'

export const getAdminAccounts = async () => {
  return await get(`admin/accounts`)
}

export const createAdminAccount = async formData => {
  return await post(`admin/accounts/create`, formData)
}

export const updateAdminAccount = async (id, formData) => {
  return await patch(`admin/accounts/edit/${id}`, formData)
}

export const deleteAdminAccount = async id => {
  return await patch(`admin/accounts/delete/${id}`)
}

export const changeStatusAdminAccount = async (id, newStatus) => {
  return await patch(`admin/accounts/change-status/${id}`, { status: newStatus })
}
