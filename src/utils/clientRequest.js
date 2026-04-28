import {
  clearAllClientTokens,
  getClientTokenStorage,
  getStoredClientAccessToken,
  setClientAccessTokenByStorage
} from './auth'
import { userRefreshToken } from '../services/userService'
import { store } from '../stores'
import { setUser } from '../stores/user'
import { API_URL } from './env'

const API_DOMAIN = API_URL

let refreshingPromise = null

const getAuthHeaders = clientAccessToken => (clientAccessToken ? { Authorization: `Bearer ${clientAccessToken}` } : {})
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

const hasStoredClientUserMarker = () => Boolean(
  store.getState().clientUser.user ||
  localStorage.getItem('user') ||
  sessionStorage.getItem('user')
)

const refreshAccessToken = async () => {
  const storage = getClientTokenStorage() || 'local'

  try {
    const res = await userRefreshToken()

    if (res?.clientAccessToken) {
      setClientAccessTokenByStorage(res.clientAccessToken, storage)

      const nextUser = res.user || store.getState().clientUser.user
      if (nextUser) {
        store.dispatch(setUser({ user: nextUser, token: res.clientAccessToken }))

        if (storage === 'session') {
          sessionStorage.setItem('user', JSON.stringify(nextUser))
        } else {
          localStorage.setItem('user', JSON.stringify(nextUser))
        }
      }

      return res.clientAccessToken
    }

    throw new Error('No new token')
  } catch (err) {
    clearAllClientTokens()
    throw err
  } finally {
    refreshingPromise = null
  }
}

const getFreshAccessToken = async () => {
  if (refreshingPromise) {
    try {
      await refreshingPromise
    } catch {
      // ignore here and let caller handle it
    }
  }

  let token = getStoredClientAccessToken()

  if (!token && hasStoredClientUserMarker()) {
    try {
      if (!refreshingPromise) refreshingPromise = refreshAccessToken()
      token = await refreshingPromise
    } catch {
      token = null
    }
  }

  return token
}

const requestWithAuth = async (method, path, data) => {
  const isFormData = data instanceof FormData
  let clientAccessToken = await getFreshAccessToken()

  let headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...getLanguageHeaders(),
    ...getAuthHeaders(clientAccessToken)
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

  const authPaths = ['user/login', 'user/register', 'user/forgot-password', 'user/reset-password', 'user/refresh-token', 'user/auth/verify']
  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath))

  if ((res.status === 401 || res.status === 403) && !isAuthPath) {
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
      clearAllClientTokens()
      throw new Error('Vui lòng đăng nhập lại')
    }
  }

  if (!res.ok) {
    const error = new Error(`${json?.error || json?.message || res.statusText}`)
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
