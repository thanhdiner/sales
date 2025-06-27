import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd'
import { createProduct } from '../../../services/productService'
import { message } from 'antd'

const { RangePicker } = DatePicker

const initialValues = {
  status: 'active',
  discountPercentage: 0,
  stock: 0
}

const CreateProductPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async values => {
    setLoading(true)

    const [timeStart, timeFinish] = values.timeRange || []
    const payload = {
      ...values,
      timeStart: timeStart?.toISOString() || null,
      timeFinish: timeFinish?.toISOString() || null
    }

    try {
      await createProduct(payload)
      navigate('/admin/products&categories/products')
      message.success('🎉 Product created successfully!')
    } catch (err) {
      message.error('❌ Failed to create product!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="productCategory" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price (VNĐ)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="discountPercentage" label="Discount Percentage (%)">
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="thumbnail" label="Thumbnail (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
            />
          </Form.Item>
          <Form.Item name="position" label="Position">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="slug" label="Slug URL">
            <Input />
          </Form.Item>
          <Form.Item name="timeRange" label="Promotion Time Range">
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button onClick={() => navigate('/admin/products&categories/products')} disabled={loading} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ width: 120 }}>
          {loading ? 'Creating...' : 'Create Product'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateProductPage
