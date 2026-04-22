import React, { useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Modal, message, Spin, Card, Divider, Typography } from 'antd'
import { CameraOutlined, CloseCircleFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile as reduxUpdateProfile } from '@/stores/user'
import EmailUpdateSection from '@/components/EmailUpdateSection'
import dayjs from 'dayjs'
import { clientUpdateProfile, requestEmailUpdate, confirmEmailUpdate, getClientMe } from '@/services/userService'
import SEO from '@/components/SEO'

const { Title, Text } = Typography

function ProfilePage() {
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
        'Email của bạn là email tạm thời. Vui lòng cập nhật email thật để có thể lấy lại mật khẩu và nhận thông báo.'
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

  const handleSave = async values => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('phone', values.phone || '')

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

  const isTemporaryEmail =
    user?.email?.endsWith('@github.com') ||
    user?.email?.endsWith('@facebook.com') ||
    user?.email === ''

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <SEO title="Hồ sơ của tôi" noIndex />
        <Spin size="large" tip="Chờ chút đang tải thông tin..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
      <SEO title="Hồ sơ của tôi" noIndex />

      <div className="mx-auto max-w-6xl">
        <div className="mb-9 text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Hồ sơ
          </p>

          <Title
            level={2}
            className="!mb-2 !text-3xl !font-semibold !tracking-[-0.03em] !text-gray-900 dark:!text-white"
          >
            Thông tin tài khoản
          </Title>

          <Text className="block max-w-xl !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
            Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.
          </Text>
        </div>

        {emailWarning && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Cập nhật email
              </h3>
              <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {emailWarning}
              </p>
            </div>

            <Button
              onClick={handleChangeEmail}
              className="h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
            >
              Cập nhật ngay
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <Card
            className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-4"
            styles={{ body: { padding: '28px' } }}
          >
            <div className="text-center">
              <div className="relative mb-6 inline-block">
                <div className="relative mx-auto h-28 w-28">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-28 w-28 cursor-pointer rounded-full border border-gray-200 object-cover shadow-sm dark:border-gray-700"
                      onClick={() => inputRef.current.click()}
                    />
                  ) : (
                    <div
                      className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-3xl font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      onClick={() => inputRef.current.click()}
                    >
                      {user.fullName?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() ||
                        user.username?.trim()?.split(' ').pop()?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => inputRef.current.click()}
                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    aria-label="Đổi ảnh đại diện"
                  >
                    <CameraOutlined />
                  </button>

                  {avatarPreview && (
                    <CloseCircleFilled
                      className="absolute -right-1 -top-1 cursor-pointer rounded-full bg-white text-xl text-gray-400 transition-colors hover:text-gray-700 dark:bg-gray-800 dark:hover:text-gray-200"
                      onClick={handleRemoveAvatar}
                      title="Xóa ảnh"
                    />
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="!hidden"
                />
              </div>

              <Title
                level={4}
                className="!mb-1 !text-lg !font-semibold !text-gray-900 dark:!text-white"
              >
                {user.fullName || user.username}
              </Title>

              <Text className="block !text-sm !text-gray-500 dark:!text-gray-400">
                @{user.username}
              </Text>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
                  <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Trạng thái
                  </p>
                  <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
                    {user.status === 'active' ? 'Hoạt động' : user.status}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
                  <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Lần đăng nhập cuối
                  </p>
                  <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
                    {user.lastLogin ? dayjs(user.lastLogin).format('HH:mm DD/MM/YYYY') : 'Chưa có'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-8"
            styles={{ body: { padding: '28px' } }}
          >
            <Form form={form} layout="vertical" initialValues={user} onFinish={handleSave} size="large">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Form.Item
                  label={<span className="font-medium text-gray-700 dark:text-gray-300">Họ và tên</span>}
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  className="mb-0"
                >
                  <Input
                    placeholder="Nhập họ và tên của bạn"
                    className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="font-medium text-gray-700 dark:text-gray-300">Username</span>}
                  className="mb-0"
                >
                  <Input
                    value={user.username}
                    disabled
                    className="rounded-lg border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="font-medium text-gray-700 dark:text-gray-300">Số điện thoại</span>}
                  name="phone"
                  rules={[
                    { required: false },
                    {
                      pattern: /^0\d{9,10}$/,
                      message: 'Số điện thoại không hợp lệ!',
                    },
                  ]}
                  className="mb-0"
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    maxLength={11}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Email{' '}
                    <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                      {isTemporaryEmail ? 'Chưa xác thực' : 'Đã xác thực'}
                    </span>
                  </span>
                }
                className="mt-5 mb-0"
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
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={user.email}
                      disabled
                      className="flex-1 rounded-lg border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                    />

                    <Button
                      onClick={handleChangeEmail}
                      disabled={loading}
                      className="h-auto rounded-lg border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                      Đổi email
                    </Button>
                  </div>
                )}
              </Form.Item>

              <Divider className="my-7" />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  size="large"
                  className="h-auto rounded-lg border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  onClick={() => form.resetFields()}
                >
                  Hủy bỏ
                </Button>

                <Button
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="h-auto rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        <Modal
          title="Cập nhật email mới"
          open={showEmailModal}
          onCancel={() => setShowEmailModal(false)}
          footer={null}
          destroyOnClose
          width={500}
        >
          {emailStep === 0 && (
            <div className="py-4">
              <Form layout="vertical" onFinish={handleSendCode}>
                <Form.Item
                  label={<span className="font-medium text-gray-700 dark:text-gray-300">Email mới</span>}
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email mới!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input
                    placeholder="Nhập email mới"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    disabled={updatingEmail}
                    size="large"
                    className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                </Form.Item>

                <Button
                  htmlType="submit"
                  loading={updatingEmail}
                  block
                  size="large"
                  className="mt-3 h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
                >
                  Gửi mã xác thực
                </Button>
              </Form>
            </div>
          )}

          {emailStep === 1 && (
            <div className="py-4">
              <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Kiểm tra email của bạn
                </h3>

                <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Chúng tôi đã gửi mã xác thực 6 số tới {newEmail}.
                </p>
              </div>

              <Form layout="vertical" onFinish={handleVerifyEmail}>
                <Form.Item
                  label={<span className="font-medium text-gray-700 dark:text-gray-300">Mã xác thực</span>}
                  name="code"
                  rules={[
                    { required: true, message: 'Nhập mã xác thực!' },
                    { len: 6, message: 'Mã xác thực gồm 6 số!' },
                  ]}
                >
                  <Input
                    placeholder="Nhập mã xác thực"
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value)}
                    maxLength={6}
                    disabled={updatingEmail}
                    size="large"
                    className="rounded-lg border-gray-200 text-center text-xl tracking-widest dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                </Form.Item>

                <Button
                  htmlType="submit"
                  loading={updatingEmail}
                  block
                  size="large"
                  className="h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
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