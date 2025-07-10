import { getAccessToken, setAccessToken, clearTokens } from './auth'
import { authAdminRefresh } from '../services/adminAuth.service'

const API_DOMAIN = 'http://localhost:3001/api/v1/'

const getAuthHeaders = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const refreshAccessToken = async () => {
  try {
    const res = await authAdminRefresh()
    if (res.ok && res.accessToken) {
      setAccessToken(res.accessToken)
      return res.accessToken
    } else {
      clearTokens()
      throw new Error('Refresh token failed')
    }
  } catch (err) {
    clearTokens()
    throw err
  }
}

const requestWithAuth = async (method, path, data) => {
  const isFormData = data instanceof FormData
  let headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders()
  }

  let options = {
    method,
    credentials: 'include',
    headers
  }
  if (method !== 'GET') options.body = isFormData ? data : JSON.stringify(data)

  let res = await fetch(API_DOMAIN + path, options)
  let json
  try {
    json = await res.json()
  } catch {
    json = null
  }

  if ((res.status === 401 || res.status === 403) && path !== 'admin/auth/login' && path !== 'admin/auth/refresh-token') {
    try {
      const newToken = await refreshAccessToken()
      headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${newToken}`
      }
      options.headers = headers
      res = await fetch(API_DOMAIN + path, options)
      try {
        json = await res.json()
      } catch {
        json = null
      }
    } catch (err) {
      clearTokens()
      throw new Error('Vui lòng đăng nhập lại')
    }
  }

  if (!res.ok) {
    const error = new Error(`API Error ${res.status}: ${json?.error || json?.message || res.statusText}`)
    error.status = res.status
    error.response = json
    throw error
  }

  return json
}

export const get = async path => await requestWithAuth('GET', path)
export const post = async (path, data) => await requestWithAuth('POST', path, data)
export const patch = async (path, data) => await requestWithAuth('PATCH', path, data)
