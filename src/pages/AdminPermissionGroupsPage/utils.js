import slugify from 'slugify'

export const adminPermissionGroupInitialValues = {
  label: '',
  value: '',
  description: '',
  translations: {
    en: {
      label: '',
      description: ''
    }
  },
  isActive: true
}

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedPermissionGroupField = (group, field, language, fallback = '') => {
  if (!group) return fallback

  const baseValue = group[field]
  const translatedValue = isEnglishLanguage(language) ? group.translations?.en?.[field] : null
  const localizedValue = isEnglishLanguage(language)
    ? field === 'label'
      ? group.localizedLabel
      : group.localizedDescription
    : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(localizedValue)) return localizedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedPermissionGroupLabel = (group, language, fallback = '') =>
  getLocalizedPermissionGroupField(group, 'label', language, fallback)

export const getLocalizedPermissionGroupDescription = (group, language, fallback = '') =>
  getLocalizedPermissionGroupField(group, 'description', language, fallback)

export function getPermissionGroupSlug(label = '') {
  return slugify(label, {
    lower: true,
    strict: true,
    replacement: '_'
  })
}

export function getPermissionGroupErrorMessage(error, fallbackMessage) {
  if (error?.status === 400 && error?.response?.message) {
    return error.response.message
  }

  return fallbackMessage
}
