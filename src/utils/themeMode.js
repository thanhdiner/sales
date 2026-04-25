const THEME_MODE_STORAGE_KEY = 'themeMode'
const LEGACY_ADMIN_DARK_MODE_KEY = 'darkMode'
const LEGACY_CLIENT_DARK_MODE_KEY = 'darkModeClient'

function toThemeMode(value) {
  if (value === 'dark' || value === 'light') {
    return value
  }

  if (value === 'true') {
    return 'dark'
  }

  if (value === 'false') {
    return 'light'
  }

  return null
}

function readStoredThemeMode() {
  try {
    const preferredMode = toThemeMode(localStorage.getItem(THEME_MODE_STORAGE_KEY))
    if (preferredMode) {
      return preferredMode
    }

    const legacyAdminMode = toThemeMode(localStorage.getItem(LEGACY_ADMIN_DARK_MODE_KEY))
    if (legacyAdminMode) {
      return legacyAdminMode
    }

    return toThemeMode(localStorage.getItem(LEGACY_CLIENT_DARK_MODE_KEY))
  } catch {
    return null
  }
}

function prefersDarkColorScheme() {
  try {
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

export function resolveInitialDarkMode() {
  const storedMode = readStoredThemeMode()

  if (storedMode === 'dark') {
    return true
  }

  if (storedMode === 'light') {
    return false
  }

  return prefersDarkColorScheme()
}

export function persistDarkMode(isDarkMode) {
  try {
    const mode = isDarkMode ? 'dark' : 'light'
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
    localStorage.removeItem(LEGACY_ADMIN_DARK_MODE_KEY)
    localStorage.removeItem(LEGACY_CLIENT_DARK_MODE_KEY)
  } catch {
    // Ignore persistence errors (private mode / storage disabled)
  }
}

export function applyDocumentTheme(isDarkMode) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.classList.toggle('dark', isDarkMode)
  root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  root.style.colorScheme = isDarkMode ? 'dark' : 'light'
}
