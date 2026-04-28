import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

const normalizeLanguage = language => (String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi')

export const getComingSoonContent = async (key, language = 'vi') => {
  return await get(`coming-soon/${key}?lang=${normalizeLanguage(language)}`)
}

export const getAdminComingSoonContent = async key => {
  return await adminGet(`admin/coming-soon/${key}`)
}

export const updateAdminComingSoonContent = async (key, data) => {
  return await adminPatch(`admin/coming-soon/${key}`, data)
}
