export const SUPPORTED_LANGUAGES = ['vi', 'en']
export const DEFAULT_LANGUAGE = 'vi'
export const LANGUAGE_STORAGE_KEY = 'language'

export function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE
}

export function applyDocumentLanguage(language) {
  if (typeof document === 'undefined') return

  const normalizedLanguage = normalizeLanguage(language)

  document.documentElement.lang = normalizedLanguage
  document.documentElement.setAttribute('data-language', normalizedLanguage)
}