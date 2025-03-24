const API_DOMAIN = 'http://localhost:3001/api/v1/'

export const get = async path => {
  try {
    const res = await fetch(API_DOMAIN + path)

    if (!res.ok) {
      if (res.status === 404) return null
      const errorText = await res.text()
      throw new Error(`API Error ${res.status}: ${errorText}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Fetch error:', error.message)
    throw error
  }
}
