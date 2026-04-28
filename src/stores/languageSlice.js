import { createSlice } from '@reduxjs/toolkit'
import i18n, { LANGUAGE_STORAGE_KEY } from '@/i18n'

function resolveInitialLanguage() {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (storedLanguage === 'vi' || storedLanguage === 'en') {
      return storedLanguage
    }
  } catch {
    // Ignore storage errors
  }

  return 'vi'
}

function applyDocumentLanguage(language) {
  if (typeof document === 'undefined') return

  document.documentElement.lang = language
  document.documentElement.setAttribute('data-language', language)
}

const initialLanguage = resolveInitialLanguage()
applyDocumentLanguage(initialLanguage)

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    value: initialLanguage
  },
  reducers: {
    setLanguage: (state, action) => {
      const language = action.payload === 'en' ? 'en' : 'vi'

      state.value = language
      i18n.changeLanguage(language)
      applyDocumentLanguage(language)

      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
      } catch {
        // Ignore persistence errors
      }
    }
  }
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer