import { del, get, patch, post } from '@/utils/request'

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

export const updateAdminAvatar = async (id, formData) => {
  return await patch(`admin/accounts/update-avatar/${id}`, formData)
}

export const updateAdminProfile = async (id, formData) => {
  return await patch(`admin/accounts/update-profile/${id}`, formData)
}

export const changePasswordAdminAccount = async formData => {
  return await patch(`admin/accounts/change-password`, formData)
}

export const get2FAStatus = async () => {
  return await get(`admin/accounts/2fa/status`)
}

export const generate2FASecret = async () => {
  return await post(`admin/accounts/2fa/generate`)
}

export const disable2FA = async () => {
  return await post(`admin/accounts/2fa/disable`)
}

export const verify2FACode = async code => {
  return await post(`admin/accounts/2fa/verify`, { code })
}

export const getBackupCodes = async () => {
  return await post(`admin/accounts/2fa/backup-codes`)
}

export const trustDevice = async deviceData => {
  return await post(`admin/accounts/trusted-devices`, deviceData)
}

export const getTrustedDevices = async () => {
  return await get(`admin/accounts/trusted-devices`)
}

export const removeTrustedDevice = async deviceId => {
  return await del(`admin/accounts/trusted-devices/${deviceId}`)
}
