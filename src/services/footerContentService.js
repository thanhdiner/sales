import { get as adminGet, patch } from '@/utils/request'
import { get as clientGet } from '@/utils/clientRequest'

export const getFooterContent = async (language = 'vi') => {
  const normalizedLanguage = String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
  return await clientGet(`footer?lang=${normalizedLanguage}`)
}

export const getAdminFooterContent = async () => {
  return await adminGet('admin/footer')
}

export const updateAdminFooterContent = async data => {
  return await patch('admin/footer', data)
}
