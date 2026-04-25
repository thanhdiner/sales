import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import TiptapEditor from '@/components/TiptapEditor'
import ProductCredentialManager from '../components/ProductCredentialManager'
import { useAdminProductEdit } from '../hooks/useAdminProductEdit'
import './AdminProductsEdit.scss'

const { RangePicker } = DatePicker

function AdminProductsEdit() {
  const { form, id, loading, treeData, handleSubmit, getFileListFromEvent, beforeUploadImage, navigate, pathNavigate } =
    useAdminProductEdit()
  const deliveryType = Form.useWatch('deliveryType', form)

  return (
    <section className="admin-product-edit">
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="admin-product-edit__form">
        <div className="admin-product-edit__card">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item name="title" label={<span className="admin-product-edit__label">Tên sản phẩm</span>} rules={[{ required: true }]}>
                <Input className="admin-product-edit__input" placeholder="Nhập tên sản phẩm" />
              </Form.Item>

              <Form.Item name="productCategory" label={<span className="admin-product-edit__label">Danh mục</span>} rules={[{ required: true }]}>
                <TreeSelect
                  className="admin-product-edit__select"
                  popupClassName="admin-product-edit-popup"
                  dropdownClassName="admin-product-edit-popup"
                  treeData={treeData}
                  placeholder="Chọn danh mục sản phẩm"
                  treeDefaultExpandAll
                  allowClear
                  showSearch
                  filterTreeNode={(input, treeNode) => treeNode.title.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item name="price" label={<span className="admin-product-edit__label">Giá bán (VNĐ)</span>} rules={[{ required: true }]}>
                <InputNumber className="admin-product-edit__input-number" placeholder="Nhập giá bán" min={0} />
              </Form.Item>

              <Form.Item
                name="costPrice"
                label={<span className="admin-product-edit__label">Giá nhập (VNĐ)</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập giá nhập hàng!' },
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
                <InputNumber className="admin-product-edit__input-number" placeholder="Nhập giá nhập hàng" min={0} />
              </Form.Item>

              <Form.Item name="discountPercentage" label={<span className="admin-product-edit__label">Giảm giá (%)</span>}>
                <InputNumber className="admin-product-edit__input-number" min={0} max={100} />
              </Form.Item>

              <Form.Item name="stock" label={<span className="admin-product-edit__label">Tồn kho</span>}>
                <InputNumber className="admin-product-edit__input-number" min={0} disabled={deliveryType === 'instant_account'} />
              </Form.Item>

              <Form.Item name="deliveryType" label={<span className="admin-product-edit__label">Kiểu giao hàng</span>}>
                <Select
                  className="admin-product-edit__select"
                  popupClassName="admin-product-edit-popup"
                  onChange={value => {
                    if (value === 'instant_account') form.setFieldsValue({ stock: 0 })
                  }}
                  options={[
                    { label: 'Giao thủ công', value: 'manual' },
                    { label: 'Giao tài khoản ngay trên web', value: 'instant_account' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="deliveryInstructions" label={<span className="admin-product-edit__label">Hướng dẫn bàn giao</span>}>
                <Input.TextArea
                  className="admin-product-edit__textarea"
                  rows={3}
                  placeholder="Ví dụ: Đăng nhập bằng tài khoản bên dưới và đổi mật khẩu sau khi nhận."
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item name="status" label={<span className="admin-product-edit__label">Trạng thái</span>}>
                <Select
                  className="admin-product-edit__select"
                  popupClassName="admin-product-edit-popup"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="position" label={<span className="admin-product-edit__label">Vị trí</span>}>
                <InputNumber className="admin-product-edit__input-number" placeholder="Nhập vị trí hoặc bỏ trống để tự động tạo" min={0} />
              </Form.Item>

              <Form.Item name="slug" label={<span className="admin-product-edit__label">Slug URL</span>}>
                <Input className="admin-product-edit__input" placeholder="Tự động tạo từ tên sản phẩm hoặc tự nhập" />
              </Form.Item>

              <Form.Item name="timeRange" label={<span className="admin-product-edit__label">Thời gian khuyến mãi</span>}>
                <RangePicker className="admin-product-edit__picker" popupClassName="admin-product-edit-picker-popup" format="YYYY-MM-DD" showTime />
              </Form.Item>

              <Form.Item label={<span className="admin-product-edit__label">Tuỳ chọn</span>}>
                <Row gutter={16}>
                  <Col>
                    <Form.Item name="isTopDeal" valuePropName="checked" noStyle>
                      <Checkbox className="admin-product-edit__checkbox">Top Deal</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                      <Checkbox className="admin-product-edit__checkbox">Sản phẩm nổi bật</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span className="admin-product-edit__label">Tính năng nổi bật</span>}>
                <Form.List name="features">
                  {(fields, { add, remove }) => (
                    <div className="admin-product-edit__features">
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="admin-product-edit__feature-row">
                          <Form.Item {...restField} name={name} style={{ flex: 1, marginBottom: 0 }}>
                            <Input className="admin-product-edit__input" placeholder={`Tính năng #${name + 1}`} />
                          </Form.Item>

                          <Button danger type="text" className="admin-product-edit__remove-feature-btn" onClick={() => remove(name)}>
                            Xóa
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        className="admin-product-edit__add-feature-btn"
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
              <Form.Item name="description" label={<span className="admin-product-edit__label">Mô tả ngắn</span>}>
                <div className="admin-product-edit__editor">
                  <TiptapEditor
                    value={form.getFieldValue('description')}
                    onChange={value => form.setFieldsValue({ description: value })}
                  />
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="content" label={<span className="admin-product-edit__label">Nội dung chi tiết</span>}>
                <div className="admin-product-edit__editor">
                  <TiptapEditor value={form.getFieldValue('content')} onChange={value => form.setFieldsValue({ content: value })} />
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="thumbnail"
                label={<span className="admin-product-edit__label">Ảnh đại diện</span>}
                valuePropName="fileList"
                getValueFromEvent={getFileListFromEvent}
                rules={[{ required: true, message: 'Vui lòng upload ảnh đại diện!' }]}
                extra={<span className="admin-product-edit__hint">Ảnh chính hiển thị ở card sản phẩm.</span>}
              >
                <Upload className="admin-product-edit__upload" listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
                  <div className="admin-product-edit__upload-trigger">
                    <PlusOutlined />
                    <div className="admin-product-edit__upload-text">Thêm ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="images"
                label={<span className="admin-product-edit__label">Ảnh mẫu sản phẩm</span>}
                valuePropName="fileList"
                getValueFromEvent={getFileListFromEvent}
                extra={<span className="admin-product-edit__hint">Có thể upload nhiều ảnh để hiển thị trong trang chi tiết.</span>}
              >
                <Upload
                  className="admin-product-edit__upload"
                  listType="picture-card"
                  multiple
                  maxCount={12}
                  accept="image/*"
                  beforeUpload={beforeUploadImage}
                >
                  <div className="admin-product-edit__upload-trigger">
                    <PlusOutlined />
                    <div className="admin-product-edit__upload-text">Thêm ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <ProductCredentialManager productId={id} enabled={deliveryType === 'instant_account'} />

          <Form.Item className="admin-product-edit__actions">
            <Button className="admin-product-edit__btn admin-product-edit__btn--cancel" onClick={() => navigate(pathNavigate)} disabled={loading}>
              Huỷ
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="admin-product-edit__btn admin-product-edit__btn--submit"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </section>
  )
}

export default AdminProductsEdit
