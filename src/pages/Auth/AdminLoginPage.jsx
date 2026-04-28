import { useState } from 'react'
import { Form, Input, Button, Typography, message, Card, Modal } from 'antd'
import { GlobalOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { authAdmin2FAVerify, authAdminLogin } from '@/services/adminAuth.service'
import { setAccessToken } from '@/utils/auth'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setUser } from '@/stores/adminUser'
import { setDarkMode } from '@/stores/darkModeSlice'
import { setLanguage } from '@/stores/languageSlice'
import { trustDevice } from '@/services/adminAccountsService'
import SEO from '@/components/SEO'
import './AdminLoginPage.scss'

const { Title } = Typography

function AdminLoginPage() {
  const { t } = useTranslation('adminAuth')
  const isDarkMode = useSelector(state => !!state.darkMode?.value)
  const language = useSelector(state => state.language?.value || 'vi')
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
  const nextLanguage = language === 'vi' ? 'en' : 'vi'
  const nextLanguageLabel = t(`login.controls.languages.${nextLanguage}`)
  const themeToggleLabel = isDarkMode ? t('login.controls.switchToLight') : t('login.controls.switchToDark')

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
        message.info(t('login.messages.require2FA'))
        return
      }

      if (res.accessToken && res.user) {
        setAccessToken(res.accessToken)
        dispatch(setUser({ user: res.user, token: res.accessToken }))
        message.success(t('login.messages.success'))
        if (res.user.twoFAEnabled && !deviceId) {
          setLatestToken(res.accessToken)
          setLatestUser(res.user)
          setShowTrustDeviceModal(true)
        } else {
          navigate('/admin/dashboard')
        }
        return
      }
      message.error(res.error || res.message || t('login.messages.missingData'))
    } catch (error) {
      message.error(t('login.messages.invalidCredentials'))
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
      else message.error(res.error || res.message || t('login.messages.invalid2FA'))
    } catch (error) {
      message.error(t('login.messages.expired2FA'))
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
      if (/iphone/i.test(ua)) name = t('login.deviceNames.iphone')
      else if (/ipad/i.test(ua)) name = t('login.deviceNames.ipad')
      else if (/android/i.test(ua)) name = t('login.deviceNames.android')
      else if (/mac/i.test(ua)) name = t('login.deviceNames.mac')
      else if (/win/i.test(ua)) name = t('login.deviceNames.windows')

      const browser = ua
      const location = ''

      try {
        await trustDevice({ deviceId, name, browser, location })
        message.success(t('login.messages.trustDeviceSuccess'))
      } catch (err) {
        message.error(t('login.messages.trustDeviceError'))
      }
    }
    dispatch(setUser({ user: latestUser, token: latestToken }))
    navigate('/admin/dashboard')
  }

  const is2FACodeValid = useBackup ? twoFACode.length >= 7 : /^\d{6}$/.test(twoFACode)

  return (
    <div className="admin-login-page flex min-h-screen items-center justify-center px-4 py-8">
      <SEO title={t('login.seoTitle')} noIndex />

      <div className="admin-login-toolbar" aria-label={t('login.controls.toolbarAria')}>
        <Button
          type="text"
          shape="circle"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => dispatch(setDarkMode(!isDarkMode))}
          aria-label={themeToggleLabel}
          title={themeToggleLabel}
          className="admin-login-toolbar-btn"
        />

        <Button
          type="text"
          icon={<GlobalOutlined />}
          onClick={() => dispatch(setLanguage(nextLanguage))}
          aria-label={t('login.controls.switchLanguage', { language: nextLanguageLabel })}
          title={t('login.controls.switchLanguage', { language: nextLanguageLabel })}
          className="admin-login-toolbar-btn admin-login-language-btn"
        >
          {language === 'vi' ? 'VI' : 'EN'}
        </Button>
      </div>

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
            {t('login.title')}
          </Title>
          {!pending2FA ? (
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ username: '', password: '' }}>
              <Form.Item
                name="username"
                label={<span className="admin-login-label">{t('login.form.usernameLabel')}</span>}
                rules={[{ required: true, message: t('login.form.usernameRequired') }]}
              >
                <Input placeholder={t('login.form.usernamePlaceholder')} autoFocus autoComplete="username" className="admin-login-input" />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span className="admin-login-label">{t('login.form.passwordLabel')}</span>}
                rules={[{ required: true, message: t('login.form.passwordRequired') }]}
              >
                <Input.Password placeholder={t('login.form.passwordPlaceholder')} autoComplete="current-password" className="admin-login-input" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginTop: 8 }}
                className="admin-login-btn h-11 text-[15px] font-semibold"
              >
                {t('login.form.submit')}
              </Button>
            </Form>
          ) : (
            <>
              <div className="admin-login-2fa-hint">
                {useBackup ? t('login.twoFA.backupHint') : t('login.twoFA.totpHint')}
              </div>
              <Input
                placeholder={useBackup ? t('login.twoFA.backupPlaceholder') : t('login.twoFA.totpPlaceholder')}
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
                {t('login.twoFA.submit')}
              </Button>
              <Button
                type="link"
                onClick={() => setUseBackup(b => !b)}
                style={{ marginTop: 8 }}
                disabled={loading2FA}
                block
                className="admin-login-link"
              >
                {useBackup ? t('login.twoFA.useTotp') : t('login.twoFA.useBackup')}
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
                {t('login.twoFA.back')}
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
            {t('login.trustDevice.skip')}
          </Button>,
          <Button key="trust" type="primary" onClick={() => onTrustDevice(true)} className="admin-login-modal-trust">
            {t('login.trustDevice.trust')}
          </Button>
        ]}
      >
        <Title level={4} className="admin-login-modal-title">{t('login.trustDevice.title')}</Title>
        <p className="admin-login-modal-description">
          {t('login.trustDevice.description')} <br />
          {t('login.trustDevice.descriptionNext')}
        </p>
      </Modal>
    </div>
  )
}

export default AdminLoginPage
