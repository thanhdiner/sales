import React, { useState } from 'react'
import { Form, Input, Button, Typography, message, Card } from 'antd'
import { authAdminLogin } from '../../services/adminAuth.service'
import { setAccessToken } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const navigate = useNavigate()

  const handleFinish = async values => {
    setLoading(true)
    try {
      const res = await authAdminLogin({ username: values.username, password: values.password })
      if (res.accessToken) {
        setAccessToken(res.accessToken)
        message.success('Đăng nhập thành công')
        navigate('/admin/dashboard')
      }
    } catch (error) {
      message.error('Sai tên đăng nhập hoặc mật khẩu!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg,#f0f4ff 0%,#f7f8fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card
        style={{
          width: 350,
          borderRadius: 16,
          boxShadow: '0 6px 32px #0001',
          padding: 24
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: 32 }}>
          <Title level={3} style={{ marginBottom: 16, textAlign: 'center' }}>
            Admin Login
          </Title>
          <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ username: '', password: '' }}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Nhập username!' }]}>
              <Input placeholder="Tài khoản" autoFocus />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 8 }}>
              Đăng nhập
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  )
}

export default AdminLoginPage
