const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedPermissionField = (permission, field, language, fallback = '') => {
  if (!permission) return fallback

  const baseValue = permission[field]
  const translatedValue = isEnglishLanguage(language) ? permission.translations?.en?.[field] : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedPermissionTitle = (permission, language, fallback = '') =>
  getLocalizedPermissionField(permission, 'title', language, fallback)

export const getLocalizedPermissionDescription = (permission, language, fallback = '') =>
  getLocalizedPermissionField(permission, 'description', language, fallback)

export const getLocalizedPermissionGroupLabel = (group, language, fallback = '') => {
  if (!group) return fallback

  const translatedLabel = isEnglishLanguage(language) ? group.translations?.en?.label : null
  const localizedLabel = isEnglishLanguage(language) ? group.localizedLabel : null

  if (hasText(translatedLabel)) return translatedLabel
  if (hasText(localizedLabel)) return localizedLabel
  if (hasText(group.label)) return group.label

  return group.value || fallback
}
