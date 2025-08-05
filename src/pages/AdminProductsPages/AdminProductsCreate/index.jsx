import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload, Checkbox, message } from 'antd'
import { createProduct } from '@/services/productService'
import { PlusOutlined } from '@ant-design/icons'
import TiptapEditor from '@/components/TiptapEditor'
import { getAdminProductCategoryTree } from '@/services/productCategoryService'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'
import titles from '@/utils/titles'

const { RangePicker } = DatePicker

const initialValues = {
  status: 'active',
  discountPercentage: 0,
  stock: 0,
  deliveryEstimateDays: 0
}

const CreateProductPage = () => {
  titles('Tạo sản phẩm mới')

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

      if (values.features && values.features.length > 0) {
        values.features.forEach(f => formData.append('features', f))
      }

      formData.append('title', values.title)
      const titleNoAccent = removeVietnameseTones(values.title)
      formData.append('titleNoAccent', titleNoAccent)
      formData.append('productCategory', values.productCategory)
      formData.append('price', values.price)
      formData.append('costPrice', values.costPrice)
      formData.append('discountPercentage', values.discountPercentage || 0)
      formData.append('stock', values.stock || 0)
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('position', values?.position)
      formData.append('slug', values.slug || '')
      formData.append('content', values.content || '')
      formData.append('isTopDeal', values.isTopDeal ? 'true' : 'false')
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false')
      formData.append('deliveryEstimateDays', values.deliveryEstimateDays || 0)

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
          <Form.Item name="title" label={<span className="dark:text-gray-300">Product Name</span>} rules={[{ required: true }]}>
            <Input
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
              placeholder="Nhập tên sản phẩm"
            />
          </Form.Item>
          <Form.Item name="productCategory" label={<span className="dark:text-gray-300">Category</span>} rules={[{ required: true }]}>
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
          <Form.Item name="price" label={<span className="dark:text-gray-300">Price (VNĐ)</span>} rules={[{ required: true }]}>
            <InputNumber placeholder="Nhập giá bán" style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="costPrice"
            label={<span className="dark:text-gray-300">Cost Price (VNĐ)</span>}
            rules={[{ required: true, message: 'Vui lòng nhập giá gốc (costPrice)!' }]}
          >
            <InputNumber placeholder="Nhập giá nhập hàng" style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="discountPercentage" label={<span className="dark:text-gray-300">Discount Percentage (%)</span>}>
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="stock" label={<span className="dark:text-gray-300">Stock</span>}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="deliveryEstimateDays"
            label={<span className="dark:text-gray-300">Dự kiến giao sau (ngày)</span>}
            rules={[{ required: true, message: 'Vui lòng chọn số ngày giao dự kiến!' }]}
          >
            <Select style={{ width: '100%' }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(day => (
                <Select.Option value={day} key={day}>
                  {day} ngày
                </Select.Option>
              ))}
            </Select>
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
            <InputNumber placeholder="Nhập vị trí hoặc bỏ trống để tự động tạo" style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="slug" label={<span className="dark:text-gray-300">Slug URL</span>}>
            <Input
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
              placeholder="Tự động tạo từ Product Name hoặc bạn có thể sửa"
            />
          </Form.Item>
          <Form.Item name="timeRange" label={<span className="dark:text-gray-300">Promotion Time Range</span>}>
            <RangePicker
              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              showTime
            />
          </Form.Item>
          <Form.Item label={<span className="dark:text-gray-300">Options</span>}>
            <Row gutter={16}>
              <Col>
                <Form.Item name="isTopDeal" valuePropName="checked" noStyle style={{ marginBottom: 0, paddingTop: 2 }}>
                  <Checkbox className="dark:text-gray-300 !p-[4px_2px]">Top Deal</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="isFeatured" valuePropName="checked" noStyle style={{ marginBottom: 0, paddingTop: 2 }}>
                  <Checkbox className="dark:text-gray-300 !p-[4px_2px]">Sản phẩm nổi bật</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={<span className="dark:text-gray-300">Tính năng nổi bật</span>}>
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-center mb-2">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: 'Nhập tính năng!' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder={`Tính năng #${name + 1}`} />
                      </Form.Item>
                      <Button danger type="text" onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm tính năng
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="description" label={<span className="dark:text-gray-300">Short Description</span>}>
            <TiptapEditor />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="content" label={<span className="dark:text-gray-300">Content</span>}>
            <TiptapEditor />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label={<span className="dark:text-gray-300">Thumbnail</span>}
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
