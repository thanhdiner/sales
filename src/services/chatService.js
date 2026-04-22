const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

const parseJson = async (res) => {
  const data = await res.json()
  if (data?.success && res.ok) return data

  throw new Error(data?.error || data?.message || 'Chat request failed')
}

const normalizeImageUrls = (data) => {
  if (Array.isArray(data?.data?.imageUrls) && data.data.imageUrls.length > 0) {
    return data.data.imageUrls
  }

  if (data?.data?.imageUrl) {
    return [data.data.imageUrl]
  }

  return []
}

export const chatService = {
  getHistory: async (sessionId) => {
    const res = await fetch(`${API_BASE}/chat/history/${sessionId}?internal=false`, { credentials: 'include' })
    const data = await parseJson(res)
    return data.data
  },
  getConversation: async (sessionId) => {
    const res = await fetch(`${API_BASE}/chat/conversation/${sessionId}`, { credentials: 'include' })
    const data = await parseJson(res)
    return data.data
  },
  uploadImages: async (files) => {
    const imageFiles = Array.isArray(files) ? files.filter(Boolean) : []
    if (imageFiles.length === 0) throw new Error('Không có ảnh để tải lên')

    const formData = new FormData()
    imageFiles.slice(0, 10).forEach(file => formData.append('images', file))

    const res = await fetch(`${API_BASE}/chat/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await parseJson(res)
    const imageUrls = normalizeImageUrls(data)
    if (imageUrls.length === 0) throw new Error('Không thể lấy URL ảnh chat')
    return imageUrls
  },
  uploadImage: async (file) => {
    const [imageUrl] = await chatService.uploadImages([file])
    return imageUrl
  }
}
