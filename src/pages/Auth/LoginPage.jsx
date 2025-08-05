import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Divider, message, Space, Typography } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import titles from '@/utils/titles'
import { useNavigate } from 'react-router-dom'
import { userLogin } from '@/services/userService'
import { setUser } from '@/stores/user'
import { useDispatch } from 'react-redux'
import { clearClientTokens, clearClientTokensSession, setClientAccessToken, setClientAccessTokenSession } from '@/utils/auth'

const { Title, Text } = Typography

const LoginPage = () => {
  titles('Login')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async values => {
    setLoading(true)
    try {
      const { identity, password, remember } = values
      const res = await userLogin({ identity, password, remember })

      if (res.error) {
        message.error(res.error)
      } else {
        message.success('Đăng nhập thành công! 🎉')
        clearClientTokens()
        clearClientTokensSession()

        dispatch(setUser({ user: res.user, token: res.accessToken }))
        if (remember) {
          localStorage.setItem('user', JSON.stringify(res.user))
          setClientAccessToken(res.accessToken)
        } else {
          sessionStorage.setItem('user', JSON.stringify(res.user))
          setClientAccessTokenSession(res.accessToken)
        }

        navigate('/')
      }
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }
  const handleSocialLogin = provider => {
    if (provider === 'Google') {
      window.open(`${process.env.REACT_APP_API_URL}/user/google`, '_self')
    } else if (provider === 'Facebook') {
      window.open(`${process.env.REACT_APP_API_URL}/user/facebook`, '_self')
    } else if (provider === 'GitHub') {
      window.open(`${process.env.REACT_APP_API_URL}/user/github`, '_self')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-ping"></div>

        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white border-opacity-20 rotate-45 animate-spin"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white border-opacity-20 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="!text-white !mb-2 !font-light">
              Chào mừng trở lại
            </Title>
            <Text className="text-white text-opacity-80">Đăng nhập vào tài khoản của bạn</Text>
          </div>

          <Form form={form} name="login" onFinish={onFinish} layout="vertical" size="large" className="space-y-2">
            <Form.Item name="identity" rules={[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập!' }]}>
              <Input
                prefix={<UserOutlined className="text-white text-opacity-60" />}
                placeholder="Email hoặc tên đăng nhập"
                className="!bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white placeholder:!text-white placeholder:!text-opacity-60 !rounded-lg hover:!bg-opacity-20 focus:!bg-opacity-20 hover:!border-opacity-50 focus:!border-opacity-50"
                style={{
                  backdropFilter: 'blur(10px)'
                }}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
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
                autoComplete="current-password"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" className="!mb-0">
                <Checkbox className="!text-white">
                  <span className="text-white text-opacity-80">Ghi nhớ đăng nhập</span>
                </Checkbox>
              </Form.Item>
              <Link to="/user/forgot-password" className="!text-white !text-opacity-80 hover:!text-white transition-all duration-300">
                Quên mật khẩu?
              </Link>
            </div>

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
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="!border-white !border-opacity-30">
            <span className="!text-white !text-opacity-80 !bg-transparent px-4">hoặc đăng nhập bằng</span>
          </Divider>

          <Space direction="vertical" className="w-full mt-6">
            <div className="flex gap-3">
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin('Google')}
                className="!flex-1 !h-11 !bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white hover:!bg-opacity-20 hover:!border-opacity-50 !rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleSocialLogin('Facebook')}
                className="!flex-1 !h-11 !bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white hover:!bg-opacity-20 hover:!border-opacity-50 !rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                Facebook
              </Button>
              <Button
                icon={<GithubOutlined />}
                onClick={() => handleSocialLogin('GitHub')}
                className="!flex-1 !h-11 !bg-white !bg-opacity-10 !border-white !border-opacity-30 !text-white hover:!bg-opacity-20 hover:!border-opacity-50 !rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                GitHub
              </Button>
            </div>
          </Space>

          <div className="text-center mt-8">
            <Text className="text-white text-opacity-80">
              Chưa có tài khoản?{' '}
              <Link to="/user/register" className="!text-white !font-semibold hover:!text-opacity-80 transition-all duration-300">
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </div>

        <div className="text-center mt-6">
          <Text className="text-white text-opacity-60 text-sm">
            Bằng việc đăng nhập, bạn đồng ý với <Link className="!text-white !text-opacity-80 hover:!text-white">Điều khoản sử dụng</Link>{' '}
            và <Link className="!text-white !text-opacity-80 hover:!text-white">Chính sách bảo mật</Link>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
