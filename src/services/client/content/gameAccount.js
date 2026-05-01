import { get } from '@/utils/clientRequest'

const normalizeLanguage = language => (
  String(language || '').toLowerCase().startsWith('en') ? 'en' : 'vi'
)

export const getGameAccountContent = (language = 'vi') => {
  return get(`game-account?lang=${normalizeLanguage(language)}`)
}