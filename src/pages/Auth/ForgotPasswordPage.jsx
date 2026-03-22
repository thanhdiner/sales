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

const { Title, Text } = Typography
const { Step } = Steps

const ForgotPasswordPage = () => {const [loading, setLoading] = useState(false)
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
          <Form form={form} name="forgotPassword" onFinish={onEmailSubmit} layout="vertical" size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-white text-opacity-60" />}
                placeholder="Nhập địa chỉ email của bạn"
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>

            <Form.Item className="!mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!w-full !h-12 !bg-gradient-to-r !from-orange-500 !to-pink-500 !border-none !rounded-lg !font-semibold !text-base hover:!from-orange-600 hover:!to-pink-600 !shadow-lg hover:!shadow-xl transform hover:!scale-105 transition-all duration-300"
                style={{
                  background: loading ? '#1890ff' : 'linear-gradient(90deg, #ff7f50, #ff1493)'
                }}
              >
                {loading ? 'Đang gửi...' : 'Gửi Email Khôi Phục'}
              </Button>
            </Form.Item>
          </Form>
        )

      case 1:
        return (
          <Form form={form} name="verifyCode" onFinish={onVerifySubmit} layout="vertical" size="large">
            <div className="text-center mb-6">
              <Text className="text-white text-opacity-80">
                Chúng tôi đã gửi mã xác thực đến email <strong className="text-white">{email}</strong>
              </Text>
            </div>

            <Form.Item
              name="verificationCode"
              rules={[
                { required: true, message: 'Vui lòng nhập mã xác thực!' },
                { len: 6, message: 'Mã xác thực phải có 6 chữ số!' }
              ]}
            >
              <Input
                prefix={<KeyOutlined className="text-white text-opacity-60" />}
                placeholder="Nhập mã xác thực 6 chữ số"
                maxLength={6}
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50 !text-center !text-2xl !tracking-widest"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>

            <Form.Item className="!mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!w-full !h-12 !bg-gradient-to-r !from-orange-500 !to-pink-500 !border-none !rounded-lg !font-semibold !text-base hover:!from-orange-600 hover:!to-pink-600 !shadow-lg hover:!shadow-xl transform hover:!scale-105 transition-all duration-300"
                style={{
                  background: loading ? '#1890ff' : 'linear-gradient(90deg, #ff7f50, #ff1493)'
                }}
              >
                {loading ? 'Đang xác thực...' : 'Xác Thực'}
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text className="text-white text-opacity-60">
                Không nhận được mã?{' '}
                <Link onClick={resendEmail} className="!text-white !font-semibold hover:!text-opacity-80 transition-all duration-300">
                  Gửi lại
                </Link>
              </Text>
            </div>
          </Form>
        )

      case 2:
        return (
          <Form form={form} name="resetPassword" onFinish={onResetSubmit} layout="vertical" size="large">
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white text-opacity-60" />}
                placeholder="Nhập mật khẩu mới"
                iconRender={visible =>
                  visible ? <EyeTwoTone twoToneColor="#ffffff" /> : <EyeInvisibleOutlined className="text-white text-opacity-60" />
                }
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              dependencies={['newPassword']}
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }, { validator: validateConfirmPassword }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white text-opacity-60" />}
                placeholder="Xác nhận mật khẩu mới"
                iconRender={visible =>
                  visible ? <EyeTwoTone twoToneColor="#ffffff" /> : <EyeInvisibleOutlined className="text-white text-opacity-60" />
                }
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>

            <Form.Item className="!mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!w-full !h-12 !bg-gradient-to-r !from-orange-500 !to-pink-500 !border-none !rounded-lg !font-semibold !text-base hover:!from-orange-600 hover:!to-pink-600 !shadow-lg hover:!shadow-xl transform hover:!scale-105 transition-all duration-300"
                style={{
                  background: loading ? '#1890ff' : 'linear-gradient(90deg, #ff7f50, #ff1493)'
                }}
              >
                {loading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
              </Button>
            </Form.Item>
          </Form>
        )

      case 3:
        return (
          <div className="text-center">
      <SEO title="Quên mật khẩu" noIndex />
                  <div className="mb-6">
              <CheckCircleOutlined className="text-6xl text-green-400 mb-4" />
              <Title level={3} className="!text-white !mb-2">
                Thành công!
              </Title>
              <Text className="text-white text-opacity-80">Mật khẩu của bạn đã được đặt lại thành công.</Text>
            </div>

            <Link to="/user/login">
              <Button
                type="primary"
                className="!w-full !h-12 !bg-gradient-to-r !from-orange-500 !to-pink-500 !border-none !rounded-lg !font-semibold !text-base hover:!from-orange-600 hover:!to-pink-600 !shadow-lg hover:!shadow-xl transform hover:!scale-105 transition-all duration-300"
                style={{
                  background: 'linear-gradient(90deg, #ff7f50, #ff1493)'
                }}
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-ping"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white border-opacity-20 rotate-45 animate-spin"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white border-opacity-20 rounded-full animate-pulse"></div>
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <KeyOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="!text-white !mb-2 !font-light">
              {getStepTitle()}
            </Title>
            <Text className="text-white text-opacity-80">{getStepDescription()}</Text>
          </div>

          {/* Progress Steps */}
          {currentStep < 3 && (
            <div className="mb-8">
              <Steps current={currentStep} size="small" className="custom-steps">
                <Step />
                <Step />
                <Step />
              </Steps>
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-4">{renderStepContent()}</div>

          {/* Back to Login Link */}
          {currentStep < 3 && (
            <div className="text-center mt-8">
              <Link
                to="/user/login"
                className="!text-white !text-opacity-80 hover:!text-white transition-all duration-300 inline-flex items-center gap-2"
              >
                <ArrowLeftOutlined />
                Quay lại đăng nhập
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        {currentStep === 0 && (
          <div className="text-center mt-6">
            <Text className="text-white text-opacity-60 text-sm">Bạn sẽ nhận được email với hướng dẫn đặt lại mật khẩu</Text>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #52c41a !important;
          border-color: #52c41a !important;
        }

        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #ff7f50 !important;
          border-color: #ff7f50 !important;
        }

        .custom-steps .ant-steps-item-wait .ant-steps-item-icon {
          background-color: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .custom-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
          color: white !important;
        }

        .custom-steps .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon {
          color: white !important;
        }

        .custom-steps .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .custom-steps .ant-steps-item-tail::after {
          background-color: rgba(255, 255, 255, 0.3) !important;
        }

        .custom-steps .ant-steps-item-finish .ant-steps-item-tail::after {
          background-color: #52c41a !important;
        }
      `}</style>
    </div>
  )
}

export default ForgotPasswordPage
