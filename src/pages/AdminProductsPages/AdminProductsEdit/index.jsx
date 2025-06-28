import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, message } from 'antd'
import dayjs from 'dayjs'
import { getProductById, updateProductById } from '../../../services/productService'

const { RangePicker } = DatePicker

function AdminProductsEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const product = await getProductById(id)
        if (!product) throw new Error('Not found')

        form.setFieldsValue({
          ...product,
          timeRange: product.timeStart && product.timeFinish ? [dayjs(product.timeStart), dayjs(product.timeFinish)] : []
        })
      } catch (err) {
        message.error('❌ Failed to load product')
        navigate('/admin/products&categories/products')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, form, navigate])

  const handleSubmit = async values => {
    setLoading(true)
    const [timeStart, timeFinish] = values.timeRange || []
    const payload = {
      ...values,
      timeStart: timeStart?.toISOString() || null,
      timeFinish: timeFinish?.toISOString() || null
    }

    try {
      await updateProductById(id, payload)
      message.success('✅ Product updated successfully!')
      navigate('/admin/products&categories/products')
    } catch (err) {
      console.error(err)
      message.error('❌ Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" showTime />
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
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ width: 140 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AdminProductsEdit
