export const ADMIN_ACCOUNT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'banned', label: 'Banned' }
]

export const ADMIN_ACCOUNT_FORM_INITIAL_VALUES = {
  status: 'active',
  avatarUrl: []
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
