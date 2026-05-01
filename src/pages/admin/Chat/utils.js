import dayjsLib from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { API_URL } from '@/utils/env'
import { getChatMessagePreview } from '@/utils/chatMessage'

dayjsLib.extend(relativeTime)
dayjsLib.locale('vi')

export const dayjs = dayjsLib

const API_BASE = API_URL

const getCurrentLanguage = () => {
  try {
    return localStorage.getItem('language') === 'en' ? 'en' : 'vi'
  } catch {
    return 'vi'
  }
}

export const apiFetch = async (path, options = {}) => {
  const headers = {
    'Accept-Language': getCurrentLanguage(),
    ...(options.headers || {})
  }

  const response = await fetch(`${API_BASE}/${path}`, {
    credentials: 'include',
    ...options,
    headers
  })

  return response.json()
}

export const revokePreviewUrl = url => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export const getMessagePreview = (message, options = {}) => {
  return getChatMessagePreview(message, {
    emptyText: options.emptyText || '',
    imageText: options.imageText || '[Image]',
    language: options.language,
    systemText: options.systemText,
    t: options.t
  })
}
