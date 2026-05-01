import { get, patch, post } from '@/utils/clientRequest'
import { API_URL } from '@/utils/env'
import { publicPost } from '@/utils/publicRequest'

const API_DOMAIN = API_URL

export const register = data => {
  return publicPost('user/register', data)
}

export const login = data => {
  return publicPost('user/login', data)
}

export const logout = () => {
  return fetch(`${API_DOMAIN}/user/logout`, {
    method: 'POST',
    credentials: 'include'
  }).then(res => {
    if (!res.ok) {
      throw new Error('Logout failed')
    }

    return true
  })
}

export const forgotPassword = data => {
  return publicPost('user/forgot-password', data)
}

export const verifyResetCode = data => {
  return publicPost('user/verify-reset-code', data)
}

export const resetPassword = data => {
  return publicPost('user/reset-password', data)
}

export const refreshToken = () => {
  return fetch(`${API_DOMAIN}/user/refresh-token`, {
    method: 'POST',
    credentials: 'include'
  }).then(async res => {
    if (!res.ok) {
      const error = new Error('Refresh token request failed')
      error.status = res.status
      throw error
    }

    return res.json()
  })
}

export const getMe = () => {
  return get('user/me')
}

export const updateProfile = formData => {
  return patch('user/update-profile', formData)
}

export const updateCheckoutProfile = async profile => {
  const candidatePaths = ['user/checkout-profile', 'user/update-checkout-profile']
  let lastError = null

  for (const path of candidatePaths) {
    try {
      return await patch(path, profile)
    } catch (error) {
      const message = `${error?.message || error?.response?.message || ''}`.toLowerCase()
      const isMissingRoute =
        error?.status === 404 &&
        (message.includes('route không tồn tại') || message.includes('route khong ton tai') || message.includes('route not found'))

      if (!isMissingRoute) {
        throw error
      }

      lastError = error
    }
  }

  throw lastError || new Error('Không tìm thấy endpoint lưu thông tin đặt hàng')
}

export const requestEmailUpdate = email => {
  return post('user/request-email-update', { email })
}

export const confirmEmailUpdate = (email, code) => {
  return post('user/confirm-email-update', { email, code })
}

export const changePassword = formData => {
  return patch('user/change-password', formData)
}

export const userRegister = register
export const userLogin = login
export const userLogout = logout
export const userRefreshToken = refreshToken
export const getClientMe = getMe
export const clientUpdateProfile = updateProfile
export const updateClientCheckoutProfile = updateCheckoutProfile
