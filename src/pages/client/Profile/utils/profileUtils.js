export const mapLocationOption = item => ({
  value: item.code,
  label: item.name
})

export function isTemporaryProfileEmail(email) {
  return email?.endsWith('@github.com') || email?.endsWith('@facebook.com') || email === ''
}

export function getAvatarFallback(user, fallback) {
  return (
    user?.fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() ||
    user?.username?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() ||
    fallback
  )
}

export function buildProfileFormData({ avatarFile, avatarPreview, user, values }) {
  const formData = new FormData()
  formData.append('fullName', values.fullName)
  formData.append('phone', values.phone || '')

  if (avatarFile) {
    formData.append('avatarUrl', avatarFile)
    if (user?.avatarUrl) formData.append('oldImage', user.avatarUrl)
  } else if (avatarPreview === '' && user?.avatarUrl) {
    formData.append('avatarUrl', '')
    formData.append('oldImage', user.avatarUrl)
    formData.append('deleteImage', 'true')
  }

  return formData
}
