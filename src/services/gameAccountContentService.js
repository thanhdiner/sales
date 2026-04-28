import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

const normalizeLanguage = language => (String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi')

export const getGameAccountContent = async (language = 'vi') => {
  return await get(`game-account?lang=${normalizeLanguage(language)}`)
}

export const getAdminGameAccountContent = async () => {
  return await adminGet('admin/game-account')
}

export const updateAdminGameAccountContent = async data => {
  return await adminPatch('admin/game-account', data)
}
