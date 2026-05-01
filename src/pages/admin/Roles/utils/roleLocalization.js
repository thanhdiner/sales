const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getLocalizedRoleLabel = (role, language, fallback = '') => {
  if (!role) return fallback

  const translatedLabel = isEnglishLanguage(language) ? role.translations?.en?.label : null

  if (hasText(translatedLabel)) return translatedLabel
  if (hasText(role.localizedLabel)) return role.localizedLabel
  if (hasText(role.label)) return role.label

  return fallback
}

export const getLocalizedRoleDescription = (role, language, fallback = '') => {
  if (!role) return fallback

  const translatedDescription = isEnglishLanguage(language) ? role.translations?.en?.description : null

  if (hasText(translatedDescription)) return translatedDescription
  if (hasText(role.localizedDescription)) return role.localizedDescription
  if (hasText(role.description)) return role.description

  return fallback
}

export const getLocalizedPermissionTitle = (permission, language, fallback = '') => {
  if (!permission) return fallback

  const translatedTitle = isEnglishLanguage(language) ? permission.translations?.en?.title : null

  if (hasText(translatedTitle)) return translatedTitle
  if (hasText(permission.localizedTitle)) return permission.localizedTitle
  if (hasText(permission.title)) return permission.title

  return fallback
}

export const getLocalizedPermissionGroupLabel = (permissionGroup, language, fallback = '') => {
  if (!permissionGroup) return fallback

  const translatedLabel = isEnglishLanguage(language) ? permissionGroup.translations?.en?.label : null

  if (hasText(translatedLabel)) return translatedLabel
  if (hasText(permissionGroup.localizedLabel)) return permissionGroup.localizedLabel
  if (hasText(permissionGroup.label)) return permissionGroup.label
  if (hasText(permissionGroup.value)) return permissionGroup.value

  return fallback
}