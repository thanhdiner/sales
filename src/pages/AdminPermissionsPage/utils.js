import slugify from 'slugify'

export const adminPermissionInitialValues = {
  name: '',
  title: '',
  description: '',
  group: ''
}

export function getPermissionSlug(title = '') {
  return slugify(title, {
    lower: true,
    strict: true,
    replacement: '_'
  })
}

export function getPermissionErrorMessage(error, fallbackMessage) {
  if (
    error?.response?.message === 'Created unsuccessful' ||
    error?.response?.message === 'Updated unsuccessful'
  ) {
    return error.response.message
  }

  if (error?.status === 400 && error?.response?.message) {
    return error.response.message
  }

  return fallbackMessage
}

export function getPermissionGroupLabel(permissionGroups, groupValue) {
  return permissionGroups.find(group => group.value === groupValue)?.label || groupValue || 'Chưa có nhóm'
}
