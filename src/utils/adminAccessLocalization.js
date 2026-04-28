const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const getLocalizedField = (item, field, language, fallback = '') => {
  if (!item) return fallback

  const baseValue = item[field]
  const translatedValue = isEnglishLanguage(language) ? item.translations?.en?.[field] : null
  const localizedValue = isEnglishLanguage(language)
    ? item[`localized${field.charAt(0).toUpperCase()}${field.slice(1)}`]
    : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(localizedValue)) return localizedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedRoleLabel = (role, language, fallback = '') =>
  getLocalizedField(role, 'label', language, fallback)

export const getLocalizedRoleDescription = (role, language, fallback = '') =>
  getLocalizedField(role, 'description', language, fallback)

export const getLocalizedPermissionTitle = (permission, language, fallback = '') =>
  getLocalizedField(permission, 'title', language, fallback)

export const getLocalizedPermissionDescription = (permission, language, fallback = '') =>
  getLocalizedField(permission, 'description', language, fallback)

export const getLocalizedPermissionGroupLabel = (group, language, fallback = '') =>
  getLocalizedField(group, 'label', language, fallback)

export const getLocalizedPermissionGroupDescription = (group, language, fallback = '') =>
  getLocalizedField(group, 'description', language, fallback)

export const getRoleFormValues = (role = {}) => ({
  ...role,
  translations: {
    en: {
      label: role?.translations?.en?.label || '',
      description: role?.translations?.en?.description || ''
    }
  }
})

export const normalizeRoleFormValues = (values = {}) => ({
  ...values,
  label: typeof values.label === 'string' ? values.label.trim() : '',
  description: typeof values.description === 'string' ? values.description : '',
  translations: {
    en: {
      label: typeof values.translations?.en?.label === 'string' ? values.translations.en.label.trim() : '',
      description: typeof values.translations?.en?.description === 'string' ? values.translations.en.description : ''
    }
  }
})
