import dayjsLib from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjsLib.extend(relativeTime)
dayjsLib.locale('vi')

export const dayjs = dayjsLib

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}/${path}`, {
    credentials: 'include',
    ...options
  })

  return response.json()
}

export const revokePreviewUrl = (url) => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export const getMessagePreview = (message) => {
  if (message?.type === 'image' || message?.imageUrl) {
    return '[Ảnh]'
  }

  return message?.message || ''
}
