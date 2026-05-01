import { get } from '@/utils/clientRequest'

const normalizeLanguage = language =>
  String(language || '')
    .toLowerCase()
    .startsWith('en')
    ? 'en'
    : 'vi'

export const getComingSoonContent = (key, language = 'vi') => {
  return get(`coming-soon/${key}?lang=${normalizeLanguage(language)}`)
}
