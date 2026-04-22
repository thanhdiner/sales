import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { returnPolicyReturnReasons } from '../data'

const { Text } = Typography
const { TextArea } = Input

const ReturnRequestModal = ({ open, onClose }) => {
  const [form] = Form.useForm()

  const handleSubmit = values => {
    console.log('Return request:', values)
    Modal.success({
      title: 'Yêu cầu đã được gửi!',
      content: 'Mã yêu cầu của bạn là RT2025080001. Chúng tôi sẽ liên hệ trong vòng 24h.',
    })
    form.resetFields()
    onClose()
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal title="Tạo Yêu Cầu Đổi Trả" open={open} onCancel={handleCancel} footer={null} width={700}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="orderNumber"
              label="Mã đơn hàng"
              rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}
            >
              <Input placeholder="VD: ORD2025080001" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="your@email.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="reason" label="Lý do đổi trả" rules={[{ required: true, message: 'Vui lòng chọn lý do' }]}>
          <Select
            placeholder="Chọn lý do đổi trả"
            options={returnPolicyReturnReasons.map(reason => ({
              value: reason.value,
              label: reason.label,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả chi tiết"
          rules={[{ required: true, message: 'Vui lòng mô tả chi tiết' }]}
        >
          <TextArea rows={4} placeholder="Mô tả tình trạng sản phẩm, lý do cụ thể..." />
        </Form.Item>

        <Form.Item name="images" label="Hình ảnh sản phẩm">
          <Upload listType="picture" multiple beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          <Text type="secondary" className="mt-1 block text-xs">
            Tối đa 5 ảnh, mỗi ảnh không quá 2MB
          </Text>
        </Form.Item>

        <Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Gửi yêu cầu
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReturnRequestModal
