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
}
