import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import TiptapEditor from '@/components/TiptapEditor'
import { getAdminProductCategoryTree } from '@/services/productCategoryService'
import { getProductById, updateProductById } from '@/services/productService'

const { RangePicker } = DatePicker

const getFileListFromEvent = e => {
  if (Array.isArray(e)) return e
  return e?.fileList || []
}

const toUploadFileList = (urls = [], prefix = 'image') =>
  (Array.isArray(urls) ? urls : [])
    .filter(Boolean)
    .map((url, index) => ({
      uid: `existing-${prefix}-${index}`,
      name: `${prefix}-${index + 1}.jpg`,
      status: 'done',
      url
    }))

const getExistingImageUrl = file => {
  if (!file || file.originFileObj) return ''
  return file.url || file.thumbUrl || ''
}

const beforeUploadImage = file => {
  const isImage = file?.type?.startsWith('image/')

  if (!isImage) {
    message.error('You can only upload image files!')
    return Upload.LIST_IGNORE
  }

  return false
}

function AdminProductsEdit() {
  const [loading, setLoading] = useState(false)
  const [oldThumbnail, setOldThumbnail] = useState('')
  const [oldImages, setOldImages] = useState([])
  const [treeData, setTreeData] = useState([])
  const [form] = Form.useForm()
  const { id } = useParams()
  const navigate = useNavigate()

  const pathNavigate = '/admin/products'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { product } = await getProductById(id)

        if (!product) throw new Error('Not found')

        if (product.thumbnail) {
          setOldThumbnail(product.thumbnail)
        }

        setOldImages(Array.isArray(product.images) ? product.images : [])

        form.setFieldsValue({
          ...product,
          thumbnail: toUploadFileList(product.thumbnail ? [product.thumbnail] : [], 'thumbnail'),
          images: toUploadFileList(product.images || [], 'image'),
          timeRange: product.timeStart && product.timeFinish ? [dayjs(product.timeStart), dayjs(product.timeFinish)] : []
        })
      } catch (err) {
        message.error('Failed to load product')
        navigate(pathNavigate)
      }
    }

    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()

        if (response) {
          setTreeData(response)
        }
      } catch (error) {
        message.error('Failed to load category tree data')
      }
    }

    fetchProduct()
    fetchTreeData()
  }, [form, id, navigate])

  const handleSubmit = async values => {
    setLoading(true)

    try {
      const formData = new FormData()
      const file = values.thumbnail?.[0]?.originFileObj

      if (file) {
        formData.append('thumbnail', file)
        formData.append('oldImage', oldThumbnail)
      } else if (typeof values.thumbnail === 'string') {
        formData.append('thumbnail', values.thumbnail)
      }

      const imageFileList = values.images || []
      const existingImages = imageFileList.map(getExistingImageUrl).filter(Boolean)
      const deletedImages = oldImages.map(url => !existingImages.includes(url))

      imageFileList.forEach(fileItem => {
        const imageFile = fileItem.originFileObj

        if (imageFile) {
          formData.append('images', imageFile)
        }
      })

      formData.append('existingImages', JSON.stringify(existingImages))
      formData.append('oldImages', JSON.stringify(oldImages))
      formData.append('deleteImages', JSON.stringify(deletedImages))

      if (values.features) {
        if (values.features.length > 0) {
          values.features.forEach(feature => formData.append('features', feature))
        } else {
          formData.append('features', '')
        }
      }

      formData.append('title', values.title)
      formData.append('productCategory', values.productCategory)
      formData.append('price', values.price)
      formData.append('costPrice', values.costPrice)
      formData.append('discountPercentage', values.discountPercentage || 0)
      formData.append('stock', values.stock || 0)
      formData.append('description', values.description || '')
      formData.append('status', values.status || 'active')
      formData.append('slug', values.slug || '')
      formData.append('content', values.content || '')
      formData.append('isTopDeal', values.isTopDeal ? 'true' : 'false')
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false')

      if (values.position !== undefined && values.position !== null && values.position !== '') {
        formData.append('position', values.position)
      }

      const [timeStart, timeFinish] = values.timeRange || []

      if (timeStart) formData.append('timeStart', timeStart.toISOString())
      if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())

      await updateProductById(id, formData)

      message.success('Product updated successfully!')
      navigate(pathNavigate)
    } catch (err) {
      const response = err?.response || {}

      console.error(err)

      if (response?.error === 'Slug already exists') {
        message.error(`Slug already exists, please choose another one. Suggested: ${response.suggestedSlug || ''}`)

        if (response.suggestedSlug) {
          form.setFieldsValue({ slug: response.suggestedSlug })
        }
      } else if (response?.details?.length) {
        message.error(response.details.join(' | '))
      } else {
        message.error(response?.error || response?.message || 'Failed to update product')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label={<span className="dark:text-gray-300">Product Name</span>} rules={[{ required: true }]}>
            <Input className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
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
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="costPrice"
            label={<span className="dark:text-gray-300">Cost Price (VNĐ)</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập giá gốc (costPrice)!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === undefined || value < 0) return Promise.reject('Giá gốc phải lớn hơn hoặc bằng 0!')
                  if (getFieldValue('price') !== undefined && value > getFieldValue('price')) {
                    return Promise.reject('Giá nhập không được lớn hơn giá bán!')
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <InputNumber placeholder="Nhập giá nhập hàng" style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="discountPercentage" label={<span className="dark:text-gray-300">Discount Percentage (%)</span>}>
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>

          <Form.Item name="stock" label={<span className="dark:text-gray-300">Stock</span>}>
            <InputNumber style={{ width: '100%' }} min={0} />
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
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="slug" label={<span className="dark:text-gray-300">Slug URL</span>}>
            <Input className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
          </Form.Item>

          <Form.Item name="timeRange" label={<span className="dark:text-gray-300">Promotion Time Range</span>}>
            <RangePicker className="w-full dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" format="YYYY-MM-DD" showTime />
          </Form.Item>

          <Form.Item label={<span className="dark:text-gray-300">Options</span>}>
            <Row gutter={16}>
              <Col>
                <Form.Item name="isTopDeal" valuePropName="checked" noStyle>
                  <Checkbox className="dark:text-gray-300 !p-[4px_2px]">Top Deal</Checkbox>
                </Form.Item>
              </Col>

              <Col>
                <Form.Item name="isFeatured" valuePropName="checked" noStyle>
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
                    <div key={key} className="mb-2 flex items-center">
                      <Form.Item {...restField} name={name} style={{ flex: 1, marginBottom: 0 }}>
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
            <TiptapEditor value={form.getFieldValue('description')} onChange={value => form.setFieldsValue({ description: value })} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="content" label={<span className="dark:text-gray-300">Content</span>}>
            <TiptapEditor value={form.getFieldValue('content')} onChange={value => form.setFieldsValue({ content: value })} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label={<span className="dark:text-gray-300">Thumbnail</span>}
            valuePropName="fileList"
            getValueFromEvent={getFileListFromEvent}
            rules={[{ required: true, message: 'Please upload an image!' }]}
          >
            <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
              <div>
                <PlusOutlined />
                <div className="mt-2 dark:text-gray-300">Add Image</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="images"
            label={<span className="dark:text-gray-300">Ảnh mẫu sản phẩm</span>}
            valuePropName="fileList"
            getValueFromEvent={getFileListFromEvent}
          >
            <Upload listType="picture-card" multiple maxCount={12} accept="image/*" beforeUpload={beforeUploadImage}>
              <div>
                <PlusOutlined />
                <div className="mt-2 dark:text-gray-300">Add Image</div>
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

export default AdminProductsEdit
