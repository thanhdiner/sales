import { Form, Input, Button, message } from 'antd'
import { useState } from 'react'
import { Card, Typography } from 'antd'
import { changePasswordAdminAccount } from '@/services/adminAccountsService'

const { Title, Paragraph } = Typography

const ChangePasswordForm = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async values => {
    const { username, ...rest } = values
    try {
      setLoading(true)
      await changePasswordAdminAccount(rest)
      message.success('Password changed successfully!')
      form.resetFields()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Change password failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Card className="dark:bg-gray-800">
        <Title level={4} className="dark:text-gray-200">
          Change Password
        </Title>
        <Paragraph type="secondary" className="dark:text-gray-200">
          Please enter your current password and a new password.
        </Paragraph>

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="username" initialValue="" style={{ display: 'none' }}>
            <Input autoComplete="username" />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-200">Current Password</span>}
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600" autoComplete="current-password" />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-200"> New Password</span>}
            name="newPassword"
            rules={[{ required: true, message: 'Please enter a new password' }]}
          >
            <Input.Password className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-200">Confirm New Password</span>}
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match'))
                }
              })
            ]}
          >
            <Input.Password className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600" autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ChangePasswordForm
