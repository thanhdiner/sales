import { Col, Form, Input, Row } from 'antd'

const labelClassName = 'text-[var(--admin-text-muted)]'
const editableInputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const readonlyInputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] !opacity-100'

export default function AdminProfileFieldsSection({ loading, roleLabel, lastLoginLabel }) {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label={<span className={labelClassName}>Full name</span>}
          name="fullName"
          rules={[{ required: true, message: 'Nhập họ tên!' }]}
        >
          <Input className={editableInputClassName} disabled={loading} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>Email</span>} name="email">
          <Input className={readonlyInputClassName} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>Username</span>} name="username">
          <Input className={readonlyInputClassName} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>Role</span>}>
          <Input className={readonlyInputClassName} value={roleLabel} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>Status</span>} name="status">
          <Input className={readonlyInputClassName} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>Last login</span>}>
          <Input className={readonlyInputClassName} value={lastLoginLabel} disabled />
        </Form.Item>
      </Col>
    </Row>
  )
}
