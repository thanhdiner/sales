import slugify from 'slugify'

export const adminPermissionGroupInitialValues = {
  label: '',
  value: '',
  description: '',
  isActive: true
}

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
