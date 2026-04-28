import { getAccessToken, setAccessToken, clearTokens } from './auth'
import { authAdminRefresh } from '../services/adminAuth.service'
import { store } from '../stores'
import { setUser } from '../stores/adminUser'
import { API_URL } from './env'

const API_DOMAIN = API_URL

let refreshingPromise = null

const getAuthHeaders = accessToken => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
const getCurrentLanguage = () => {
  try {
    return localStorage.getItem('language') === 'en' ? 'en' : 'vi'
  } catch {
    return 'vi'
  }
}

const getLanguageHeaders = () => ({
  'Accept-Language': getCurrentLanguage()
})

const refreshAccessToken = async () => {
  try {
    const res = await authAdminRefresh()
    if (res?.accessToken) {
      setAccessToken(res.accessToken)

      const currentUser = store.getState().user.user
      if (currentUser) {
        store.dispatch(setUser({ user: currentUser, token: res.accessToken }))
      }
      return res.accessToken
    }
    throw new Error('No new token')
  } catch (err) {
    clearTokens()
    throw err
  } finally {
    refreshingPromise = null
  }
}

const getFreshAccessToken = async () => {
  if (refreshingPromise) {
    try {
      await refreshingPromise
    } catch {}
  }
  return getAccessToken()
}

const requestWithAuth = async (method, path, data) => {
  const isFormData = data instanceof FormData
  let accessToken = await getFreshAccessToken()

  let headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...getLanguageHeaders(),
    ...getAuthHeaders(accessToken)
  }

  const options = {
    method,
    cache: 'no-store',
    credentials: 'include',
    headers,
    ...(method !== 'GET' && { body: isFormData ? data : JSON.stringify(data) })
  }

  let res = await fetch(`${API_DOMAIN}/${path}`, options)
  let json
  try {
    json = await res.json()
  } catch {
    json = null
  }

  if ((res.status === 401 || res.status === 403) && !path.startsWith('admin/auth/')) {
    try {
      if (!refreshingPromise) refreshingPromise = refreshAccessToken()
      const newToken = await refreshingPromise
      headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...getLanguageHeaders(),
        Authorization: `Bearer ${newToken}`
      }
      options.headers = headers
      res = await fetch(`${API_DOMAIN}/${path}`, options)
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

export const get = path => requestWithAuth('GET', path)
export const post = (path, data) => requestWithAuth('POST', path, data)
export const put = (path, data) => requestWithAuth('PUT', path, data)
export const patch = (path, data) => requestWithAuth('PATCH', path, data)
export const del = (path, data) => requestWithAuth('DELETE', path, data)
