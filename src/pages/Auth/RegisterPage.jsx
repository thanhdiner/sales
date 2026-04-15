import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Divider, message } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
  ContactsOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import { userRegister } from '@/services/userService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './RegisterPage.scss'

const C = {
  primary: '#27389a',
  primaryContainer: '#4151b3',
  primaryFixed: '#dee0ff',
  surface: '#fbf8ff',
  surfaceContainerLow: '#f4f2fc',
  surfaceContainerHigh: '#e9e7f0',
  surfaceContainerHighest: '#e3e1ea',
  onSurface: '#1a1b22',
  onSurfaceVariant: '#454652',
  outline: '#757684',
  outlineVariant: '#c5c5d4'
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async values => {
    setLoading(true)
    try {
      const { confirmPassword, agreement, ...registerData } = values

      const res = await userRegister(registerData)
      if (res.error) {
        message.error(res.error)
      } else {
        message.success('Đăng ký thành công! 🎉 Vui lòng đăng nhập.')
        form.resetFields()
        navigate('/user/login')
      }
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialRegister = provider => {
    if (provider === 'Google') {
      window.open(`${process.env.REACT_APP_API_URL}/user/google`, '_self')
    } else if (provider === 'Facebook') {
      window.open(`${process.env.REACT_APP_API_URL}/user/facebook`, '_self')
    } else if (provider === 'GitHub') {
      window.open(`${process.env.REACT_APP_API_URL}/user/github`, '_self')
    }
  }

  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
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
      <SEO title="Đăng ký tài khoản" noIndex />

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
          className="sovereign-register-left-panel"
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
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                mixBlendMode: 'overlay'
              }}
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
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1.5rem'
              }}
            >
              Tạo tài khoản mới
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                color: C.primaryFixed,
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: '3rem',
                maxWidth: '28rem'
              }}
            >
              Đăng ký để bắt đầu hành trình của bạn trong không gian quản trị danh tính số tối cao.
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
                "Kiến trúc an toàn không chỉ là những bức tường lửa, mà là sự minh bạch và chủ quyền đối với từng bit dữ liệu cá nhân."
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
          className="sovereign-register-right-panel"
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
            <div style={{ marginBottom: '2rem' }}>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: C.onSurface,
                  marginBottom: '0.375rem'
                }}
              >
                Bắt đầu ngay hôm nay
              </h2>
              <p
                style={{
                  color: C.onSurfaceVariant,
                  fontSize: '0.9375rem',
                  margin: 0
                }}
              >
                Điền thông tin của bạn để thiết lập tài khoản
              </p>
            </div>

            <div className="sovereign-register-input" style={{ margin: '0 0.25rem' }}>
              <Form form={form} name="register" onFinish={onFinish} layout="vertical" size="middle">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input
                prefix={<ContactsOutlined />}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </Form.Item>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự!' },
                { max: 32, message: 'Tên đăng nhập tối đa 32 ký tự!' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên đăng nhập chỉ được chứa chữ, số, gạch dưới!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input prefix={<UserOutlined />} placeholder="nguyenvana123" autoComplete="username" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Địa chỉ email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input prefix={<MailOutlined />} placeholder="email@example.com" autoComplete="email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0901 234 567" autoComplete="tel" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!' }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, { validator: validateConfirmPassword }]}
              style={{ marginBottom: '0.75rem' }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                autoComplete="new-password"
              />
            </Form.Item>

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: C.onSurfaceVariant,
                  fontSize: '0.75rem',
                  marginBottom: '0.35rem'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#6c3400' }}>
                  info
                </span>
                <span>Mật khẩu phải có ít nhất 8 ký tự!</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: C.onSurfaceVariant,
                  fontSize: '0.75rem'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#6c3400' }}>
                  info
                </span>
                <span>Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!</span>
              </div>
            </div>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản sử dụng!'))
                }
              ]}
              style={{ marginBottom: '1rem' }}
            >
              <Checkbox>
                <span style={{ color: C.onSurfaceVariant, fontSize: '0.875rem' }}>
                  Tôi đồng ý với{' '}
                  <Link to="/terms-of-service" style={{ color: C.primary, fontWeight: 600, textDecoration: 'none' }}>
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy-policy" style={{ color: C.primary, fontWeight: 600, textDecoration: 'none' }}>
                    Chính sách bảo mật
                  </Link>
                </span>
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: '1rem' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="sovereign-register-btn-primary"
                style={{ width: '100%', height: '3.25rem', color: '#fff' }}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </Form.Item>

            <Divider style={{ margin: '0.5rem 0 1rem' }}>HOẶC ĐĂNG KÝ BẰNG</Divider>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}
            >
              {[
                {
                  key: 'Google',
                  img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png'
                },
                {
                  key: 'GitHub',
                  img: 'https://cdn-icons-png.flaticon.com/512/25/25231.png'
                },
                {
                  key: 'Facebook',
                  img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/960px-2023_Facebook_icon.svg.png'
                }
              ].map(({ key, img }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSocialRegister(key)}
                  className="sovereign-register-btn-social"
                  style={{ cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  <img src={img} alt={key} style={{ width: '1.25rem', height: '1.25rem', objectFit: 'contain' }} />
                  <span>{key}</span>
                </button>
              ))}
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: C.onSurfaceVariant,
                margin: 0
              }}
            >
              Đã có tài khoản?{' '}
              <Link to="/user/login" style={{ color: C.primary, fontWeight: 700, textDecoration: 'none' }}>
                Đăng nhập ngay
              </Link>
            </p>
          </Form>
        </div>
      </div>
        </section>
      </main>

    </div>
  )
}

export default RegisterPage
