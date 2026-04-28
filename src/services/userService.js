import { get, patch, post } from '@/utils/clientRequest'
import { API_URL } from '@/utils/env'
import { publicPost } from '@/utils/publicRequest'

const API_DOMAIN = API_URL

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

export const updateClientCheckoutProfile = async profile => {
  const candidatePaths = ['user/checkout-profile', 'user/update-checkout-profile']
  let lastError = null

  for (const path of candidatePaths) {
    try {
      return await patch(path, profile)
    } catch (error) {
      const message = `${error?.message || error?.response?.message || ''}`.toLowerCase()
      const isMissingRoute = error?.status === 404 && (
        message.includes('route không tồn tại') ||
        message.includes('route khong ton tai') ||
        message.includes('route not found')
      )

      if (!isMissingRoute) {
        throw error
      }

      lastError = error
    }
  }

  throw lastError || new Error('Không tìm thấy endpoint lưu thông tin đặt hàng')
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
