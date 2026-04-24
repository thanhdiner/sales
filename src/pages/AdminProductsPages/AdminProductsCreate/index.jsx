import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import TiptapEditor from '@/components/TiptapEditor'
import { useAdminProductCreate } from '../hooks/useAdminProductCreate'

const { RangePicker } = DatePicker

const initialValues = {
  status: 'active',
  discountPercentage: 0,
  stock: 0,
  deliveryEstimateDays: 0,
  images: []
}

const CreateProductPage = () => {
  const { form, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate } =
    useAdminProductCreate()

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Form.Item name="title" label={<span className="dark:text-gray-300">Tên sản phẩm</span>} rules={[{ required: true }]}>
              <Input
                className="dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Nhập tên sản phẩm"
              />
            </Form.Item>

            <Form.Item name="productCategory" label={<span className="dark:text-gray-300">Danh mục</span>} rules={[{ required: true }]}>
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

            <Form.Item name="price" label={<span className="dark:text-gray-300">Giá bán (VNĐ)</span>} rules={[{ required: true }]}>
              <InputNumber placeholder="Nhập giá bán" style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              name="costPrice"
              label={<span className="dark:text-gray-300">Giá nhập (VNĐ)</span>}
              rules={[{ required: true, message: 'Vui lòng nhập giá nhập hàng!' }]}
            >
              <InputNumber placeholder="Nhập giá nhập hàng" style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="discountPercentage" label={<span className="dark:text-gray-300">Giảm giá (%)</span>}>
              <InputNumber style={{ width: '100%' }} min={0} max={100} />
            </Form.Item>

            <Form.Item name="stock" label={<span className="dark:text-gray-300">Tồn kho</span>}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              name="deliveryEstimateDays"
              label={<span className="dark:text-gray-300">Dự kiến giao sau</span>}
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

          <Col xs={24} lg={12}>
            <Form.Item name="status" label={<span className="dark:text-gray-300">Trạng thái</span>}>
              <Select
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' }
                ]}
              />
            </Form.Item>

            <Form.Item name="position" label={<span className="dark:text-gray-300">Vị trí</span>}>
              <InputNumber placeholder="Nhập vị trí hoặc bỏ trống để tự động tạo" style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="slug" label={<span className="dark:text-gray-300">Slug URL</span>}>
              <Input
                className="dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                placeholder="Tự động tạo từ tên sản phẩm hoặc tự nhập"
              />
            </Form.Item>

            <Form.Item name="timeRange" label={<span className="dark:text-gray-300">Thời gian khuyến mãi</span>}>
              <RangePicker
                className="dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                showTime
              />
            </Form.Item>

            <Form.Item label={<span className="dark:text-gray-300">Tuỳ chọn</span>}>
              <Row gutter={16}>
                <Col>
                  <Form.Item name="isTopDeal" valuePropName="checked" noStyle>
                    <Checkbox className="dark:text-gray-300">Top Deal</Checkbox>
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                    <Checkbox className="dark:text-gray-300">Sản phẩm nổi bật</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label={<span className="dark:text-gray-300">Ảnh đại diện</span>}
              valuePropName="fileList"
              getValueFromEvent={getFileListFromEvent}
              rules={[{ required: true, message: 'Vui lòng upload ảnh đại diện!' }]}
              extra={<span className="text-xs text-gray-400">Ảnh chính hiển thị ở card sản phẩm.</span>}
            >
              <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
                <div>
                  <PlusOutlined />
                  <div className="mt-2 dark:text-gray-300">Thêm ảnh</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="images"
              label={<span className="dark:text-gray-300">Ảnh mẫu sản phẩm</span>}
              valuePropName="fileList"
              getValueFromEvent={getFileListFromEvent}
              extra={<span className="text-xs text-gray-400">Có thể upload nhiều ảnh để hiển thị trong trang chi tiết.</span>}
            >
              <Upload
                listType="picture-card"
                multiple
                maxCount={12}
                accept="image/*"
                beforeUpload={beforeUploadImage}
              >
                <div>
                  <PlusOutlined />
                  <div className="mt-2 dark:text-gray-300">Thêm ảnh</div>
                </div>
              </Upload>
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
                      <div key={key} className="mb-2 flex items-center gap-2">
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[{ required: true, message: 'Nhập tính năng!' }]}
                          style={{ flex: 1, marginBottom: 0 }}
                        >
                          <Input
                            placeholder={`Tính năng #${name + 1}`}
                            className="dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                          />
                        </Form.Item>

                        <Button danger type="text" onClick={() => remove(name)}>
                          Xoá
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      className="dark:bg-gray-900 dark:text-gray-100 dark:hover:!bg-gray-800"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm tính năng
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label={<span className="dark:text-gray-300">Mô tả ngắn</span>}>
              <TiptapEditor />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="content" label={<span className="dark:text-gray-300">Nội dung chi tiết</span>}>
              <TiptapEditor />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button onClick={() => navigate('/admin/products')} disabled={loading} style={{ marginRight: 8 }}>
            Huỷ
          </Button>

          <Button type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ width: 130 }}>
            {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default CreateProductPage