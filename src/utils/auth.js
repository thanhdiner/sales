export function setAccessToken(token) {
  localStorage.setItem('adminAccessToken', token)
}
export function getAccessToken() {
  return localStorage.getItem('adminAccessToken')
}
export function clearTokens() {
  localStorage.removeItem('adminAccessToken')
}

export function setClientAccessToken(token) {
  localStorage.setItem('clientAccessToken', token)
}
export function getClientAccessToken() {
  return localStorage.getItem('clientAccessToken')
}
export function clearClientTokens() {
  localStorage.removeItem('clientAccessToken')
}

export function setClientAccessTokenSession(token) {
  sessionStorage.setItem('clientAccessToken', token)
}
export function getClientAccessTokenSession() {
  return sessionStorage.getItem('clientAccessToken')
}
export function clearClientTokensSession() {
  sessionStorage.removeItem('clientAccessToken')
}

export function getStoredClientAccessToken() {
  return getClientAccessToken() || getClientAccessTokenSession()
}

export function hasStoredClientAccessToken() {
  return Boolean(getStoredClientAccessToken())
}

export function hasStoredClientUser() {
  return Boolean(localStorage.getItem('user') || sessionStorage.getItem('user'))
}

export function getStoredClientUser() {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user')

  if (!user) return null

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export function hasClientAuthSession() {
  return hasStoredClientAccessToken()
}

const CLIENT_GUEST_ONLY_PATHS = [
  '/user/login',
  '/user/register',
  '/user/forgot-password',
  '/user/oauth-callback'
]

export function getClientPostLoginPath(from, fallback = '/') {
  const pathname = typeof from?.pathname === 'string' ? from.pathname : fallback

  if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.startsWith('/admin')) {
    return fallback
  }

  if (CLIENT_GUEST_ONLY_PATHS.includes(pathname)) {
    return fallback
  }

  const search = typeof from?.search === 'string' && from.search.startsWith('?') ? from.search : ''
  const hash = typeof from?.hash === 'string' && from.hash.startsWith('#') ? from.hash : ''

  return `${pathname}${search}${hash}`
}

export function getClientTokenStorage() {
  if (getClientAccessToken()) return 'local'
  if (getClientAccessTokenSession()) return 'session'
  return null
}

export function setClientAccessTokenByStorage(token, storage = 'local') {
  if (storage === 'session') {
    setClientAccessTokenSession(token)
    return
  }

  setClientAccessToken(token)
}

export function clearAllClientTokens() {
  clearClientTokens()
  clearClientTokensSession()
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')
}
