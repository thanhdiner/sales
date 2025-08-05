import React, { useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Modal, message, Spin, Alert, Card, Divider, Typography, Badge } from 'antd'
import {
  EditOutlined,
  UserOutlined,
  MailOutlined,
  SafetyOutlined,
  CameraOutlined,
  CloseCircleFilled,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile as reduxUpdateProfile } from '@/stores/user'
import EmailUpdateSection from '@/components/EmailUpdateSection'
import dayjs from 'dayjs'
import { clientUpdateProfile, requestEmailUpdate, confirmEmailUpdate, getClientMe } from '@/services/userService'
import titles from '@/utils/titles'

const { Title, Text } = Typography

function ProfilePage() {
  titles('Thông tin tài khoản')

  const dispatch = useDispatch()
  const user = useSelector(state => state.clientUser.user)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailStep, setEmailStep] = useState(0)
  const [verifyCode, setVerifyCode] = useState('')
  const [updatingEmail, setUpdatingEmail] = useState(false)
  const [emailWarning, setEmailWarning] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    setAvatarPreview(user?.avatarUrl || '')
    if (user?.email?.endsWith('@github.com') || user?.email?.endsWith('@facebook.com') || user?.email === '') {
      setEmailWarning(
        'Email của bạn là email tạm thời (chưa xác thực). Vui lòng cập nhật email thật để đảm bảo bạn có thể lấy lại mật khẩu và nhận thông báo.'
      )
    } else {
      setEmailWarning('')
    }
  }, [user])

  const handleFileChange = async e => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return message.error('Chỉ chấp nhận ảnh!')
    if (file.size > 2 * 1024 * 1024) return message.error('Ảnh phải nhỏ hơn 2MB!')

    if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSave = async values => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('phone', values.phone)
      if (avatarFile) {
        formData.append('avatarUrl', avatarFile)
        if (user.avatarUrl) formData.append('oldImage', user.avatarUrl)
      } else if (avatarPreview === '' && user.avatarUrl) {
        formData.append('avatarUrl', '')
        formData.append('oldImage', user.avatarUrl)
        formData.append('deleteImage', 'true')
      }

      const res = await clientUpdateProfile(formData)
      dispatch(reduxUpdateProfile(res.data))
      setAvatarPreview(res.data.avatarUrl || '')
      setAvatarFile(null)

      message.success('Cập nhật thành công!')
    } catch (err) {
      message.error(err?.response?.data?.message || 'Cập nhật thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeEmail = () => {
    setShowEmailModal(true)
    setEmailStep(0)
    setNewEmail('')
    setVerifyCode('')
  }

  const handleSendCode = async () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      message.error('Vui lòng nhập email hợp lệ!')
      return
    }
    setUpdatingEmail(true)
    try {
      const res = await requestEmailUpdate(newEmail)
      message.success(res.message || 'Mã xác thực đã gửi tới email mới!')
      setEmailStep(1)
    } catch (err) {
      message.error(err?.message || 'Gửi mã xác thực thất bại!')
    } finally {
      setUpdatingEmail(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verifyCode) return message.error('Nhập mã xác thực!')
    setUpdatingEmail(true)
    try {
      const res = await confirmEmailUpdate(newEmail, verifyCode)
      setShowEmailModal(false)
      dispatch(reduxUpdateProfile({ ...user, email: newEmail }))
      message.success(res.message || 'Cập nhật email thành công!')
    } catch (err) {
      message.error(err?.message || 'Xác thực thất bại!')
    } finally {
      setUpdatingEmail(false)
    }
  }

  const getEmailStatus = () => {
    if (user?.email?.endsWith('@github.com') || user?.email?.endsWith('@facebook.com')) {
      return { status: 'error', text: 'Email tạm thời' }
    }
    return { status: 'success', text: 'Email đã xác thực' }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'banned':
        return 'error'
      default:
        return 'processing'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Chờ chút đang tải thông tin...">
          <div>Nội dung chờ load</div>
        </Spin>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Thông tin tài khoản
          </Title>
          <Text type="secondary" className="text-base">
            Quản lý thông tin cá nhân và cài đặt bảo mật của bạn
          </Text>
        </div>

        {emailWarning && (
          <Alert
            type="warning"
            message="⚠️ Cảnh báo bảo mật"
            description={emailWarning}
            showIcon
            className="mb-6 rounded-lg shadow-sm border-l-4 border-l-orange-400"
            action={
              <Button size="small" type="primary" danger onClick={handleChangeEmail}>
                Cập nhật ngay
              </Button>
            }
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-lg rounded-2xl border-0 overflow-hidden" styles={{ body: { padding: '32px 24px' } }}>
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                      onClick={() => inputRef.current.click()}
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl text-white cursor-pointer hover:shadow-xl transition-all duration-300 shadow-lg"
                      onClick={() => inputRef.current.click()}
                    >
                      {user.fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() ||
                        user.username?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </div>
                  )}

                  <div
                    className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => inputRef.current.click()}
                  >
                    <CameraOutlined className="text-white text-2xl" />
                  </div>

                  {avatarPreview && (
                    <CloseCircleFilled
                      className="absolute -top-2 -right-2 text-red-500 text-2xl bg-white rounded-full cursor-pointer hover:text-red-600 transition-colors shadow-lg"
                      onClick={handleRemoveAvatar}
                      title="Xóa ảnh"
                    />
                  )}
                </div>
                <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="!hidden" />
              </div>

              <Title level={4} className="!mb-2">
                {user.fullName || user.username}
              </Title>
              <Text type="secondary" className="block mb-4">
                @{user.username}
              </Text>

              <Badge
                status={getStatusColor(user.status)}
                text={<span className="capitalize font-medium">{user.status === 'active' ? 'Hoạt động' : user.status}</span>}
                className="text-sm"
              />
              <Text className="block">
                Lần đăng nhập cuối: {user.lastLogin ? dayjs(user.lastLogin).format('HH:mm DD/MM/YYYY') : 'Chưa có'}
              </Text>
            </div>
          </Card>

          <Card className="lg:col-span-2 shadow-lg rounded-2xl border-0" styles={{ body: { padding: '32px' } }}>
            <Form form={form} layout="vertical" initialValues={user} onFinish={handleSave} size="large">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <UserOutlined className="text-blue-500" />
                      Họ và tên
                    </span>
                  }
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  className="mb-6"
                >
                  <Input
                    placeholder="Nhập họ và tên của bạn"
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <UserOutlined className="text-green-500" />
                      Username
                    </span>
                  }
                  className="mb-6"
                >
                  <Input
                    value={user.username}
                    disabled
                    className="rounded-lg bg-gray-50"
                    suffix={<CheckCircleOutlined className="text-green-500" />}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <SafetyOutlined className="text-orange-500" />
                      Số điện thoại
                    </span>
                  }
                  name="phone"
                  rules={[
                    { required: false },
                    {
                      pattern: /^0\d{9,10}$/,
                      message: 'Số điện thoại không hợp lệ!'
                    }
                  ]}
                  className="mb-6"
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    maxLength={11}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <MailOutlined className="text-purple-500" />
                    Email
                    {getEmailStatus().status === 'success' && <Badge status="success" text="Đã xác thực" />}
                    {getEmailStatus().status === 'error' && <Badge status="error" text="Chưa xác thực" />}
                  </span>
                }
                className="mb-6"
              >
                {user.email?.endsWith('@github.com') || user.email?.endsWith('@facebook.com') ? (
                  <EmailUpdateSection
                    user={user}
                    onEmailUpdated={async () => {
                      const res = await getClientMe()
                      dispatch(reduxUpdateProfile(res))
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Input
                      value={user.email}
                      disabled
                      className="flex-1 rounded-lg bg-gray-50"
                      prefix={<MailOutlined className="text-gray-400" />}
                      suffix={<CheckCircleOutlined className="text-green-500" />}
                    />
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={handleChangeEmail}
                      disabled={loading}
                      className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                    >
                      Đổi email
                    </Button>
                  </div>
                )}
              </Form.Item>

              <Divider className="my-8" />

              <div className="flex justify-end gap-4">
                <Button size="large" className="rounded-lg px-8" onClick={() => form.resetFields()}>
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg px-8"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        <Modal
          title={
            <div className="flex items-center gap-2 text-lg">
              <MailOutlined className="text-blue-500" />
              Cập nhật email mới
            </div>
          }
          open={showEmailModal}
          onCancel={() => setShowEmailModal(false)}
          footer={null}
          destroyOnClose
          className="rounded-2xl"
          width={500}
        >
          {emailStep === 0 && (
            <div className="py-4">
              <Form layout="vertical" onFinish={handleSendCode}>
                <Form.Item
                  label="Email mới"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email mới!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input
                    placeholder="Nhập email mới"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    disabled={updatingEmail}
                    size="large"
                    prefix={<MailOutlined className="text-gray-400" />}
                    className="rounded-lg"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updatingEmail}
                  block
                  size="large"
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg mt-4"
                >
                  Gửi mã xác thực
                </Button>
              </Form>
            </div>
          )}

          {emailStep === 1 && (
            <div className="py-4">
              <Alert
                message="Kiểm tra email của bạn"
                description={`Chúng tôi đã gửi mã xác thực 6 số tới ${newEmail}`}
                type="info"
                showIcon
                className="mb-4 rounded-lg"
              />
              <Form layout="vertical" onFinish={handleVerifyEmail}>
                <Form.Item
                  label="Mã xác thực (6 số)"
                  name="code"
                  rules={[
                    { required: true, message: 'Nhập mã xác thực!' },
                    { len: 6, message: 'Mã xác thực gồm 6 số!' }
                  ]}
                >
                  <Input
                    placeholder="Nhập mã xác thực"
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value)}
                    maxLength={6}
                    disabled={updatingEmail}
                    size="large"
                    prefix={<SafetyOutlined className="text-gray-400" />}
                    className="rounded-lg text-center text-xl tracking-widest"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updatingEmail}
                  block
                  size="large"
                  className="rounded-lg bg-gradient-to-r from-green-500 to-blue-600 border-0 hover:from-green-600 hover:to-blue-700 shadow-lg"
                >
                  Xác thực & cập nhật email
                </Button>
              </Form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default ProfilePage
