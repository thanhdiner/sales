import { get } from '@/utils/clientRequest'

const normalizeLanguage = language => (
  String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
)

export const getFooterContent = (language = 'vi') => {
  return get(`footer?lang=${normalizeLanguage(language)}`)
}