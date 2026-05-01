import { get, patch } from '@/utils/request'

export const getComingSoonContent = key => {
  return get(`admin/coming-soon/${key}`)
}

export const updateComingSoonContent = (key, data) => {
  return patch(`admin/coming-soon/${key}`, data)
}
