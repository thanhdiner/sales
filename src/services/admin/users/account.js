import { del, get, patch, post } from '@/utils/request'

export const getAccounts = () => {
  return get('admin/accounts')
}

export const createAccount = formData => {
  return post('admin/accounts/create', formData)
}

export const updateAccount = (id, formData) => {
  return patch(`admin/accounts/edit/${id}`, formData)
}

export const deleteAccount = id => {
  return patch(`admin/accounts/delete/${id}`)
}

export const changeAccountStatus = (id, status) => {
  return patch(`admin/accounts/change-status/${id}`, { status })
}

export const changeStatusAccount = changeAccountStatus

export const updateAvatar = (id, formData) => {
  return patch(`admin/accounts/update-avatar/${id}`, formData)
}

export const updateProfile = (id, formData) => {
  return patch(`admin/accounts/update-profile/${id}`, formData)
}

export const changePassword = formData => {
  return patch('admin/accounts/change-password', formData)
}

export const get2FAStatus = () => {
  return get('admin/accounts/2fa/status')
}

export const generate2FASecret = () => {
  return post('admin/accounts/2fa/generate')
}

export const disable2FA = () => {
  return post('admin/accounts/2fa/disable')
}

export const verify2FACode = code => {
  return post('admin/accounts/2fa/verify', { code })
}

export const getBackupCodes = () => {
  return post('admin/accounts/2fa/backup-codes')
}

export const trustDevice = deviceData => {
  return post('admin/accounts/trusted-devices', deviceData)
}

export const getTrustedDevices = () => {
  return get('admin/accounts/trusted-devices')
}

export const removeTrustedDevice = deviceId => {
  return del(`admin/accounts/trusted-devices/${deviceId}`)
}
