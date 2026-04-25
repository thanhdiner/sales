import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import TiptapEditor from '@/components/TiptapEditor'
import { useAdminProductCreate } from '../hooks/useAdminProductCreate'
import './AdminProductsCreate.scss'

const { RangePicker } = DatePicker

const initialValues = {
  status: 'active',
  discountPercentage: 0,
  stock: 0,
  deliveryEstimateDays: 0,
  deliveryType: 'manual',
  deliveryInstructions: '',
  images: []
}

function CreateProductPage() {
  const { form, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate } =
    useAdminProductCreate()
  const deliveryType = Form.useWatch('deliveryType', form)

  return (
    <section className="admin-product-create">
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit} className="admin-product-create__form">
        <div className="admin-product-create__card">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item name="title" label={<span className="admin-product-create__label">Tên sản phẩm</span>} rules={[{ required: true }]}>
                <Input className="admin-product-create__input" placeholder="Nhập tên sản phẩm" />
              </Form.Item>

              <Form.Item name="productCategory" label={<span className="admin-product-create__label">Danh mục</span>} rules={[{ required: true }]}>
                <TreeSelect
                  className="admin-product-create__select"
                  popupClassName="admin-product-create-popup"
                  dropdownClassName="admin-product-create-popup"
                  treeData={treeData}
                  placeholder="Chọn danh mục sản phẩm"
                  treeDefaultExpandAll
                  allowClear
                  showSearch
                  filterTreeNode={(input, treeNode) => treeNode.title.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item name="price" label={<span className="admin-product-create__label">Giá bán (VNĐ)</span>} rules={[{ required: true }]}>
                <InputNumber className="admin-product-create__input-number" placeholder="Nhập giá bán" min={0} />
              </Form.Item>

              <Form.Item
                name="costPrice"
                label={<span className="admin-product-create__label">Giá nhập (VNĐ)</span>}
                rules={[{ required: true, message: 'Vui lòng nhập giá nhập hàng!' }]}
              >
                <InputNumber className="admin-product-create__input-number" placeholder="Nhập giá nhập hàng" min={0} />
              </Form.Item>

              <Form.Item name="discountPercentage" label={<span className="admin-product-create__label">Giảm giá (%)</span>}>
                <InputNumber className="admin-product-create__input-number" min={0} max={100} />
              </Form.Item>

              <Form.Item name="stock" label={<span className="admin-product-create__label">Tồn kho</span>}>
                <InputNumber className="admin-product-create__input-number" min={0} disabled={deliveryType === 'instant_account'} />
              </Form.Item>

              <Form.Item name="deliveryType" label={<span className="admin-product-create__label">Kiểu giao hàng</span>}>
                <Select
                  className="admin-product-create__select"
                  popupClassName="admin-product-create-popup"
                  onChange={value => {
                    if (value === 'instant_account') form.setFieldsValue({ stock: 0 })
                  }}
                  options={[
                    { label: 'Giao thủ công', value: 'manual' },
                    { label: 'Giao tài khoản ngay trên web', value: 'instant_account' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="deliveryInstructions" label={<span className="admin-product-create__label">Hướng dẫn bàn giao</span>}>
                <Input.TextArea
                  className="admin-product-create__textarea"
                  rows={3}
                  placeholder="Ví dụ: Đăng nhập bằng tài khoản bên dưới và đổi mật khẩu sau khi nhận."
                />
              </Form.Item>

              <Form.Item
                name="deliveryEstimateDays"
                label={<span className="admin-product-create__label">Dự kiến giao sau</span>}
                rules={[{ required: true, message: 'Vui lòng chọn số ngày giao dự kiến!' }]}
              >
                <Select className="admin-product-create__select" popupClassName="admin-product-create-popup">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(day => (
                    <Select.Option value={day} key={day}>
                      {day} ngày
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item name="status" label={<span className="admin-product-create__label">Trạng thái</span>}>
                <Select
                  className="admin-product-create__select"
                  popupClassName="admin-product-create-popup"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="position" label={<span className="admin-product-create__label">Vị trí</span>}>
                <InputNumber
                  className="admin-product-create__input-number"
                  placeholder="Nhập vị trí hoặc bỏ trống để tự động tạo"
                  min={0}
                />
              </Form.Item>

              <Form.Item name="slug" label={<span className="admin-product-create__label">Slug URL</span>}>
                <Input
                  className="admin-product-create__input"
                  placeholder="Tự động tạo từ tên sản phẩm hoặc tự nhập"
                />
              </Form.Item>

              <Form.Item name="timeRange" label={<span className="admin-product-create__label">Thời gian khuyến mãi</span>}>
                <RangePicker
                  className="admin-product-create__picker"
                  popupClassName="admin-product-create-picker-popup"
                  format="YYYY-MM-DD"
                  showTime
                />
              </Form.Item>

              <Form.Item label={<span className="admin-product-create__label">Tùy chọn</span>}>
                <Row gutter={16}>
                  <Col>
                    <Form.Item name="isTopDeal" valuePropName="checked" noStyle>
                      <Checkbox className="admin-product-create__checkbox">Top Deal</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                      <Checkbox className="admin-product-create__checkbox">Sản phẩm nổi bật</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="thumbnail"
                label={<span className="admin-product-create__label">Ảnh đại diện</span>}
                valuePropName="fileList"
                getValueFromEvent={getFileListFromEvent}
                rules={[{ required: true, message: 'Vui lòng upload ảnh đại diện!' }]}
                extra={<span className="admin-product-create__hint">Ảnh chính hiển thị ở card sản phẩm.</span>}
              >
                <Upload className="admin-product-create__upload" listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
                  <div className="admin-product-create__upload-trigger">
                    <PlusOutlined />
                    <div className="admin-product-create__upload-text">Thêm ảnh</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                name="images"
                label={<span className="admin-product-create__label">Ảnh mẫu sản phẩm</span>}
                valuePropName="fileList"
                getValueFromEvent={getFileListFromEvent}
                extra={<span className="admin-product-create__hint">Có thể upload nhiều ảnh để hiển thị trong trang chi tiết.</span>}
              >
                <Upload className="admin-product-create__upload" listType="picture-card" multiple maxCount={12} accept="image/*" beforeUpload={beforeUploadImage}>
                  <div className="admin-product-create__upload-trigger">
                    <PlusOutlined />
                    <div className="admin-product-create__upload-text">Thêm ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span className="admin-product-create__label">Tính năng nổi bật</span>}>
                <Form.List name="features">
                  {(fields, { add, remove }) => (
                    <div className="admin-product-create__features">
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="admin-product-create__feature-row">
                          <Form.Item
                            {...restField}
                            name={name}
                            rules={[{ required: true, message: 'Nhập tính năng!' }]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <Input className="admin-product-create__input" placeholder={`Tính năng #${name + 1}`} />
                          </Form.Item>

                          <Button danger type="text" className="admin-product-create__remove-feature-btn" onClick={() => remove(name)}>
                            Xóa
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        className="admin-product-create__add-feature-btn"
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
              <Form.Item name="description" label={<span className="admin-product-create__label">Mô tả ngắn</span>}>
                <div className="admin-product-create__editor">
                  <TiptapEditor />
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="content" label={<span className="admin-product-create__label">Nội dung chi tiết</span>}>
                <div className="admin-product-create__editor">
                  <TiptapEditor />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="admin-product-create__actions">
            <Button
              className="admin-product-create__btn admin-product-create__btn--cancel"
              onClick={() => navigate('/admin/products')}
              disabled={loading}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="admin-product-create__btn admin-product-create__btn--submit"
            >
              {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </section>
  )
}

export default CreateProductPage
