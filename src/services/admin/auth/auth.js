import { API_URL } from '@/utils/env'

const API_DOMAIN = API_URL

export const login = data => {
  return fetch(`${API_DOMAIN}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(res => res.json())
}

export const logout = () => {
  return fetch(`${API_DOMAIN}/admin/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  }).then(res => {
    if (!res.ok) {
      throw new Error('Logout failed')
    }

    return true
  })
}

export const refreshToken = () => {
  return fetch(`${API_DOMAIN}/admin/auth/refresh-token`, {
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

export const verify2FA = data => {
  return fetch(`${API_DOMAIN}/admin/auth/2fa-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(res => res.json())
}

export const verify2FALogin = verify2FA
export const authAdminLogout = logout
export const authAdminRefresh = refreshToken
