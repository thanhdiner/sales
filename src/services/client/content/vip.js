import { get } from '@/utils/clientRequest'

const normalizeLanguage = language => (
  String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
)

export const getVipContent = (language = 'vi') => {
  return get(`vip?lang=${normalizeLanguage(language)}`)
}