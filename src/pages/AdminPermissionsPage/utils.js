import slugify from 'slugify'

export const adminPermissionInitialValues = {
  name: '',
  title: '',
  description: '',
  group: '',
  translations: {
    en: {
      title: '',
      description: ''
    }
  }
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

export function getPermissionGroupLabel(permissionGroups, groupValue, fallbackLabel = 'No group') {
  return permissionGroups.find(group => group.value === groupValue)?.label || groupValue || fallbackLabel
}

export function getPermissionFormValues(permission = {}) {
  return {
    ...permission,
    translations: {
      en: {
        title: permission?.translations?.en?.title || '',
        description: permission?.translations?.en?.description || ''
      }
    }
  }
}

export function normalizePermissionFormValues(values = {}) {
  return {
    ...values,
    title: typeof values.title === 'string' ? values.title.trim() : '',
    description: typeof values.description === 'string' ? values.description : '',
    translations: {
      en: {
        title: typeof values.translations?.en?.title === 'string' ? values.translations.en.title.trim() : '',
        description: typeof values.translations?.en?.description === 'string' ? values.translations.en.description : ''
      }
    }
  }
}
