import React, { useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Modal, message, Spin, Card, Divider, Typography, Select } from 'antd'
import { CameraOutlined, CloseCircleFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile as reduxUpdateProfile } from '@/stores/user'
import EmailUpdateSection from './components/EmailUpdateSection'
import dayjs from 'dayjs'
import {
  clientUpdateProfile,
  requestEmailUpdate,
  confirmEmailUpdate,
  getClientMe,
  updateClientCheckoutProfile
} from '@/services/userService'
import { buildCheckoutFormDefaults, normalizeCheckoutProfile } from '@/lib/checkoutProfile'
import useVietnamAddress from '@/hooks/useVietnamAddress'
import {
  getDistrictOptions,
  getProvinceOptions,
  getWardOptions,
  hasAnyStructuredVietnamAddressInput,
  hasCompleteStructuredVietnamAddress,
  inferVietnamAddressFromText,
  normalizeVietnamAddress
} from '@/lib/vietnamAddress'
import SEO from '@/components/SEO'

const { Title, Text } = Typography

const mapLocationOption = item => ({
  value: item.code,
  label: item.name
})

const CHECKOUT_DELIVERY_OPTIONS = [
  { value: 'pickup', label: 'Nhận tại website' },
  { value: 'contact', label: 'Liên hệ riêng' }
]

const CHECKOUT_PAYMENT_OPTIONS = [
  { value: 'transfer', label: 'Chuyển khoản' },
  { value: 'contact', label: 'Thỏa thuận khi liên hệ' },
  { value: 'vnpay', label: 'VNPay' },
  { value: 'momo', label: 'MoMo' },
  { value: 'zalopay', label: 'ZaloPay' }
]

