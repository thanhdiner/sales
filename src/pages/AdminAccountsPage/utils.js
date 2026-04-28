export const ADMIN_ACCOUNT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'banned', label: 'Banned' }
]

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const ADMIN_ACCOUNT_STATUS_LABEL_KEYS = {
  active: 'status.active',
  inactive: 'status.inactive',
  banned: 'status.banned'
}

export function getAdminAccountStatusOptions(t) {
  return ADMIN_ACCOUNT_STATUS_OPTIONS.map(option => ({
    ...option,
    label: t(ADMIN_ACCOUNT_STATUS_LABEL_KEYS[option.value] || option.label)
  }))
}

export const ADMIN_ACCOUNT_FORM_INITIAL_VALUES = {
  status: 'active',
  avatarUrl: [],
  translations: {
    en: {
      fullName: ''
    }
  }
}

export const getLocalizedAdminAccountFullName = (account, language, fallback = '') => {
  if (!account) return fallback

  const baseValue = account.fullName
  const translatedValue = isEnglishLanguage(language) ? account.translations?.en?.fullName : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedAdminRoleLabel = (role, language, fallback = '') => {
  if (!role) return fallback

  const baseValue = role.label || role.name
  const translatedValue = role.localizedLabel || (isEnglishLanguage(language) ? role.translations?.en?.label : null)

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getAdminAccountRoleId = account => (
  typeof account?.role_id === 'object' && account?.role_id?._id
    ? account.role_id._id
    : account?.role_id
)

export const getAdminAccountAvatarFileList = account => (
  account?.avatarUrl
    ? [
        {
          uid: account._id,
          name: account.avatarUrl.split('/').pop(),
          status: 'done',
          url: account.avatarUrl
        }
      ]
    : []
)

export const buildAdminAccountFormData = ({
  values,
  editing,
  oldAvatar,
  avatarToDelete,
  isRemoveAvatar
}) => {
  const formData = new FormData()
  const file = values.avatarUrl?.[0]?.originFileObj
  const previousAvatar = avatarToDelete || oldAvatar

  formData.append('username', values.username)
  formData.append('email', values.email)
  formData.append('fullName', values.fullName)
  if (values.translations != null) {
    formData.append('translations', JSON.stringify(values.translations))
  }
  formData.append('role_id', String(values.role_id))
  formData.append('status', values.status)

  if (!editing) {
    formData.append('password', values.password)
  }

  if (editing && values.newPassword) {
    formData.append('newPassword', values.newPassword)
  }

  if (file) {
    formData.append('avatarUrl', file)

    if (previousAvatar) {
      formData.append('oldImage', previousAvatar)
    }
  } else if (editing && isRemoveAvatar) {
    formData.append('oldImage', previousAvatar)
    formData.append('deleteImage', true)
    formData.append('avatarUrl', '')
  }

  return formData
}
