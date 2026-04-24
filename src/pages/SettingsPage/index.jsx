import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { message as antdMessage } from 'antd'
import { changePassword } from '@/services/userService'
import { useDispatch, useSelector } from 'react-redux'
import { setDarkMode } from '@/stores/darkModeSlice'
import SEO from '@/components/SEO'

export default function SettingsPage() {
  const hasPassword = useSelector(state => state.clientUser.user?.hasPassword)
  const darkMode = useSelector(state => state.darkMode.value)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const validatePassword = password => {
    const minLength = password.length >= 6
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    return { minLength, hasUpper, hasLower, hasNumber }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()

    const { currentPassword, newPassword, confirmPassword } = formData

    if (hasPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        antdMessage.error('Vui lòng điền đầy đủ thông tin!')
        return
      }
    } else if (!newPassword || !confirmPassword) {
      antdMessage.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (newPassword !== confirmPassword) {
      antdMessage.error('Mật khẩu xác nhận không khớp!')
      return
    }

    const validation = validatePassword(newPassword)
    if (!validation.minLength || !validation.hasUpper || !validation.hasLower || !validation.hasNumber) {
      antdMessage.error('Mật khẩu không đáp ứng yêu cầu bảo mật!')
      return
    }

    setLoading(true)

    try {
      if (hasPassword) {
        await changePassword({ currentPassword, newPassword })
      } else {
        await changePassword({ newPassword })
      }

      antdMessage.success('Đổi mật khẩu thành công!')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      antdMessage.error(err?.response?.message || err?.message || 'Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordValidation = validatePassword(formData.newPassword)

  const passwordRules = [
    { label: 'Ít nhất 6 ký tự', valid: passwordValidation.minLength },
    { label: 'Có chữ hoa', valid: passwordValidation.hasUpper },
    { label: 'Có chữ thường', valid: passwordValidation.hasLower },
    { label: 'Có số', valid: passwordValidation.hasNumber },
  ]

  const securityTips = [
    'Sử dụng mật khẩu mạnh với ít nhất 8 ký tự.',
    'Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.',
    'Không sử dụng thông tin cá nhân dễ đoán.',
    'Thay đổi mật khẩu định kỳ để đảm bảo an toàn.',
  ]

  const inputClassName =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400'

  return (
    <div className="min-h-screen bg-white px-4 py-12 dark:bg-gray-900 md:px-8">
      <SEO title="Cài đặt tài khoản" noIndex />

      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Cài đặt
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            Cài đặt tài khoản
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">
            Quản lý giao diện và bảo mật tài khoản của bạn.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Giao diện
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Chế độ hiện tại: {darkMode ? 'Tối' : 'Sáng'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(setDarkMode(!darkMode))}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                darkMode ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-300'
              }`}
              aria-label="Chuyển chế độ giao diện"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform dark:bg-gray-900 ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'}
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {hasPassword
                ? 'Cập nhật mật khẩu để bảo vệ tài khoản của bạn.'
                : 'Thiết lập mật khẩu cho tài khoản đăng nhập bằng mạng xã hội.'}
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {hasPassword && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mật khẩu hiện tại
                </label>

                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={e => handleInputChange('currentPassword', e.target.value)}
                    className={inputClassName}
                    placeholder="Nhập mật khẩu hiện tại"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    tabIndex={-1}
                    aria-label="Hiện hoặc ẩn mật khẩu hiện tại"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Mật khẩu mới
              </label>

              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={e => handleInputChange('newPassword', e.target.value)}
                  className={inputClassName}
                  placeholder="Nhập mật khẩu mới"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  tabIndex={-1}
                  aria-label="Hiện hoặc ẩn mật khẩu mới"
                >
                  {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {passwordRules.map(rule => (
                    <div
                      key={rule.label}
                      className={`rounded-lg border px-3 py-2 text-xs ${
                        rule.valid
                          ? 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                          : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                      }`}
                    >
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Xác nhận mật khẩu mới
              </label>

              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  className={inputClassName}
                  placeholder="Xác nhận mật khẩu mới"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  tabIndex={-1}
                  aria-label="Hiện hoặc ẩn mật khẩu xác nhận"
                >
                  {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Mật khẩu xác nhận không khớp.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                {loading ? 'Đang xử lý...' : hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Lưu ý bảo mật
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Một số mẹo giúp bạn tạo mật khẩu mạnh và an toàn hơn.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {securityTips.map((tip, index) => (
              <div
                key={tip}
                className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {index + 1}
                </span>

                <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}