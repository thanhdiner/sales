import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, InputNumber, Row, Select, TreeSelect, Upload } from 'antd'
import TiptapEditor from '@/components/TiptapEditor'
import { useAdminProductCategoryEdit } from '../hooks/useAdminProductCategoryEdit'

const labelClassName = 'text-[var(--admin-text-muted)]'
const inputClassName =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
const primaryButtonClass = 'rounded-lg !border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'

function AdminProductCategoriesEdit() {
  const { form, loading, treeData, handleSubmit, beforeUploadImage, getFileListFromEvent, navigate, pathNavigate } =
    useAdminProductCategoryEdit()

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label={<span className={labelClassName}>Tên danh mục</span>} rules={[{ required: true }]}>
            <Input
              className={inputClassName}
              placeholder="Nhập tên danh mục"
            />
          </Form.Item>
          <Form.Item name="parent_id" label={<span className={labelClassName}>Danh mục cha</span>}>
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
          <Form.Item name="slug" label={<span className={labelClassName}>Slug URL</span>}>
            <Input
              className={inputClassName}
              placeholder="Tự động tạo từ tên danh mục hoặc bạn có thể sửa"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="status" label={<span className={labelClassName}>Trạng thái</span>}>
            <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
            />
          </Form.Item>
          <Form.Item name="position" label={<span className={labelClassName}>Vị trí</span>}>
            <InputNumber placeholder="Nhập vị trí" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label={<span className={labelClassName}>Mô tả ngắn</span>}>
            <TiptapEditor value={form.getFieldValue('description')} onChange={value => form.setFieldsValue({ description: value })} />
          </Form.Item>
        </Col>
        <Col span={24}></Col>
        <Col span={24}>
          <Form.Item
            name="thumbnail"
            label={<span className={labelClassName}>Ảnh đại diện</span>}
            valuePropName="fileList"
            getValueFromEvent={getFileListFromEvent}
            rules={[{ required: true, message: 'Vui lòng upload ảnh đại diện!' }]}
          >
            <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={beforeUploadImage}>
              <div>
                <PlusOutlined />
                <div className="mt-2 text-[var(--admin-text-muted)]">Thêm ảnh</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button className={secondaryButtonClass} onClick={() => navigate(pathNavigate)} disabled={loading} style={{ marginRight: 8 }}>
          Huỷ
        </Button>
        <Button className={primaryButtonClass} type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ width: 130 }}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AdminProductCategoriesEdit
