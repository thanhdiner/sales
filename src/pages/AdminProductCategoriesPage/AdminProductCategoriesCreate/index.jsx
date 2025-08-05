import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import { createProductCategory, getAdminProductCategoryTree } from '../../../services/productCategoryService'
import { message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TiptapEditor from '../../../components/TiptapEditor'
import titles from '@/utils/titles'

const initialValues = {
  status: 'active'
}

const AdminProductCategoriesCreate = () => {
  titles('Tạo danh mục sản phẩm')

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const navigate = useNavigate()

  const handleSubmit = async values => {
    setLoading(true)

    try {
      const formData = new FormData()
      const file = values.thumbnail?.[0]?.originFileObj
      if (file) formData.append('thumbnail', file)
      formData.append('title', values.title)
      formData.append('parent_id', values.parent_id || '')
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('position', values?.position)
      formData.append('slug', values.slug || '')

      await createProductCategory(formData)

      message.success('🎉 Product Category created successfully!')
      navigate('/admin/product-categories')
    } catch (err) {
      const response = err?.response || {}

      if (response?.error === 'Slug already exists') {
        message.error(`❌ Slug đã tồn tại, vui lòng chọn slug khác! Gợi ý: ${response.suggestedSlug || ''}`)
        if (response.suggestedSlug) form.setFieldsValue({ slug: response.suggestedSlug })
      } else message.error('❌ Failed to create product category!')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label={<span className="dark:text-gray-300">Category Name</span>} rules={[{ required: true }]}>
            <Input
              className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              placeholder="Category Name"
            />
          </Form.Item>
          <Form.Item name="parent_id" label={<span className="dark:text-gray-300">Parent Category</span>}>
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder="Chọn danh mục cha (nếu có)"
              treeDefaultExpandAll
              allowClear
              showSearch
              filterTreeNode={(input, treeNode) => treeNode.title.toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Form.Item name="slug" label={<span className="dark:text-gray-300">Slug URL</span>}>
            <Input
              className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              placeholder="Tự động tạo từ Category Name hoặc bạn có thể sửa"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="status" label={<span className="dark:text-gray-300">Status</span>}>
            <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
            />
          </Form.Item>
          <Form.Item name="position" label={<span className="dark:text-gray-300">Position</span>}>
            <InputNumber placeholder="Position" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label={<span className="dark:text-gray-300">Short Description</span>}>
            <TiptapEditor />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label={<span className="dark:text-gray-300">Thumbnail (URL)</span>}
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
                <div className="mt-2 dark:text-gray-300">Add Image</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button onClick={() => navigate('/admin/product-categories')} disabled={loading} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ width: 120 }}>
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AdminProductCategoriesCreate
