import { get } from '@/utils/clientRequest'
import { get as adminGet, patch as adminPatch } from '@/utils/request'

const normalizeLanguage = language => (String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi')

export const getVipContent = async (language = 'vi') => {
  return await get(`vip?lang=${normalizeLanguage(language)}`)
}

export const getAdminVipContent = async () => {
  return await adminGet('admin/vip')
}

export const updateAdminVipContent = async data => {
  return await adminPatch('admin/vip', data)
}
