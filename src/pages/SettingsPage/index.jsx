import React, { useState } from 'react'
import { Lock, Settings, Moon, Sun, Eye, Shield } from 'lucide-react'
import { message as antdMessage } from 'antd'
import { changePassword } from '@/services/userService'
import { useDispatch, useSelector } from 'react-redux'
import { setDarkMode } from '@/stores/darkModeSlice'

export default function SettingsPage() {
  const hasPassword = useSelector(state => state.user.user?.hasPassword)
  const darkMode = useSelector(state => state.darkMode.value)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
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
    } else {
      if (!newPassword || !confirmPassword) {
        antdMessage.error('Vui lòng điền đầy đủ thông tin!')
        return
      }
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
      if (hasPassword) await changePassword({ currentPassword, newPassword })
      else await changePassword({ newPassword })

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

  return (
    <div
      className={`
        min-h-screen relative transition-colors duration-200
        ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}
      rounded-xl`}
    >
      {/* Pattern chấm mờ overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 -z-1">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${darkMode ? '#374151' : '#e5e7eb'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 ${
                darkMode ? 'bg-gradient-to-r from-blue-700 to-purple-600 shadow' : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow'
              }`}
            >
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cài đặt tài khoản</h1>
            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quản lý cài đặt và bảo mật tài khoản của bạn</p>
          </div>

          {/* Theme Toggle Card */}
          <div className={`rounded-xl p-6 mb-7 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Giao diện</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Chế độ {darkMode ? 'tối' : 'sáng'} - Bảo vệ mắt và tiết kiệm pin
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(setDarkMode(!darkMode))}
                className={`relative w-12 h-6 rounded-full focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    darkMode ? 'translate-x-6' : ''
                  }`}
                >
                  <div className="flex items-center justify-center h-full">
                    {darkMode ? <Moon className="w-3 h-3 text-blue-600" /> : <Sun className="w-3 h-3 text-yellow-500" />}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Password Change Card */}
          <div className={`rounded-xl p-6 mb-7 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'}
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {hasPassword ? 'Cập nhật mật khẩu để bảo vệ tài khoản của bạn' : 'Thiết lập mật khẩu cho tài khoản social login'}
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current Password (ẩn nếu chưa từng đặt pass) */}
              {hasPassword && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={e => handleInputChange('currentPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-10 rounded-lg border transition-colors focus:outline-none ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="Nhập mật khẩu hiện tại"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      tabIndex={-1}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={e => handleInputChange('newPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-10 rounded-lg border transition-colors focus:outline-none ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    placeholder="Nhập mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    tabIndex={-1}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center space-x-1 ${passwordValidation.minLength ? 'text-green-500' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>Ít nhất 6 ký tự</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordValidation.hasUpper ? 'text-green-500' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpper ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>Chữ hoa</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordValidation.hasLower ? 'text-green-500' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLower ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>Chữ thường</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordValidation.hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>Số</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-10 rounded-lg border transition-colors focus:outline-none ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    placeholder="Xác nhận mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    tabIndex={-1}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Mật khẩu xác nhận không khớp</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? <span>Đang xử lý...</span> : hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>

          {/* Security Tips Card */}
          <div className={`rounded-xl p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-5">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lưu ý bảo mật</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mẹo giúp bạn tạo mật khẩu mạnh và an toàn</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                '🔐 Sử dụng mật khẩu mạnh với ít nhất 8 ký tự',
                '🔤 Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt',
                '🚫 Không sử dụng thông tin cá nhân dễ đoán',
                '🔄 Thay đổi mật khẩu định kỳ để đảm bảo an toàn'
              ].map((tip, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