function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.clientUser.user)

  const [form] = Form.useForm()
  const [checkoutForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailStep, setEmailStep] = useState(0)
  const [verifyCode, setVerifyCode] = useState('')
  const [updatingEmail, setUpdatingEmail] = useState(false)
  const [emailWarning, setEmailWarning] = useState('')
  const inputRef = useRef()
  const checkoutAddressAutofillAttemptedRef = useRef(false)
  const { tree: addressTree, loading: addressLoading, error: addressError } = useVietnamAddress()

  const checkoutProvinceCode = Form.useWatch('provinceCode', checkoutForm)
  const checkoutDistrictCode = Form.useWatch('districtCode', checkoutForm)
  const checkoutAddressLine1 = Form.useWatch('addressLine1', checkoutForm)
  const checkoutProvinceName = Form.useWatch('provinceName', checkoutForm)
  const checkoutDistrictName = Form.useWatch('districtName', checkoutForm)
  const checkoutWardName = Form.useWatch('wardName', checkoutForm)
  const checkoutLegacyAddress = Form.useWatch('address', checkoutForm)

  const provinceOptions = getProvinceOptions(addressTree).map(mapLocationOption)
  const districtOptions = getDistrictOptions(addressTree, checkoutProvinceCode).map(mapLocationOption)
  const wardOptions = getWardOptions(addressTree, checkoutProvinceCode, checkoutDistrictCode).map(mapLocationOption)
  const checkoutAddressPreview = normalizeVietnamAddress({
    addressLine1: checkoutAddressLine1,
    provinceCode: checkoutProvinceCode,
    provinceName: checkoutProvinceName,
    districtCode: checkoutDistrictCode,
    districtName: checkoutDistrictName,
    wardName: checkoutWardName,
    address: checkoutLegacyAddress
  }).address

  const syncCheckoutAddressFields = patch => {
    const nextValues = normalizeVietnamAddress({
      ...checkoutForm.getFieldsValue(true),
      ...patch
    })

    checkoutForm.setFieldsValue(nextValues)
  }

  useEffect(() => {
    form.setFieldsValue({
      fullName: user?.fullName || '',
      phone: user?.phone || ''
    })
    checkoutForm.setFieldsValue(buildCheckoutFormDefaults(user))
    checkoutAddressAutofillAttemptedRef.current = false
    setAvatarPreview(user?.avatarUrl || '')

    if (user?.email?.endsWith('@github.com') || user?.email?.endsWith('@facebook.com') || user?.email === '') {
      setEmailWarning(
        'Email của bạn là email tạm thời. Vui lòng cập nhật email thật để có thể lấy lại mật khẩu và nhận thông báo.'
      )
    } else {
      setEmailWarning('')
    }
  }, [checkoutForm, form, user])

  useEffect(() => {
    if (!addressTree.length || checkoutAddressAutofillAttemptedRef.current === true) return

    const currentValues = normalizeCheckoutProfile(checkoutForm.getFieldsValue(true))
    checkoutAddressAutofillAttemptedRef.current = true

    if (hasCompleteStructuredVietnamAddress(currentValues)) {
      return
    }

    const inferredAddress = inferVietnamAddressFromText(
      addressTree,
      currentValues.address || currentValues.addressLine1
    )

    if (!inferredAddress) {
      return
    }

    checkoutForm.setFieldsValue({
      ...currentValues,
      ...inferredAddress
    })
  }, [addressTree, checkoutForm])

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

  const handleSaveCheckoutProfile = async values => {
    const payload = normalizeCheckoutProfile(values)

    if (
      hasAnyStructuredVietnamAddressInput(payload) &&
      !hasCompleteStructuredVietnamAddress(payload)
    ) {
      message.error('Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã và nhập địa chỉ chi tiết!')
      return
    }

    setCheckoutLoading(true)

    try {
      const res = await updateClientCheckoutProfile(payload)
      dispatch(reduxUpdateProfile(res.data))
      checkoutForm.setFieldsValue(buildCheckoutFormDefaults(res.data))
      message.success(res.message || 'Đã lưu thông tin đặt hàng mặc định!')
    } catch (err) {
      message.error(err?.message || 'Lưu thông tin đặt hàng thất bại!')
    } finally {
      setCheckoutLoading(false)
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

        <Card
          className="mt-7 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          styles={{ body: { padding: '28px' } }}
        >
          <div className="mb-6">
            <Title
              level={4}
              className="!mb-2 !text-xl !font-semibold !text-gray-900 dark:!text-white"
            >
              Thông tin đặt hàng mặc định
            </Title>

            <Text className="block max-w-3xl !text-sm !leading-7 !text-gray-600 dark:!text-gray-300">
              Thông tin ở đây sẽ được tự động điền khi bạn vào trang thanh toán, giúp không phải nhập lại mỗi lần mua hàng.
            </Text>
          </div>

          <Form
            form={checkoutForm}
            layout="vertical"
            onFinish={handleSaveCheckoutProfile}
            size="large"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Form.Item
                label={<span className="font-medium text-gray-700 dark:text-gray-300">Họ mặc định</span>}
                name="firstName"
                className="mb-0"
              >
                <Input
                  placeholder="Nguyễn"
                  className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-gray-700 dark:text-gray-300">Tên mặc định</span>}
                name="lastName"
                className="mb-0"
              >
                <Input
                  placeholder="Văn A"
                  className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-gray-700 dark:text-gray-300">Số điện thoại mặc định</span>}
                name="phone"
                rules={[
                  {
                    pattern: /^$|^[0-9]{9,15}$/,
                    message: 'Số điện thoại không hợp lệ!'
                  }
                ]}
                className="mb-0"
              >
                <Input
                  placeholder="0123456789"
                  maxLength={15}
                  className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-gray-700 dark:text-gray-300">Email mặc định</span>}
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'Email không hợp lệ!'
                  }
                ]}
                className="mb-0"
              >
                <Input
                  placeholder="your@email.com"
                  className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-gray-700 dark:text-gray-300">Cách nhận hàng ưa thích</span>}
                name="deliveryMethod"
                className="mb-0"
              >
                <Select
                  options={CHECKOUT_DELIVERY_OPTIONS}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-gray-700 dark:text-gray-300">Thanh toán ưa thích</span>}
                name="paymentMethod"
                className="mb-0"
              >
                <Select
                  options={CHECKOUT_PAYMENT_OPTIONS}
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Địa chỉ nhận hàng mặc định
                </h3>
                <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Chọn theo từng cấp để giảm nhập sai địa chỉ. Nếu đơn của bạn không cần giao vật lý, bạn có thể để trống phần này.
                </p>
              </div>

              {addressError ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    Không tải được danh sách địa chỉ Việt Nam. Bạn có thể nhập tạm địa chỉ thủ công.
                  </div>

                  <Form.Item
                    label={<span className="font-medium text-gray-700 dark:text-gray-300">Địa chỉ / thông tin nhận hàng</span>}
                    name="address"
                    className="mb-0"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Ví dụ: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                      className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </Form.Item>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <Form.Item
                      label={<span className="font-medium text-gray-700 dark:text-gray-300">Tỉnh / Thành phố</span>}
                      name="provinceCode"
                      className="mb-0"
                    >
                      <Select
                        showSearch
                        allowClear
                        loading={addressLoading}
                        options={provinceOptions}
                        placeholder="Chọn Tỉnh / Thành phố"
                        optionFilterProp="label"
                        className="rounded-lg"
                        onChange={value => {
                          const nextProvince = provinceOptions.find(option => option.value === value)
                          syncCheckoutAddressFields({
                            provinceCode: value || '',
                            provinceName: nextProvince?.label || '',
                            districtCode: '',
                            districtName: '',
                            wardCode: '',
                            wardName: ''
                          })
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium text-gray-700 dark:text-gray-300">Quận / Huyện</span>}
                      name="districtCode"
                      className="mb-0"
                    >
                      <Select
                        showSearch
                        allowClear
                        loading={addressLoading}
                        disabled={!checkoutProvinceCode}
                        options={districtOptions}
                        placeholder={checkoutProvinceCode ? 'Chọn Quận / Huyện' : 'Chọn Tỉnh / Thành phố trước'}
                        optionFilterProp="label"
                        className="rounded-lg"
                        onChange={value => {
                          const nextDistrict = districtOptions.find(option => option.value === value)
                          syncCheckoutAddressFields({
                            districtCode: value || '',
                            districtName: nextDistrict?.label || '',
                            wardCode: '',
                            wardName: ''
                          })
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium text-gray-700 dark:text-gray-300">Phường / Xã</span>}
                      name="wardCode"
                      className="mb-0"
                    >
                      <Select
                        showSearch
                        allowClear
                        loading={addressLoading}
                        disabled={!checkoutDistrictCode}
                        options={wardOptions}
                        placeholder={checkoutDistrictCode ? 'Chọn Phường / Xã' : 'Chọn Quận / Huyện trước'}
                        optionFilterProp="label"
                        className="rounded-lg"
                        onChange={value => {
                          const nextWard = wardOptions.find(option => option.value === value)
                          syncCheckoutAddressFields({
                            wardCode: value || '',
                            wardName: nextWard?.label || ''
                          })
                        }}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={<span className="font-medium text-gray-700 dark:text-gray-300">Địa chỉ chi tiết</span>}
                    name="addressLine1"
                    className="mt-5 mb-0"
                  >
                    <Input
                      placeholder="Số nhà, tên đường, tòa nhà, hẻm..."
                      className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      onChange={e => syncCheckoutAddressFields({ addressLine1: e.target.value })}
                    />
                  </Form.Item>

                  {checkoutAddressPreview && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Địa chỉ đầy đủ:</span>{' '}
                      {checkoutAddressPreview}
                    </div>
                  )}
                </>
              )}
            </div>

            <Form.Item name="provinceName" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="districtName" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="wardName" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="address" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700 dark:text-gray-300">Ghi chú mặc định</span>}
              name="notes"
              className="mt-5 mb-0"
            >
              <Input.TextArea
                rows={3}
                placeholder="Các lưu ý mà bạn thường dùng khi đặt hàng"
                className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </Form.Item>

            <Divider className="my-7" />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                size="large"
                className="h-auto rounded-lg border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                onClick={() => checkoutForm.setFieldsValue(buildCheckoutFormDefaults(user))}
              >
                Khôi phục
              </Button>

              <Button
                htmlType="submit"
                loading={checkoutLoading}
                size="large"
                className="h-auto rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
              >
                {checkoutLoading ? 'Đang lưu...' : 'Lưu thông tin đặt hàng'}
              </Button>
            </div>
          </Form>
        </Card>

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
