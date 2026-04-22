import { Form, Input, Modal, Select } from 'antd'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import { adminPermissionInitialValues } from '../utils'

export default function AdminPermissionFormModal({
  form,
  modalVisible,
  editingPermission,
  submitLoading,
  permissionGroups,
  closeModal,
  handleSubmit,
  handleTitleChange
}) {
  const { bodyStyle, contentRef } = useModalBodyScroll(modalVisible)

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {editingPermission ? 'Chỉnh sửa quyền' : 'Thêm quyền'}
        </span>
      }
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText={editingPermission ? 'Lưu' : 'Tạo'}
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
          initialValues={adminPermissionInitialValues}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên quyền"
            name="title"
            rules={[
              { required: true, message: 'Vui lòng nhập tên quyền' },
              { min: 3, message: 'Tên quyền phải có ít nhất 3 ký tự' }
            ]}
          >
            <Input
              placeholder="Ví dụ: Xem sản phẩm"
              className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
              onChange={handleTitleChange}
            />
          </Form.Item>

          <Form.Item
            label="Mã quyền"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập mã quyền' },
              { min: 3, message: 'Mã quyền phải có ít nhất 3 ký tự' },
              { pattern: /^[a-z0-9_]+$/, message: 'Chỉ dùng a-z, 0-9 và dấu _' }
            ]}
          >
            <Input
              placeholder="Ví dụ: view_products"
              disabled={!!editingPermission}
              className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả ngắn về quyền"
              className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item label="Nhóm quyền" name="group" rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền' }]}>
            <Select
              getPopupContainer={trigger => trigger.parentElement}
              dropdownStyle={{ zIndex: 1238 }}
              placeholder="Chọn nhóm quyền"
              options={permissionGroups}
              allowClear
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
