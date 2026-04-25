import { Form, Input, Modal, Switch } from 'antd'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import { adminPermissionGroupInitialValues } from '../utils'

const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const primaryButtonClass = '!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'
const secondaryButtonClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'

export default function AdminPermissionGroupFormModal({
  form,
  modalVisible,
  editingGroup,
  submitLoading,
  closeModal,
  handleSubmit,
  handleLabelChange
}) {
  const { bodyStyle, contentRef } = useModalBodyScroll(modalVisible)

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-[var(--admin-text)]">
          {editingGroup ? 'Chỉnh sửa nhóm quyền' : 'Thêm nhóm quyền'}
        </span>
      }
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText={editingGroup ? 'Lưu' : 'Tạo'}
      cancelText="Hủy"
      destroyOnClose
      confirmLoading={submitLoading}
      centered
      styles={{ body: bodyStyle }}
      className="admin-permission-group-modal"
      okButtonProps={{
        className: `rounded-lg font-medium ${primaryButtonClass}`
      }}
      cancelButtonProps={{
        className: `rounded-lg ${secondaryButtonClass}`
      }}
    >
      <div ref={contentRef}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={adminPermissionGroupInitialValues}
          onFinish={handleSubmit}
          className="[&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
        >
          <Form.Item
            label="Tên nhóm"
            name="label"
            rules={[
              { required: true, message: 'Vui lòng nhập tên nhóm' },
              { min: 3, message: 'Tên nhóm phải có ít nhất 3 ký tự' }
            ]}
          >
            <Input placeholder="Ví dụ: Quản lý sản phẩm" className={inputClass} onChange={handleLabelChange} />
          </Form.Item>

          <Form.Item
            label="Mã nhóm"
            name="value"
            rules={[
              { required: true, message: 'Vui lòng nhập mã nhóm' },
              { pattern: /^[a-z0-9_]+$/, message: 'Chỉ dùng a-z, 0-9 và dấu _' }
            ]}
          >
            <Input placeholder="Ví dụ: product" disabled={!!editingGroup} className={inputClass} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description" rules={[{ max: 300, message: 'Mô tả tối đa 300 ký tự' }]}>
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về nhóm quyền" className={inputClass} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
