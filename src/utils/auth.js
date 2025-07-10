export function setAccessToken(token) {
  localStorage.setItem('adminAccessToken', token)
}
export function getAccessToken() {
  return localStorage.getItem('adminAccessToken')
}
export function clearTokens() {
  localStorage.removeItem('adminAccessToken')
}
