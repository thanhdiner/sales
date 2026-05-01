import { API_URL } from '@/utils/env'

const API_BASE = API_URL

const parseJson = async res => {
  const data = await res.json()

  if (data?.success && res.ok) {
    return data
  }

  throw new Error(data?.error || data?.message || 'Chat request failed')
}

const normalizeImageUrls = data => {
  if (Array.isArray(data?.data?.imageUrls) && data.data.imageUrls.length > 0) {
    return data.data.imageUrls
  }

  if (data?.data?.imageUrl) {
    return [data.data.imageUrl]
  }

  return []
}

export const getHistory = async sessionId => {
  const res = await fetch(`${API_BASE}/chat/history/${sessionId}?internal=false`, {
    credentials: 'include'
  })

  const data = await parseJson(res)
  return data.data
}

export const getConversation = async sessionId => {
  const res = await fetch(`${API_BASE}/chat/conversation/${sessionId}`, {
    credentials: 'include'
  })

  const data = await parseJson(res)
  return data.data
}

export const resolveConversation = async sessionId => {
  const res = await fetch(`${API_BASE}/chat/resolve/${sessionId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })

  const data = await parseJson(res)
  return data.data
}

export const uploadImages = async files => {
  const imageFiles = Array.isArray(files) ? files.filter(Boolean) : []

  if (imageFiles.length === 0) {
    throw new Error('Không có ảnh để tải lên')
  }

  const formData = new FormData()
  imageFiles.slice(0, 10).forEach(file => formData.append('images', file))

  const res = await fetch(`${API_BASE}/chat/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  })

  const data = await parseJson(res)
  const imageUrls = normalizeImageUrls(data)

  if (imageUrls.length === 0) {
    throw new Error('Không thể lấy URL ảnh chat')
  }

  return imageUrls
}

export const uploadImage = async file => {
  const [imageUrl] = await uploadImages([file])
  return imageUrl
}

export const chatService = {
  getHistory,
  getConversation,
  resolveConversation,
  uploadImages,
  uploadImage
}
