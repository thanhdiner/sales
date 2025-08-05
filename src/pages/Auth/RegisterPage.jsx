import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Divider, message, Space, Typography } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  UserAddOutlined,
  ContactsOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import titles from '@/utils/titles'
import { userRegister } from '@/services/userService'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const RegisterPage = () => {
  const navigate = useNavigate()
  titles('Register')

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

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <UserAddOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="!text-white !mb-2 !font-light">
              Tạo tài khoản mới
            </Title>
            <Text className="text-white text-opacity-80">Đăng ký để bắt đầu hành trình của bạn</Text>
          </div>

          <Form form={form} name="register" onFinish={onFinish} layout="vertical" size="large" className="space-y-2">
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input
                prefix={<ContactsOutlined className="text-white text-opacity-60" />}
                placeholder="Họ và tên"
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự!' },
                { max: 32, message: 'Tên đăng nhập tối đa 32 ký tự!' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên đăng nhập chỉ được chứa chữ, số, gạch dưới!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-white text-opacity-60" />}
                placeholder="Tên đăng nhập"
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-white text-opacity-60" />}
                placeholder="Địa chỉ email"
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-white text-opacity-60" />}
                placeholder="Số điện thoại"
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white text-opacity-60" />}
                placeholder="Mật khẩu"
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
              name="confirmPassword"
              dependencies={['password']}
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, { validator: validateConfirmPassword }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white text-opacity-60" />}
                placeholder="Xác nhận mật khẩu"
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
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản sử dụng!'))
                }
              ]}
              className="!mb-6"
            >
              <Checkbox className="!text-white">
                <span className="text-white text-opacity-80">
                  Tôi đồng ý với{' '}
                  <Link className="!text-white !font-semibold hover:!text-opacity-80 transition-all duration-300">Điều khoản sử dụng</Link>{' '}
                  và{' '}
                  <Link className="!text-white !font-semibold hover:!text-opacity-80 transition-all duration-300">Chính sách bảo mật</Link>
                </span>
              </Checkbox>
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
                {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="!border-white !border-opacity-30">
            <span className="!text-white !text-opacity-80 !bg-transparent px-4">hoặc đăng ký bằng</span>
          </Divider>

          <Space direction="vertical" className="w-full mt-6">
            <div className="flex gap-3">
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialRegister('Google')}
                className="!flex-1 !h-11 !bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white hover:!bg-opacity-20 hover:!border-opacity-50 !rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleSocialRegister('Facebook')}
                className="!flex-1 !h-11 !bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white hover:!bg-opacity-20 hover:!border-opacity-50 !rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                Facebook
              </Button>
              <Button
                icon={<GithubOutlined />}
                onClick={() => handleSocialRegister('GitHub')}
                className="!flex-1 !h-11 !bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white hover:!bg-opacity-20 hover:!border-opacity-50 !rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                GitHub
              </Button>
            </div>
          </Space>

          <div className="text-center mt-8">
            <Text className="text-white text-opacity-80">
              Đã có tài khoản?{' '}
              <Link to="/user/login" className="!text-white !font-semibold hover:!text-opacity-80 transition-all duration-300">
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </div>

        <div className="text-center mt-6">
          <Text className="text-white text-opacity-60 text-sm">
            Bằng việc đăng ký, bạn đồng ý với <Link className="!text-white !text-opacity-80 hover:!text-white">Điều khoản sử dụng</Link> và{' '}
            <Link className="!text-white !text-opacity-80 hover:!text-white">Chính sách bảo mật</Link>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
