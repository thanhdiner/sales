import { getClientAccessToken, setClientAccessToken, clearClientTokens } from './auth'
import { userRefreshToken } from '../services/userService'
import { store } from '../stores'
import { setUser } from '../stores/user'

const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

let refreshingPromise = null

const getAuthHeaders = clientAccessToken => (clientAccessToken ? { Authorization: `Bearer ${clientAccessToken}` } : {})

const refreshAccessToken = async () => {
  try {
    const res = await userRefreshToken()
    if (res?.clientAccessToken) {
      setClientAccessToken(res.clientAccessToken)

      const currentUser = store.getState().clientUser.user
      if (currentUser) {
        store.dispatch(setUser({ user: currentUser, token: res.clientAccessToken }))
      }
      return res.clientAccessToken
    }
    throw new Error('No new token')
  } catch (err) {
    clearClientTokens()
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
  return getClientAccessToken()
}

const requestWithAuth = async (method, path, data) => {
  const isFormData = data instanceof FormData
  let clientAccessToken = await getFreshAccessToken()

  let headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(clientAccessToken)
  }

  const options = {
    method,
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

  const authPaths = ['user/login', 'user/register', 'user/forgot-password', 'user/reset-password', 'user/auth/refresh', 'user/auth/verify']
  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath))

  if ((res.status === 401 || res.status === 403) && !isAuthPath) {
    try {
      if (!refreshingPromise) refreshingPromise = refreshAccessToken()
      const newToken = await refreshingPromise
      headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
      clearClientTokens()
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
export const patch = (path, data) => requestWithAuth('PATCH', path, data)
export const del = (path, data) => requestWithAuth('DELETE', path, data)
