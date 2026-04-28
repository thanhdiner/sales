import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { Text } = Typography
const { TextArea } = Input

const ReturnRequestModal = ({ open, onClose, reasons = [] }) => {
  const { t } = useTranslation('clientReturnPolicy')
  const [form] = Form.useForm()

  const handleSubmit = values => {
    console.log('Return request:', values)
    Modal.success({
      title: t('requestModal.successTitle'),
      content: t('requestModal.successContent'),
    })
    form.resetFields()
    onClose()
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal title={t('requestModal.title')} open={open} onCancel={handleCancel} footer={null} width={700}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="orderNumber"
              label={t('requestModal.orderNumberLabel')}
              rules={[{ required: true, message: t('requestModal.orderNumberRequired') }]}
            >
              <Input placeholder={t('requestModal.orderNumberPlaceholder')} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label={t('requestModal.emailLabel')}
              rules={[
                { required: true, message: t('requestModal.emailRequired') },
                { type: 'email', message: t('requestModal.emailInvalid') },
              ]}
            >
              <Input placeholder={t('requestModal.emailPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="reason"
          label={t('requestModal.reasonLabel')}
          rules={[{ required: true, message: t('requestModal.reasonRequired') }]}
        >
          <Select
            placeholder={t('requestModal.reasonPlaceholder')}
            options={reasons.map(reason => ({
              value: reason.value,
              label: reason.label,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('requestModal.descriptionLabel')}
          rules={[{ required: true, message: t('requestModal.descriptionRequired') }]}
        >
          <TextArea rows={4} placeholder={t('requestModal.descriptionPlaceholder')} />
        </Form.Item>

        <Form.Item name="images" label={t('requestModal.imagesLabel')}>
          <Upload listType="picture" multiple beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>{t('requestModal.uploadButton')}</Button>
          </Upload>
          <Text type="secondary" className="mt-1 block text-xs">
            {t('requestModal.uploadHint')}
          </Text>
        </Form.Item>

        <Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={handleCancel}>{t('requestModal.cancelButton')}</Button>
            <Button type="primary" htmlType="submit">
              {t('requestModal.submitButton')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReturnRequestModal
