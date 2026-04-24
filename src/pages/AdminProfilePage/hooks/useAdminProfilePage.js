import { useEffect, useRef, useState } from 'react'
import { Form, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '@/stores/adminUser'
import { updateAdminAvatar, updateAdminProfile } from '@/services/adminAccountsService'

const getInitialLetterAvatar = name => name?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'

export default function useAdminProfilePage() {
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
      username: profile.username || '',
      status: profile.status || ''
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
      message.error('Only image files are allowed!')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      message.error('Image must be smaller than 2MB!')
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
      message.success('Avatar updated!')
    } catch (error) {
      message.error(error?.response?.message || 'Upload failed!')
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
      message.success('Avatar removed!')
    } catch (error) {
      message.error(error?.response?.message || 'Remove avatar failed!')
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
      message.success('Updated successfully!')
    } catch (error) {
      message.error(error?.response?.data?.message || 'Update failed!')
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
    lastLoginLabel: profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString('vi-VN') : '',
    initialLetterAvatar: getInitialLetterAvatar(profile?.fullName),
    handleFileChange,
    handleRemoveAvatar,
    handleReset,
    handleSave
  }
}
