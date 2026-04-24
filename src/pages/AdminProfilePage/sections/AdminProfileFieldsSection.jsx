import { Col, Form, Input, Row } from 'antd'

export default function AdminProfileFieldsSection({ loading, roleLabel, lastLoginLabel }) {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label={<span className="dark:text-gray-300">Full name</span>}
          name="fullName"
          rules={[{ required: true, message: 'Nhập họ tên!' }]}
        >
          <Input
            className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
            disabled={loading}
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className="dark:text-gray-300">Email</span>} name="email">
          <Input className="dark:border-gray-600 dark:text-gray-500" disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className="dark:text-gray-300">Username</span>} name="username">
          <Input className="dark:border-gray-600 dark:text-gray-500" disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className="dark:text-gray-300">Role</span>}>
          <Input className="dark:border-gray-600 dark:text-gray-500" value={roleLabel} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className="dark:text-gray-300">Status</span>} name="status">
          <Input className="dark:border-gray-600 dark:text-gray-500" disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className="dark:text-gray-300">Last login</span>}>
          <Input className="dark:border-gray-600 dark:text-gray-500" value={lastLoginLabel} disabled />
        </Form.Item>
      </Col>
    </Row>
  )
}
