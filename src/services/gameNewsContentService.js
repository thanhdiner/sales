import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

const normalizeLanguage = language => (String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi')

export const getGameNewsContent = async (language = 'vi') => {
  return await get(`game-news?lang=${normalizeLanguage(language)}`)
}

export const getAdminGameNewsContent = async () => {
  return await adminGet('admin/game-news')
}

export const updateAdminGameNewsContent = async data => {
  return await adminPatch('admin/game-news', data)
}
