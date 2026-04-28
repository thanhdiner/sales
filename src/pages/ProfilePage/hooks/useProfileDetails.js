import { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import { updateProfile as reduxUpdateProfile } from '@/stores/user'
import { clientUpdateProfile } from '@/services/userService'
import { MAX_AVATAR_SIZE } from '../constants'
import { buildProfileFormData, isTemporaryProfileEmail } from '../utils/profilePageUtils'

export function useProfileDetails({ dispatch, form, t, user }) {
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '')
  const [emailWarning, setEmailWarning] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    form.setFieldsValue({
      fullName: user?.fullName || '',
      phone: user?.phone || ''
    })
    setAvatarPreview(user?.avatarUrl || '')

    if (isTemporaryProfileEmail(user?.email)) {
      setEmailWarning(t('emailWarning'))
    } else {
      setEmailWarning('')
    }
  }, [form, t, user])

  const handleFileChange = async event => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return message.error(t('message.imageOnly'))
    if (file.size > MAX_AVATAR_SIZE) return message.error(t('message.imageMaxSize'))

    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))

    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview('')

    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSaveProfile = async values => {
    setLoading(true)

    try {
      const formData = buildProfileFormData({
        avatarFile,
        avatarPreview,
        user,
        values
      })
      const res = await clientUpdateProfile(formData)
      dispatch(reduxUpdateProfile(res.data))
      setAvatarPreview(res.data.avatarUrl || '')
      setAvatarFile(null)

      message.success(t('message.updateSuccess'))
    } catch (err) {
      message.error(err?.response?.data?.message || t('message.updateFailed'))
    } finally {
      setLoading(false)
    }
  }

  return {
    avatarPreview,
    emailWarning,
    handleFileChange,
    handleRemoveAvatar,
    handleSaveProfile,
    inputRef,
    loading
  }
}
