import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Switch } from 'antd'
import { PROMO_CODE_FORM_INITIAL_VALUES } from '../utils/promoCodeHelpers'

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percent', label: 'Phần trăm (%)' },
  { value: 'amount', label: 'Số tiền cố định' }
]

export default function PromoCodeFormModal({ open, editingCode, form, loading, onCancel, onSubmit }) {
  const discountType = Form.useWatch('discountType', form)

  return (
    <Modal
      title={
        editingCode ? (
          <span className="dark:text-white">Chỉnh sửa mã giảm giá</span>
        ) : (
          <span className="dark:text-white">Tạo mã giảm giá mới</span>
        )
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={PROMO_CODE_FORM_INITIAL_VALUES}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="code"
              label={<span className="dark:text-white">Mã giảm giá</span>}
              rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
            >
              <Input
                placeholder="VD: WELCOME20"
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="discountType"
              label={<span className="dark:text-white">Loại giảm giá</span>}
              rules={[{ required: true }]}
            >
              <Select options={DISCOUNT_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="discountValue"
              label={<span className="dark:text-white">Giá trị giảm</span>}
              rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
            >
              <InputNumber
                min={0}
                max={discountType === 'percent' ? 100 : undefined}
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
            <Form.Item name="maxDiscount" label={<span className="dark:text-white">Giảm tối đa (VNĐ)</span>}>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/[^\d]/g, '') || ''}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="minOrder" label={<span className="dark:text-white">Đơn hàng tối thiểu (VNĐ)</span>}>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/[^\d]/g, '') || ''}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="usageLimit" label={<span className="dark:text-white">Giới hạn sử dụng</span>}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Để trống = không giới hạn" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="expiresAt" label={<span className="dark:text-white">Ngày hết hạn</span>}>
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn"
                allowClear
                popupClassName="my-date-popup"
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="isActive"
              label={<span className="dark:text-white">Trạng thái</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-2 border-t pt-4">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingCode ? 'Cập nhật' : 'Tạo mã'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
