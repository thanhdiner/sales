import { Form, Input, Modal, Switch } from 'antd'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import {
  adminPermissionGroupInitialValues
} from '../utils'

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
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
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
      okButtonProps={{
        className: 'rounded-lg bg-gray-900 font-medium hover:!bg-gray-800'
      }}
      cancelButtonProps={{
        className: 'rounded-lg'
      }}
    >
      <div ref={contentRef}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={adminPermissionGroupInitialValues}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên nhóm"
            name="label"
            rules={[
              { required: true, message: 'Vui lòng nhập tên nhóm' },
              { min: 3, message: 'Tên nhóm phải có ít nhất 3 ký tự' }
            ]}
          >
            <Input
              placeholder="Ví dụ: Quản lý sản phẩm"
              className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
              onChange={handleLabelChange}
            />
          </Form.Item>

          <Form.Item
            label="Mã nhóm"
            name="value"
            rules={[
              { required: true, message: 'Vui lòng nhập mã nhóm' },
              { pattern: /^[a-z0-9_]+$/, message: 'Chỉ dùng a-z, 0-9 và dấu _' }
            ]}
          >
            <Input
              placeholder="Ví dụ: product"
              disabled={!!editingGroup}
              className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item label="Mô tả" name="description" rules={[{ max: 300, message: 'Mô tả tối đa 300 ký tự' }]}>
            <Input.TextArea
              rows={3}
              placeholder="Mô tả ngắn về nhóm quyền"
              className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
