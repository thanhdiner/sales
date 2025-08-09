import { get, patch, post } from '@/utils/clientRequest'
import { publicPost } from '@/utils/publicRequest'
const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

export const userRegister = data => publicPost('user/register', data)

export const userLogin = data => publicPost('user/login', data)

export const userLogout = () =>
  fetch(API_DOMAIN + '/user/logout', {
    method: 'POST',
    credentials: 'include'
  }).then(res => {
    if (!res.ok) throw new Error('Logout failed')
    return true
  })

export const forgotPassword = data => publicPost('user/forgot-password', data)

export const verifyResetCode = data => publicPost('user/verify-reset-code', data)

export const resetPassword = data => publicPost('user/reset-password', data)

export const userRefreshToken = () =>
  fetch(API_DOMAIN + '/user/refresh-token', {
    method: 'POST',
    credentials: 'include'
  }).then(async res => {
    if (!res.ok) {
      const err = new Error('Refresh token request failed')
      err.status = res.status
      throw err
    }
    return res.json()
  })

export const getClientMe = async () => {
  return await get('user/me')
}

export const clientUpdateProfile = async formData => {
  return await patch('user/update-profile', formData)
}

export const requestEmailUpdate = async email => {
  return await post('user/request-email-update', { email })
}

export const confirmEmailUpdate = async (email, code) => {
  return await post('user/confirm-email-update', { email, code })
}

export const changePassword = async formData => {
  return await patch(`user/change-password`, formData)
}
