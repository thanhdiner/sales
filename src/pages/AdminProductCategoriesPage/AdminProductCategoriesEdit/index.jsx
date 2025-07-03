import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, InputNumber, Row, Select, Upload, message } from 'antd'
import { updateProductCategoryById } from '../../../services/productCategoryService'
import { PlusOutlined } from '@ant-design/icons'
import TiptapEditor from '../../../components/TiptapEditor'
import { getProductCategoryById } from '../../../services/productCategoryService'

function AdminProductCategoriesEdit() {
  const [loading, setLoading] = useState(false)
  const [oldThumbnail, setOldThumbnail] = useState('')
  const [form] = Form.useForm()
  const { id } = useParams()
  const navigate = useNavigate()

  const pathNavigate = '/admin/product-categories'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { productCategory } = await getProductCategoryById(id)
        if (!productCategory) throw new Error('Not found')

        if (productCategory.thumbnail) setOldThumbnail(productCategory.thumbnail)

        form.setFieldsValue({
          ...productCategory,
          thumbnail: [
            {
              uid: '-1',
              name: 'current-image.jpg',
              status: 'done',
              url: productCategory.thumbnail
            }
          ]
        })
      } catch (err) {
        message.error('❌ Failed to load product category')
        navigate(pathNavigate)
      }
    }

    fetchProduct()
  }, [id, form, navigate])

  const handleSubmit = async values => {
    setLoading(true)
    try {
      const formData = new FormData()
      const file = values.thumbnail?.[0]?.originFileObj

      if (file) {
        formData.append('thumbnail', file)
        formData.append('oldThumbnail', oldThumbnail)
      } else if (typeof values.thumbnail === 'string') formData.append('thumbnail', values.thumbnail)

      formData.append('title', values.title)
      formData.append('parent_id', values.parent_id || '')
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('position', values?.position)
      formData.append('slug', values.slug || '')

      await updateProductCategoryById(id, formData)
      message.success('✅ Product updated successfully!')
      navigate(pathNavigate)
    } catch (err) {
      console.error(err)
      message.error('❌ Failed to update product catgory!')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parent_id" label="Parent ID">
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug URL">
            <Input />
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
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label="Short Description">
            <TiptapEditor value={form.getFieldValue('description')} onChange={value => form.setFieldsValue({ description: value })} />
          </Form.Item>
        </Col>
        <Col span={24}></Col>
        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label="Thumbnail (URL)"
            valuePropName="fileList"
            getValueFromEvent={e => {
              if (Array.isArray(e)) return e
              return e?.fileList || []
            }}
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
        <Button onClick={() => navigate(pathNavigate)} disabled={loading} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: 140 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AdminProductCategoriesEdit
