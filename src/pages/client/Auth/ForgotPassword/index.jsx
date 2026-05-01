import React, { useState } from 'react'
import { Form, Input, Button, message, Typography, Steps } from 'antd'
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import { forgotPassword, verifyResetCode, resetPassword } from '@/services/client/auth/user'
import { APP_NAME } from '@/utils/env'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getAuthTheme } from '../authTheme'
import AuthLanguageToggle from '../components/AuthLanguageToggle'
import './index.scss'

const { Title, Text } = Typography
const { Step } = Steps

const ForgotPassword = () => {
  const { t } = useTranslation('clientAuth')
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const isDarkMode = useSelector(state => !!state.darkMode?.value)
  const C = getAuthTheme(isDarkMode)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState('')
  const [form] = Form.useForm()
  const [verificationCode, setVerificationCode] = useState('')

  const onEmailSubmit = async values => {
    setLoading(true)
    try {
      const res = await forgotPassword({ email: values.email })
      if (res.status !== 200) throw new Error(res.message || t('forgot.messages.emailSendError'))
      setEmail(values.email)
      setCurrentStep(1)
      message.success(t('forgot.messages.emailSent'))
    } catch (error) {
      message.error(error.message || t('forgot.messages.emailSendRetryError'))
    } finally {
      setLoading(false)
    }
  }

  const onVerifySubmit = async values => {
    setLoading(true)
    try {
      const res = await verifyResetCode({ email, code: values.verificationCode })
      if (res.status !== 200) throw new Error(res.message || t('forgot.messages.codeInvalid'))
      setVerificationCode(values.verificationCode)
      setCurrentStep(2)
      message.success(t('forgot.messages.codeValid'))
    } catch (error) {
      message.error(error.message || t('forgot.messages.codeInvalidRetry'))
    } finally {
      setLoading(false)
    }
  }

  const onResetSubmit = async values => {
    setLoading(true)
    try {
      const res = await resetPassword({
        email,
        code: verificationCode,
        newPassword: values.newPassword
      })

      if (res.status !== 200) throw new Error(res.message || t('forgot.messages.resetError'))
      setCurrentStep(3)
      message.success(t('forgot.messages.resetSuccess'))
    } catch (error) {
      message.error(error.message || t('forgot.messages.resetRetryError'))
    } finally {
      setLoading(false)
    }
  }

  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue('newPassword') === value) {
      return Promise.resolve()
    }

    return Promise.reject(new Error(t('forgot.resetForm.confirmPasswordMismatch')))
  }

  const resendEmail = async () => {
    setLoading(true)
    try {
      const res = await forgotPassword({ email })
      if (res.status !== 200) throw new Error(res.message || t('forgot.messages.resendError'))
      message.success(t('forgot.messages.resendSuccess'))
    } catch (error) {
      message.error(error.message || t('forgot.messages.resendError'))
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            name="forgotPassword"
            onFinish={onEmailSubmit}
            layout="vertical"
            size="middle"
          >
            <Form.Item
              label={t('forgot.emailForm.label')}
              name="email"
              rules={[
                { required: true, message: t('forgot.emailForm.required') },
                { type: 'email', message: t('forgot.emailForm.invalid') }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t('forgot.emailForm.placeholder')}
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="sovereign-forgot-btn-primary"
                style={{ width: '100%', height: '3.25rem' }}
              >
                {loading ? t('forgot.emailForm.submitting') : t('forgot.emailForm.submit')}
              </Button>
            </Form.Item>
          </Form>
        )

      case 1:
        return (
          <Form
            form={form}
            name="verifyCode"
            onFinish={onVerifySubmit}
            layout="vertical"
            size="middle"
          >
            <div
              style={{
                marginBottom: '1rem',
                color: C.onSurfaceVariant,
                fontSize: '0.9rem'
              }}
            >
              {t('forgot.verifyForm.sentTo')}{' '}
              <strong style={{ color: C.onSurface }}>{email}</strong>
            </div>

            <Form.Item
              label={t('forgot.verifyForm.label')}
              name="verificationCode"
              rules={[
                { required: true, message: t('forgot.verifyForm.required') },
                { len: 6, message: t('forgot.verifyForm.length') }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input
                prefix={<KeyOutlined />}
                placeholder={t('forgot.verifyForm.placeholder')}
                maxLength={6}
                className="sovereign-forgot-code-input"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '0.75rem' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="sovereign-forgot-btn-primary"
                style={{ width: '100%', height: '3.25rem' }}
              >
                {loading ? t('forgot.verifyForm.submitting') : t('forgot.verifyForm.submit')}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: C.onSurfaceVariant }}>
                {t('forgot.verifyForm.noCode')}{' '}
                <Button
                  type="link"
                  onClick={resendEmail}
                  className="sovereign-forgot-link-btn"
                  disabled={loading}
                >
                  {t('forgot.verifyForm.resend')}
                </Button>
              </Text>
            </div>
          </Form>
        )

      case 2:
        return (
          <Form
            form={form}
            name="resetPassword"
            onFinish={onResetSubmit}
            layout="vertical"
            size="middle"
          >
            <Form.Item
              label={t('forgot.resetForm.newPasswordLabel')}
              name="newPassword"
              rules={[
                { required: true, message: t('forgot.resetForm.newPasswordRequired') },
                { min: 8, message: t('forgot.resetForm.passwordMin') },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: t('forgot.resetForm.passwordPattern')
                }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('forgot.resetForm.newPasswordPlaceholder')}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label={t('forgot.resetForm.confirmPasswordLabel')}
              name="confirmNewPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: t('forgot.resetForm.confirmPasswordRequired') },
                { validator: validateConfirmPassword }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('forgot.resetForm.confirmPasswordPlaceholder')}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="sovereign-forgot-btn-primary"
                style={{ width: '100%', height: '3.25rem' }}
              >
                {loading ? t('forgot.resetForm.submitting') : t('forgot.resetForm.submit')}
              </Button>
            </Form.Item>
          </Form>
        )

      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <CheckCircleOutlined style={{ fontSize: '3rem', color: C.successText }} />
              <Title level={4} style={{ marginBottom: '0.5rem' }}>
                {t('forgot.done.title')}
              </Title>
              <Text style={{ color: C.onSurfaceVariant }}>
                {t('forgot.done.description')}
              </Text>
            </div>

            <Link to="/user/login">
              <Button
                type="primary"
                className="sovereign-forgot-btn-primary"
                style={{ width: '100%', height: '3.25rem' }}
              >
                {t('forgot.done.backToLogin')}
              </Button>
            </Link>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return t('forgot.steps.email.title')
      case 1:
        return t('forgot.steps.verify.title')
      case 2:
        return t('forgot.steps.reset.title')
      case 3:
        return t('forgot.steps.done.title')
      default:
        return t('forgot.steps.email.title')
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return t('forgot.steps.email.description')
      case 1:
        return t('forgot.steps.verify.description')
      case 2:
        return t('forgot.steps.reset.description')
      case 3:
        return t('forgot.steps.done.description')
      default:
        return t('forgot.steps.email.description')
    }
  }

  return (
    <div
      className="sovereign-auth-page sovereign-auth-page--forgot"
      style={{
        minHeight: '100vh',
        background: C.surface,
        color: C.onSurface,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <SEO title={t('forgot.seoTitle')} noIndex />

      <header
        className="sovereign-auth-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: C.headerBackground,
          boxShadow: C.headerShadow
        }}
      >
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            maxWidth: '80rem',
            margin: '0 auto'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              textDecoration: 'none'
            }}
          >
            {websiteConfig?.logoUrl ? (
              <img
                src={websiteConfig.logoUrl}
                alt={websiteConfig?.siteName || 'Logo'}
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  objectFit: 'contain',
                  background: C.logoBackground,
                  borderRadius: '0.375rem',
                  boxShadow: C.logoShadow
                }}
              />
            ) : null}

            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'Manrope, sans-serif',
                color: C.primary,
                letterSpacing: '-0.04em'
              }}
            >
              {websiteConfig?.siteName || APP_NAME || 'Sovereign'}
            </span>
          </Link>

          <div
            className="sovereign-auth-nav-actions"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: C.onSurfaceVariant,
                padding: '0.25rem 0.75rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.3s'
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.background = C.surfaceContainerLow)
              }
              onMouseLeave={e =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '1rem' }}
              >
                home
              </span>
              <span>{t('shared.nav.home')}</span>
            </Link>

            {[
              { icon: 'help', to: '/faq' },
              { icon: 'info', to: '/about' }
            ].map(({ icon, to }) => (
              <Link
                key={icon}
                to={to}
                aria-label={t(`shared.nav.${icon}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  color: C.onSurfaceVariant,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.background = C.surfaceContainerLow)
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '1rem' }}
                >
                  {icon}
                </span>
                <span>{t(`shared.nav.${icon}`)}</span>
              </Link>
            ))}

            <AuthLanguageToggle colors={C} />
          </div>
        </nav>
      </header>

      <main
        className="sovereign-auth-main"
        style={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - 4rem)',
          paddingTop: '4rem',
          overflow: 'hidden'
        }}
      >
        <section
          className="sovereign-forgot-left-panel"
          style={{
            width: '45%',
            flex: '0 0 45%',
            height: 'calc(100vh - 4rem)',
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            background: C.leftPanelBackground
          }}
        >
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACe3IlpkpA5MRMYLbvo78c6QZClHSwMUL-D2OU4TRpVnaAPXf4IIoq94S2MmUtm7dV9FIeA4OwDELo4F6cFbOkX3jhNye0-CqlmvKREe9w-Js096Zs6JpK4JAzI56015zq9QcB5JpVpCLQhcCJ3TUq5gYgly3EAytdv2QG6-4XEbNxXRp1OAOAyGIYmRvYyuDU3Qmry-PkWwzw2jmcaNuiGmZdA-VngkTDfXtH_zhdwx-6-R6u2YHVCvZx389GIqs1lpDI2UV1ARw"
              alt={t('shared.hero.backgroundAlt')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: C.heroImageOpacity,
                mixBlendMode: C.heroImageBlendMode
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: C.heroOverlay
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '4.5rem 3rem 3.5rem',
              maxWidth: '32rem'
            }}
          >
            <h1
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1.2rem'
              }}
            >
              {t('forgot.hero.title').split('\n').map((line, index) => (
                <React.Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h1>

            <p
              style={{
                fontSize: '1.0625rem',
                color: C.primaryFixed,
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: '2.5rem',
                maxWidth: '27rem'
              }}
            >
              {t('forgot.hero.description')}
            </p>

            <div
              style={{
                position: 'relative',
                paddingLeft: '2rem',
                borderLeft: `2px solid ${C.quoteBorder}`
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '-1.25rem',
                  top: '-1.5rem',
                  fontSize: '4rem',
                  color: C.quoteMark,
                  userSelect: 'none'
                }}
              >
                format_quote
              </span>

              <blockquote
                style={{
                  color: C.quoteText,
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  lineHeight: 1.7
                }}
              >
                "{t('forgot.hero.quote')}"
              </blockquote>

              <p
                style={{
                  marginTop: '1rem',
                  color: C.primaryFixed,
                  fontWeight: 500,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}
              >
                {t('shared.hero.quoteAuthor', { appName: APP_NAME || 'Sovereign' })}
              </p>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '3rem',
              right: '3rem',
              bottom: '3.5rem',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              color: C.primaryFixed
            }}
          >
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                color: '#ffffff'
              }}
            >
              {t('shared.footer.registrar', { appName: APP_NAME || 'Sovereign' })}
            </span>

            <span style={{ fontSize: '0.8125rem', color: C.primaryFixed }}>
              {t('shared.footer.copyright', { appName: APP_NAME || 'Sovereign' })}
              {' '}
              {t('shared.footer.rights')}
            </span>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem 1.25rem',
                marginTop: '0.25rem'
              }}
            >
              {[
                { label: t('shared.footer.terms'), to: '/terms-of-service' },
                { label: t('shared.footer.privacy'), to: '/privacy-policy' },
                { label: t('shared.footer.security'), to: '/privacy-policy' },
                { label: t('shared.footer.contact'), to: '/contact' }
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    fontSize: '0.8125rem',
                    color: C.primaryFixed,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    opacity: 0.9
                  }}
                  onMouseEnter={e => (e.target.style.opacity = '1')}
                  onMouseLeave={e => (e.target.style.opacity = '0.9')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          className="sovereign-forgot-right-panel"
          style={{
            width: '55%',
            flex: '1 1 55%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: C.surfaceContainerLow,
            padding: '2rem 1.5rem 3rem',
            maxHeight: 'calc(100vh - 4rem)',
            overflowY: 'auto'
          }}
        >
          <div
            className="sovereign-auth-card"
            style={{
              width: '100%',
              maxWidth: '28rem',
              background: C.cardBackground,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '2rem',
              padding: '2.5rem',
              boxShadow: C.cardShadow,
              border: C.cardBorder
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: C.onSurface,
                  marginBottom: '0.375rem'
                }}
              >
                {getStepTitle()}
              </h2>

              <p
                style={{
                  color: C.onSurfaceVariant,
                  fontSize: '0.9375rem',
                  margin: 0
                }}
              >
                {getStepDescription()}
              </p>
            </div>

            {currentStep < 3 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <Steps
                  current={currentStep}
                  size="small"
                  responsive={false}
                  className="sovereign-forgot-steps"
                >
                  <Step />
                  <Step />
                  <Step />
                </Steps>
              </div>
            )}

            <div className="sovereign-forgot-input">{renderStepContent()}</div>

            {currentStep < 3 && (
              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <Link
                  to="/user/login"
                  style={{
                    color: C.primary,
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}
                >
                  <ArrowLeftOutlined />
                  {t('forgot.backToLogin')}
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ForgotPassword
