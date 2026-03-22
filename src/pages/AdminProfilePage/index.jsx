import { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Row, Col, message, Spin } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from '../../stores/adminUser'
import { updateAdminAvatar, updateAdminProfile } from '../../services/adminAccountsService'
import SEO from '@/components/SEO'

function AdminProfilePage() {const profile = useSelector(state => state.user.user)
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const inputRef = useRef()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [roleLabel, setRoleLabel] = useState(profile?.role_id?.label || '')

  const getInitialLetterAvatar = name => name?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() || 'U'

  useEffect(() => {
    if (profile?.avatarUrl) {
      setAvatarFile(null)
      setAvatarPreview(profile.avatarUrl)
    } else {
      setAvatarFile(null)
      setAvatarPreview('')
    }
  }, [profile])

  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarFile, avatarPreview])

  useEffect(() => {
    setRoleLabel(profile?.role_id?.label || '')
  }, [profile?.role_id?.label])

  const handleFileChange = async e => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ chấp nhận ảnh!')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      message.error('Ảnh phải nhỏ hơn 2MB!')
      return
    }

    if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)

    const previewURL = URL.createObjectURL(file)
    setAvatarFile(file)
    setAvatarPreview(previewURL)

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('avatarUrl', file)
      if (profile.avatarUrl) formData.append('oldImage', profile.avatarUrl)

      const res = await updateAdminAvatar(profile._id, formData)
      setAvatarPreview(res.data.avatarUrl)
      dispatch(updateProfile(res.data))
      message.success('Avatar updated!')
    } catch (err) {
      message.error(err?.response?.message || 'Upload thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(null)
    setAvatarPreview('')

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('avatarUrl', '')
      if (profile.avatarUrl) formData.append('oldImage', profile.avatarUrl)

      const res = await updateAdminAvatar(profile._id, formData)
      setAvatarPreview('')
      dispatch(updateProfile(res.data))
      message.success('Đã xoá ảnh đại diện!')
    } catch (err) {
      message.error(err?.response?.message || 'Xoá avatar thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async values => {
    setLoading(true)
    try {
      const res = await updateAdminProfile(profile._id, { fullName: values.fullName })
      console.log('API update profile trả về:', res.data)

      dispatch(updateProfile(res.data))
      message.success('Updated successfully!')
    } catch (err) {
      message.error(err?.response?.data?.message || 'Update thất bại!')
    } finally {
      setLoading(false)
    }
  }

  if (!profile)
    return (
      <Spin tip="Loading profile...">
        <div className="min-h-[200px]" />
      </Spin>
    )

  return (
    <div className="max-w-[1200px] mx-auto bg-white dark:bg-gray-800 rounded-lg p-8 shadow-[0_2px_16px_rgba(0,_0,_0,_0.01)]">
      <SEO title="Admin – Hồ sơ" noIndex />
            <h2 className="mb-5 font-bold text-[26px] dark:text-gray-200">Basic Information</h2>
      <Form form={form} layout="vertical" initialValues={profile} onFinish={handleSave}>
        <Form.Item label={<span className="dark:text-gray-300">Avatar</span>}>
          <div className="flex items-center gap-10 min-h-[110px]">
            <div className="relative w-[110px] h-[110px]">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-[110px] h-[110px] object-cover rounded-[12px] border-[2.4px] border-solid border-[#eee] bg-[#fafbfc] shadow-[0_1px_8px_rgba(0,0,0,0.01)] cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                />
              ) : (
                <div
                  className="w-[110px] h-[110px] rounded-[12px] bg-[#f5f5f5] flex items-center justify-center text-[40px] font-semibold text-[#999] cursor-pointer border border-[#eee] shadow-[0_1px_8px_#0001] border-solid"
                  onClick={() => inputRef.current?.click()}
                >
                  {getInitialLetterAvatar(profile?.fullName)}
                </div>
              )}

              {avatarPreview && (
                <CloseCircleFilled
                  className="absolute top-[7px] right-[7px] text-[#f5222d] text-[22px] bg-white rounded-full shadow-[0_1px_4px_#0002] cursor-pointer"
                  onClick={handleRemove}
                  title="Xóa ảnh"
                />
              )}

              <input ref={inputRef} type="file" accept="image/*" className="!hidden" onChange={handleFileChange} />
            </div>
          </div>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span className="dark:text-gray-300">Full name</span>}
              name="fullName"
              rules={[{ required: true, message: 'Nhập họ tên!' }]}
            >
              <Input
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span className="dark:text-gray-300">Email</span>} name="email">
              <Input className="dark:text-gray-500 dark:border-gray-600" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span className="dark:text-gray-300">Username</span>} name="username">
              <Input className="dark:text-gray-500 dark:border-gray-600" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span className="dark:text-gray-300">Role</span>}>
              <Input className="dark:text-gray-500 dark:border-gray-600" value={roleLabel} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span className="dark:text-gray-300">Status</span>} name="status">
              <Input className="dark:text-gray-500 dark:border-gray-600" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span className="dark:text-gray-300">Last login</span>}>
              <Input
                className="dark:text-gray-500 dark:border-gray-600"
                value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('vi-VN') : ''}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="text-right mt-6">
          <Button className="mr-2" htmlType="button" onClick={() => form.setFieldsValue({ fullName: profile.fullName })} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdminProfilePage
