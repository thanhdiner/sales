const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

export const publicGet = async path => {
  const res = await fetch(`${API_DOMAIN}/${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
  const result = await res.json()
  return { ...result, status: res.status }
}

export const publicPost = async (path, data) => {
  const res = await fetch(`${API_DOMAIN}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  const result = await res.json()
  return { ...result, status: res.status }
}
