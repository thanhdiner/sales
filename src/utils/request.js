const API_DOMAIN = 'http://localhost:3002/'

export const get = async path => {
  const res = await fetch(API_DOMAIN + path)
  return await res.json()
}
