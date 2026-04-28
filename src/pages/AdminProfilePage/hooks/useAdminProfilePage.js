import { useEffect, useRef, useState } from 'react'
import { Form, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '@/stores/adminUser'
import { updateAdminAvatar, updateAdminProfile } from '@/services/adminAccountsService'

const getInitialLetterAvatar = name => name?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'
const getLocale = language => (language?.startsWith('en') ? 'en-US' : 'vi-VN')

function getTranslatedValue(t, key, fallback = '') {
  const value = t(key)
  return value === key ? fallback : value
}

export default function useAdminProfilePage({ language = 'vi', t = key => key } = {}) {
  const profile = useSelector(state => state.adminUser.user)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!profile) return

    form.setFieldsValue({
      fullName: profile.fullName || '',
      email: profile.email || '',
      username: profile.username || ''
    })
  }, [form, profile])

  useEffect(() => {
    setAvatarFile(null)
    setAvatarPreview(profile?.avatarUrl || '')
  }, [profile?.avatarUrl])

  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarFile, avatarPreview])

  const handleFileChange = async event => {
    const file = event.target.files?.[0]
    if (!file || !profile?._id) return

    if (!file.type.startsWith('image/')) {
      message.error(t('message.imageOnly'))
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      message.error(t('message.imageMaxSize'))
      return
    }

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    const previewUrl = URL.createObjectURL(file)
    setAvatarFile(file)
    setAvatarPreview(previewUrl)

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('avatarUrl', file)
      if (profile.avatarUrl) {
        formData.append('oldImage', profile.avatarUrl)
      }

      const response = await updateAdminAvatar(profile._id, formData)
      dispatch(updateProfile(response.data))
      setAvatarPreview(response.data.avatarUrl || '')
      setAvatarFile(null)
      message.success(t('message.avatarUpdated'))
    } catch (error) {
      message.error(error?.response?.message || t('message.avatarUpdateFailed'))
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    if (!profile?._id) return

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(null)
    setAvatarPreview('')

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('avatarUrl', '')
      if (profile.avatarUrl) {
        formData.append('oldImage', profile.avatarUrl)
      }

      const response = await updateAdminAvatar(profile._id, formData)
      dispatch(updateProfile(response.data))
      message.success(t('message.avatarRemoved'))
    } catch (error) {
      message.error(error?.response?.message || t('message.avatarRemoveFailed'))
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleSave = async values => {
    if (!profile?._id) return

    setLoading(true)

    try {
      const response = await updateAdminProfile(profile._id, { fullName: values.fullName })
      dispatch(updateProfile(response.data))
      message.success(t('message.updateSuccess'))
    } catch (error) {
      message.error(error?.response?.data?.message || t('message.updateFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue({ fullName: profile?.fullName || '' })
  }

  return {
    profile,
    form,
    loading,
    inputRef,
    avatarPreview,
    roleLabel: profile?.role_id?.label || '',
    statusLabel: profile?.status ? getTranslatedValue(t, `status.${profile.status}`, profile.status) : '',
    lastLoginLabel: profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString(getLocale(language)) : t('fields.noLastLogin'),
    initialLetterAvatar: getInitialLetterAvatar(profile?.fullName),
    handleFileChange,
    handleRemoveAvatar,
    handleReset,
    handleSave
  }
}
