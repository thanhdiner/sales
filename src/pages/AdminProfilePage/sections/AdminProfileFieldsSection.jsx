import { Col, Form, Input, Row } from 'antd'

const labelClassName = 'text-[var(--admin-text-muted)]'
const editableInputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const readonlyInputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] !opacity-100'

export default function AdminProfileFieldsSection({ loading, roleLabel, statusLabel, lastLoginLabel, t }) {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label={<span className={labelClassName}>{t('fields.fullName')}</span>}
          name="fullName"
          rules={[{ required: true, message: t('fields.fullNameRequired') }]}
        >
          <Input className={editableInputClassName} disabled={loading} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>{t('fields.email')}</span>} name="email">
          <Input className={readonlyInputClassName} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>{t('fields.username')}</span>} name="username">
          <Input className={readonlyInputClassName} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>{t('fields.role')}</span>}>
          <Input className={readonlyInputClassName} value={roleLabel} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>{t('fields.status')}</span>}>
          <Input className={readonlyInputClassName} value={statusLabel} disabled />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label={<span className={labelClassName}>{t('fields.lastLogin')}</span>}>
          <Input className={readonlyInputClassName} value={lastLoginLabel} disabled />
        </Form.Item>
      </Col>
    </Row>
  )
}
