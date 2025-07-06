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

export const post = async (path, data) => {
  const isFormData = data instanceof FormData

  try {
    const res = await fetch(API_DOMAIN + path, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    })

    const json = await res.json()

    if (!res.ok) {
      const error = new Error(`API Error ${res.status}`)
      error.status = res.status
      error.response = json
      throw error
    }

    return json
  } catch (error) {
    console.error('Fetch error:', error.message)
    throw error
  }
}

export const patch = async (path, data = {}) => {
  const isFormData = data instanceof FormData
  try {
    const res = await fetch(API_DOMAIN + path, {
      method: 'PATCH',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    })

    let responseData
    let errorText

    if (!res.ok) {
      try {
        responseData = await res.json()
        errorText = responseData.error || responseData.message || JSON.stringify(responseData)
      } catch {
        errorText = await res.text()
        responseData = { error: errorText }
      }
      const error = new Error(`API Error ${res.status}: ${errorText}`)
      error.response = responseData
      error.status = res.status
      throw error
    }

    return await res.json()
  } catch (error) {
    console.error('Fetch error:', error.message)
    throw error
  }
}
