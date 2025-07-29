const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

export const authAdminLogin = data =>
  fetch(API_DOMAIN + '/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(res => res.json())

export const authAdminLogout = () =>
  fetch(API_DOMAIN + '/admin/auth/logout', {
    method: 'POST',
    credentials: 'include'
  }).then(res => {
    if (!res.ok) throw new Error('Logout failed')
    return true
  })

export const authAdminRefresh = () =>
  fetch(API_DOMAIN + '/admin/auth/refresh-token', {
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

export const authAdmin2FAVerify = data =>
  fetch(API_DOMAIN + '/admin/auth/2fa-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(res => res.json())
