import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Switch } from 'antd'
import { PROMO_CODE_FORM_INITIAL_VALUES } from '../utils/promoCodeHelpers'

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percent', label: 'Phần trăm (%)' },
  { value: 'amount', label: 'Số tiền cố định' }
]

const inputClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const labelClass = 'text-[var(--admin-text-muted)]'
const secondaryButtonClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass =
  '!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

export default function PromoCodeFormModal({ open, editingCode, form, loading, onCancel, onSubmit }) {
  const discountType = Form.useWatch('discountType', form)

  return (
    <Modal
      title={
        editingCode ? (
          <span className="text-[var(--admin-text)]">Chỉnh sửa mã giảm giá</span>
        ) : (
          <span className="text-[var(--admin-text)]">Tạo mã giảm giá mới</span>
        )
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="admin-promo-form-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={PROMO_CODE_FORM_INITIAL_VALUES}
        className="[&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="code"
              label={<span className={labelClass}>Mã giảm giá</span>}
              rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
            >
              <Input placeholder="VD: WELCOME20" className={inputClass} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="discountType"
              label={<span className={labelClass}>Loại giảm giá</span>}
              rules={[{ required: true }]}
            >
              <Select options={DISCOUNT_TYPE_OPTIONS} className="admin-promo-select" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="discountValue"
              label={<span className={labelClass}>Giá trị giảm</span>}
              rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
            >
              <InputNumber
                min={0}
                max={discountType === 'percent' ? 100 : undefined}
                className="admin-promo-input-number"
                style={{ width: '100%' }}
                formatter={value =>
                  discountType === 'percent'
                    ? `${value}%`
                    : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value =>
                  discountType === 'percent'
                    ? value?.replace('%', '') || ''
                    : value?.replace(/[^\d]/g, '') || ''
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="maxDiscount" label={<span className={labelClass}>Giảm tối đa (VNĐ)</span>}>
              <InputNumber
                min={0}
                className="admin-promo-input-number"
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/[^\d]/g, '') || ''}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="minOrder" label={<span className={labelClass}>Đơn hàng tối thiểu (VNĐ)</span>}>
              <InputNumber
                min={0}
                className="admin-promo-input-number"
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/[^\d]/g, '') || ''}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="usageLimit" label={<span className={labelClass}>Giới hạn sử dụng</span>}>
              <InputNumber
                min={1}
                className="admin-promo-input-number"
                style={{ width: '100%' }}
                placeholder="Để trống = không giới hạn"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="expiresAt" label={<span className={labelClass}>Ngày hết hạn</span>}>
              <DatePicker
                className="admin-promo-date-picker"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn"
                allowClear
                popupClassName="admin-promo-date-popup"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="isActive"
              label={<span className={labelClass}>Trạng thái</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-2 border-t border-[var(--admin-border)] pt-4">
          <Button onClick={onCancel} className={secondaryButtonClass}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className={primaryButtonClass}>
            {editingCode ? 'Cập nhật' : 'Tạo mã'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
