import { useState } from 'react'
import { Form, Input, Button, Typography, message, Card, Modal } from 'antd'
import { authAdmin2FAVerify, authAdminLogin } from '@/services/adminAuth.service'
import { setAccessToken } from '@/utils/auth'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@/stores/adminUser'
import { trustDevice } from '@/services/adminAccountsService'
import SEO from '@/components/SEO'
import './AdminLoginPage.scss'

const { Title } = Typography

function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [pending2FA, setPending2FA] = useState(null)
  const [twoFACode, setTwoFACode] = useState('')
  const [loading2FA, setLoading2FA] = useState(false)
  const [useBackup, setUseBackup] = useState(false)
  const [showTrustDeviceModal, setShowTrustDeviceModal] = useState(false)
  const [latestToken, setLatestToken] = useState(null)
  const [latestUser, setLatestUser] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLoginSuccess = async (token, user) => {
    setAccessToken(token)
    dispatch(setUser({ user, token }))
    setLatestToken(token)
    setShowTrustDeviceModal(true)
  }

  const handleFinish = async values => {
    setLoading(true)
    setPending2FA(null)
    try {
      const deviceId = localStorage.getItem('trusted_device_id')
      const res = await authAdminLogin({ username: values.username, password: values.password, deviceId })

      if (res.require2FA) {
        setPending2FA(res.userId)
        message.info('Vui lòng nhập mã xác thực 2FA')
        return
      }

      if (res.accessToken && res.user) {
        setAccessToken(res.accessToken)
        dispatch(setUser({ user: res.user, token: res.accessToken }))
        message.success('Đăng nhập thành công')
        if (res.user.twoFAEnabled && !deviceId) {
          setLatestToken(res.accessToken)
          setLatestUser(res.user)
          setShowTrustDeviceModal(true)
        } else {
          navigate('/admin/dashboard')
        }
        return
      }
      message.error(res.error || res.message || 'Lỗi đăng nhập, thiếu dữ liệu!')
    } catch (error) {
      message.error('Sai tên đăng nhập hoặc mật khẩu!')
    } finally {
      setLoading(false)
    }
  }

  const handle2FAVerify = async () => {
    setLoading2FA(true)
    try {
      const res = await authAdmin2FAVerify({
        userId: pending2FA,
        code: twoFACode.trim(),
        type: useBackup ? 'backup' : 'totp'
      })
      if (res.accessToken && res.user) await handleLoginSuccess(res.accessToken, res.user)
      else message.error(res.error || res.message || 'Mã xác thực không đúng!')
    } catch (error) {
      message.error('Mã xác thực không đúng hoặc đã hết hạn!')
    } finally {
      setLoading2FA(false)
    }
  }

  const onTrustDevice = async trust => {
    setShowTrustDeviceModal(false)
    if (trust && latestToken) {
      let deviceId = localStorage.getItem('trusted_device_id')
      if (!deviceId) {
        deviceId = window.crypto?.randomUUID?.() || Math.random().toString(36).substring(2)
        localStorage.setItem('trusted_device_id', deviceId)
      }
      const platform = navigator.platform || ''
      const ua = navigator.userAgent || ''
      let name = platform
      if (/iphone/i.test(ua)) name = 'iPhone'
      else if (/ipad/i.test(ua)) name = 'iPad'
      else if (/android/i.test(ua)) name = 'Android'
      else if (/mac/i.test(ua)) name = 'Mac'
      else if (/win/i.test(ua)) name = 'Windows PC'

      const browser = ua
      const location = ''

      try {
        await trustDevice({ deviceId, name, browser, location })
        message.success('Thiết bị đã được thêm vào danh sách tin cậy!')
      } catch (err) {
        message.error('Không thể thêm thiết bị tin cậy!')
      }
    }
    dispatch(setUser({ user: latestUser, token: latestToken }))
    navigate('/admin/dashboard')
  }

  const is2FACodeValid = useBackup ? twoFACode.length >= 7 : /^\d{6}$/.test(twoFACode)

  return (
    <div className="admin-login-page flex min-h-screen items-center justify-center px-4 py-8">
      <SEO title="Admin – Đăng nhập" noIndex />
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 0
        }}
        styles={{ body: { padding: 0 } }}
        className="admin-login-card w-full"
      >
        <div className="admin-login-content p-8 sm:p-10">
          <Title level={3} className="admin-login-title">
            Admin Login
          </Title>
          {!pending2FA ? (
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ username: '', password: '' }}>
              <Form.Item
                name="username"
                label={<span className="admin-login-label">Username</span>}
                rules={[{ required: true, message: 'Nhập username!' }]}
              >
                <Input placeholder="Tài khoản" autoFocus autoComplete="username" className="admin-login-input" />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span className="admin-login-label">Password</span>}
                rules={[{ required: true, message: 'Nhập mật khẩu!' }]}
              >
                <Input.Password placeholder="Mật khẩu" autoComplete="current-password" className="admin-login-input" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginTop: 8 }}
                className="admin-login-btn h-11 text-[15px] font-semibold"
              >
                Đăng nhập
              </Button>
            </Form>
          ) : (
            <>
              <div className="admin-login-2fa-hint">
                {useBackup ? 'Nhập mã dự phòng đã lưu:' : 'Vui lòng nhập mã xác thực 2FA:'}
              </div>
              <Input
                placeholder={useBackup ? 'Nhập mã dự phòng (AB12-CD34)' : 'Nhập mã 2FA (6 số)'}
                maxLength={useBackup ? 12 : 6}
                value={twoFACode}
                onChange={e =>
                  setTwoFACode(
                    useBackup ? e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') : e.target.value.replace(/\D/g, '').slice(0, 6)
                  )
                }
                style={{
                  marginBottom: 12,
                  fontSize: 'clamp(1rem, 4.5vw, 1.25rem)',
                  letterSpacing: useBackup ? 2 : 4,
                  textAlign: 'center'
                }}
                autoFocus
                disabled={loading2FA}
                className="admin-login-input admin-login-otp-input"
              />
              <Button
                type="primary"
                loading={loading2FA}
                onClick={handle2FAVerify}
                disabled={!is2FACodeValid}
                block
                className="admin-login-btn h-11 text-[15px] font-semibold"
              >
                Xác thực & Đăng nhập
              </Button>
              <Button
                type="link"
                onClick={() => setUseBackup(b => !b)}
                style={{ marginTop: 8 }}
                disabled={loading2FA}
                block
                className="admin-login-link"
              >
                {useBackup ? 'Sử dụng mã 2FA từ app?' : 'Sử dụng mã dự phòng?'}
              </Button>
              <Button
                type="text"
                onClick={() => {
                  setPending2FA(null)
                  setTwoFACode('')
                  setUseBackup(false)
                  form.resetFields()
                }}
                block
                style={{ marginTop: 8 }}
                disabled={loading2FA}
                className="admin-login-text-btn"
              >
                Quay lại
              </Button>
            </>
          )}
        </div>
      </Card>

      <Modal
        open={showTrustDeviceModal}
        onCancel={() => onTrustDevice(false)}
        rootClassName="admin-login-trust-modal"
        footer={[
          <Button key="skip" onClick={() => onTrustDevice(false)} className="admin-login-modal-skip">
            Bỏ qua
          </Button>,
          <Button key="trust" type="primary" onClick={() => onTrustDevice(true)} className="admin-login-modal-trust">
            Tin cậy thiết bị này
          </Button>
        ]}
      >
        <Title level={4} className="admin-login-modal-title">Tin cậy thiết bị này?</Title>
        <p className="admin-login-modal-description">
          Đăng nhập thành công! Bạn có muốn thêm thiết bị này vào danh sách thiết bị tin cậy không? <br />
          Khi tin cậy, lần sau đăng nhập sẽ không cần xác thực 2FA trên thiết bị này.
        </p>
      </Modal>
    </div>
  )
}

export default AdminLoginPage
