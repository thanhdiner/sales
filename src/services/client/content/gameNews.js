import { get } from '@/utils/clientRequest'

const normalizeLanguage = language => (
  String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
)

export const getGameNewsContent = (language = 'vi') => {
  return get(`game-news?lang=${normalizeLanguage(language)}`)
}