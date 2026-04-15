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
import SEO from '@/components/SEO'
import { forgotPassword, verifyResetCode, resetPassword } from '@/services/userService'
import { useSelector } from 'react-redux'
import './ForgotPasswordPage.scss'

const { Title, Text } = Typography
const { Step } = Steps

const C = {
  primary: '#27389a',
  primaryContainer: '#4151b3',
  primaryFixed: '#dee0ff',
  surface: '#fbf8ff',
  surfaceContainerLow: '#f4f2fc',
  onSurface: '#1a1b22',
  onSurfaceVariant: '#454652'
}

const ForgotPasswordPage = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState('')
  const [form] = Form.useForm()
  const [verificationCode, setVerificationCode] = useState('')

  const onEmailSubmit = async values => {
    setLoading(true)
    try {
      const res = await forgotPassword({ email: values.email })
      if (res.status !== 200) throw new Error(res.message || 'Gửi email thất bại!')
      setEmail(values.email)
      setCurrentStep(1)
      message.success('Email khôi phục đã được gửi! Vui lòng kiểm tra hộp thư của bạn.')
    } catch (error) {
      message.error(error.message || 'Gửi email thất bại. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const onVerifySubmit = async values => {
    setLoading(true)
    try {
      const res = await verifyResetCode({ email, code: values.verificationCode })
      if (res.status !== 200) throw new Error(res.message || 'Mã xác thực không hợp lệ!')
      setVerificationCode(values.verificationCode)
      setCurrentStep(2)
      message.success('Mã xác thực hợp lệ!')
    } catch (error) {
      message.error(error.message || 'Mã xác thực không hợp lệ. Vui lòng thử lại!')
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
      if (res.status !== 200) throw new Error(res.message || 'Đặt lại mật khẩu thất bại!')
      setCurrentStep(3)
      message.success('Mật khẩu đã được đặt lại thành công! 🎉')
    } catch (error) {
      message.error(error.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue('newPassword') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
  }

  const resendEmail = async () => {
    setLoading(true)
    try {
      const res = await forgotPassword({ email })
      if (res.status !== 200) throw new Error(res.message || 'Gửi lại email thất bại!')
      message.success('Email khôi phục đã được gửi lại!')
    } catch (error) {
      message.error(error.message || 'Gửi lại email thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} name="forgotPassword" onFinish={onEmailSubmit} layout="vertical" size="middle">
            <Form.Item
              label="Địa chỉ email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập địa chỉ email của bạn" autoComplete="email" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="sovereign-forgot-btn-primary"
                style={{ width: '100%', height: '3.25rem' }}
              >
                {loading ? 'Đang gửi...' : 'Gửi Email Khôi Phục'}
              </Button>
            </Form.Item>
          </Form>
        )

      case 1:
        return (
          <Form form={form} name="verifyCode" onFinish={onVerifySubmit} layout="vertical" size="middle">
            <div style={{ marginBottom: '1rem', color: C.onSurfaceVariant, fontSize: '0.9rem' }}>
              Chúng tôi đã gửi mã xác thực đến email <strong style={{ color: C.onSurface }}>{email}</strong>
            </div>

            <Form.Item
              label="Mã xác thực"
              name="verificationCode"
              rules={[
                { required: true, message: 'Vui lòng nhập mã xác thực!' },
                { len: 6, message: 'Mã xác thực phải có 6 chữ số!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input
                prefix={<KeyOutlined />}
                placeholder="Nhập mã xác thực 6 chữ số"
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
                {loading ? 'Đang xác thực...' : 'Xác Thực'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: C.onSurfaceVariant }}>
                Không nhận được mã?{' '}
                <Button type="link" onClick={resendEmail} className="sovereign-forgot-link-btn" disabled={loading}>
                  Gửi lại
                </Button>
              </Text>
            </div>
          </Form>
        )

      case 2:
        return (
          <Form form={form} name="resetPassword" onFinish={onResetSubmit} layout="vertical" size="middle">
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }, { validator: validateConfirmPassword }]}
              style={{ marginBottom: '1rem' }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
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
                {loading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
              </Button>
            </Form.Item>
          </Form>
        )

      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <CheckCircleOutlined style={{ fontSize: '3rem', color: '#52c41a' }} />
              <Title level={4} style={{ marginBottom: '0.5rem' }}>
                Thành công!
              </Title>
              <Text style={{ color: C.onSurfaceVariant }}>Mật khẩu của bạn đã được đặt lại thành công.</Text>
            </div>

            <Link to="/user/login">
              <Button
                type="primary"
                className="sovereign-forgot-btn-primary"
                style={{ width: '100%', height: '3.25rem' }}
              >
                Về Trang Đăng Nhập
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
        return 'Quên mật khẩu?'
      case 1:
        return 'Xác thực email'
      case 2:
        return 'Đặt mật khẩu mới'
      case 3:
        return 'Hoàn thành'
      default:
        return 'Quên mật khẩu?'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return 'Nhập email để nhận mã khôi phục mật khẩu'
      case 1:
        return 'Nhập mã xác thực được gửi đến email của bạn'
      case 2:
        return 'Tạo mật khẩu mới cho tài khoản của bạn'
      case 3:
        return 'Mật khẩu đã được đặt lại thành công'
      default:
        return 'Nhập email để nhận mã khôi phục mật khẩu'
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.surface,
        color: C.onSurface,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <SEO title="Quên mật khẩu" noIndex />

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: C.surface,
          boxShadow: '0px 24px 48px rgba(39,56,154,0.06)'
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
                  background: '#ffffff',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
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
              {websiteConfig?.siteName || process.env.REACT_APP_NAME_APP || 'Sovereign'}
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {['help', 'info'].map(icon => (
              <button
                key={icon}
                type="button"
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
                  border: 'none',
                  background: 'transparent',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.surfaceContainerLow)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  {icon}
                </span>
                <span>{icon}</span>
              </button>
            ))}
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
            alignItems: 'center',
            background: C.primary
          }}
        >
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACe3IlpkpA5MRMYLbvo78c6QZClHSwMUL-D2OU4TRpVnaAPXf4IIoq94S2MmUtm7dV9FIeA4OwDELo4F6cFbOkX3jhNye0-CqlmvKREe9w-Js096Zs6JpK4JAzI56015zq9QcB5JpVpCLQhcCJ3TUq5gYgly3EAytdv2QG6-4XEbNxXRp1OAOAyGIYmRvYyuDU3Qmry-PkWwzw2jmcaNuiGmZdA-VngkTDfXtH_zhdwx-6-R6u2YHVCvZx389GIqs1lpDI2UV1ARw"
              alt="Sovereign background"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, mixBlendMode: 'overlay' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(39,56,154,0.85) 0%, rgba(65,81,179,0.45) 60%, transparent 100%)'
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '3.5rem 3rem',
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
              Khôi phục
              <br />
              tài khoản
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
              Thực hiện các bước xác minh để đặt lại mật khẩu và truy cập lại tài khoản của bạn một cách an toàn.
            </p>

            <div
              style={{
                position: 'relative',
                paddingLeft: '2rem',
                borderLeft: '2px solid rgba(222,224,255,0.3)'
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '-1.25rem',
                  top: '-1.5rem',
                  fontSize: '4rem',
                  color: 'rgba(222,224,255,0.15)',
                  userSelect: 'none'
                }}
              >
                format_quote
              </span>

              <blockquote
                style={{
                  color: '#bbc3ff',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  lineHeight: 1.7
                }}
              >
                "Bảo mật tốt bắt đầu từ việc xác minh đúng người dùng, đúng thời điểm, đúng quyền truy cập."
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
                — Ban Quản Trị {process.env.REACT_APP_NAME_APP || 'Sovereign'}
              </p>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '3rem',
              right: '3rem',
              bottom: '2rem',
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
              {process.env.REACT_APP_NAME_APP || 'Sovereign'} Registrar
            </span>
            <span style={{ fontSize: '0.8125rem', color: C.primaryFixed }}>
              © 2024 {process.env.REACT_APP_NAME_APP || 'Sovereign'} Registrar. All rights reserved.
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
                { label: 'Terms of Service', to: '/terms-of-service' },
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Security', to: '/privacy-policy' },
                { label: 'Contact', to: '/contact' }
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
            style={{
              width: '100%',
              maxWidth: '28rem',
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '2rem',
              padding: '2.5rem',
              boxShadow: '0px 24px 48px rgba(39,56,154,0.09)',
              border: '1px solid rgba(197,197,212,0.25)'
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
              <p style={{ color: C.onSurfaceVariant, fontSize: '0.9375rem', margin: 0 }}>{getStepDescription()}</p>
            </div>

            {currentStep < 3 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <Steps current={currentStep} size="small" className="sovereign-forgot-steps">
                  <Step />
                  <Step />
                  <Step />
                </Steps>
              </div>
            )}

            <div className="sovereign-forgot-input">{renderStepContent()}</div>

            {currentStep < 3 && (
              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <Link to="/user/login" style={{ color: C.primary, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                  <ArrowLeftOutlined />
                  Quay lại đăng nhập
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
