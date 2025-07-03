import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import { createProduct } from '../../../services/productService'
import { message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TiptapEditor from '../../../components/TiptapEditor'
import { getAdminProductCategoryTree } from '../../../services/productCategoryService'

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
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(response)
      } catch (error) {
        message.error('❌ Failed to load category tree data')
      }
    }

    fetchTreeData()
  }, [])

  const handleSubmit = async values => {
    setLoading(true)

    try {
      const formData = new FormData()
      const file = values.thumbnail?.[0]?.originFileObj
      if (file) {
        formData.append('thumbnail', file)
      }

      formData.append('title', values.title)
      formData.append('productCategory', values.productCategory)
      formData.append('price', values.price)
      formData.append('discountPercentage', values.discountPercentage || 0)
      formData.append('stock', values.stock || 0)
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('position', values?.position)
      formData.append('slug', values.slug || '')
      formData.append('content', values.content || '')

      const [timeStart, timeFinish] = values.timeRange || []
      if (timeStart) formData.append('timeStart', timeStart.toISOString())
      if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())

      await createProduct(formData)

      message.success('🎉 Product created successfully!')
      navigate('/admin/products')
    } catch (err) {
      const response = err?.response || {}

      if (response?.error === 'Slug already exists') {
        message.error(`❌ Slug đã tồn tại, vui lòng chọn slug khác! Gợi ý: ${response.suggestedSlug || ''}`)
        if (response.suggestedSlug) form.setFieldsValue({ slug: response.suggestedSlug })
      } else message.error('❌ Failed to create product!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item name="productCategory" label="Category" rules={[{ required: true }]}>
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder="Chọn danh mục sản phẩm"
              treeDefaultExpandAll
              allowClear
              showSearch
              filterTreeNode={(input, treeNode) => treeNode.title.toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Form.Item name="price" label="Price (VNĐ)" rules={[{ required: true }]}>
            <InputNumber placeholder="Nhập giá bán" style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="discountPercentage" label="Discount Percentage (%)">
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
            />
          </Form.Item>
          <Form.Item name="position" label="Position">
            <InputNumber placeholder="Nhập vị trí hoặc bỏ trống để tự động tạo" style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="slug" label="Slug URL">
            <Input placeholder="Tự động tạo từ Product Name hoặc bạn có thể sửa" />
          </Form.Item>
          <Form.Item name="timeRange" label="Promotion Time Range">
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" showTime />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label="Short Description">
            <TiptapEditor />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="content" label="Content">
            <TiptapEditor />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label="Thumbnail (URL)"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={file => {
                const isImage = file.type.startsWith('image/')
                if (!isImage) message.error('You can only upload image files!')
                return isImage ? false : Upload.LIST_IGNORE
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Add Image</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button onClick={() => navigate('/admin/products')} disabled={loading} style={{ marginRight: 8 }}>
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
