import { Divider, Form, Input, InputNumber, Modal, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function AdminWidgetFormModal({
  form,
  modalVisible,
  editingWidget,
  submitLoading,
  fileList,
  closeModal,
  handleSubmit,
  handleUploadChange,
  handleBeforeUpload,
  handleRemoveUpload
}) {
  return (
    <Modal
      title={
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {editingWidget ? 'Chỉnh sửa Widget' : 'Thêm Widget mới'}
        </span>
      }
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
      style={{ top: 50, maxWidth: '95%' }}
      okButtonProps={{
        size: 'large',
        className: 'rounded-lg bg-gray-900 font-medium hover:!bg-gray-800'
      }}
      cancelButtonProps={{
        size: 'large',
        className: 'rounded-lg'
      }}
      confirmLoading={submitLoading}
      destroyOnClose
    >
      <Divider className="my-4" />

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true, order: 0, iconUrl: [] }}>
        <Form.Item label="Tiêu đề widget" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input
            placeholder="Nhập tiêu đề cho widget"
            size="large"
            className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </Form.Item>

        <Form.Item
          label="Icon"
          name="iconUrl"
          valuePropName="fileList"
          getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          rules={[{ required: !editingWidget, message: 'Vui lòng upload icon' }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            accept="image/*"
            beforeUpload={handleBeforeUpload}
            onRemove={handleRemoveUpload}
            onChange={handleUploadChange}
            fileList={fileList}
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div className="mt-2">Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Liên kết" name="link">
          <Input
            placeholder="https://example.com"
            size="large"
            className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </Form.Item>

        <div className="grid gap-4 sm:grid-cols-2">
          <Form.Item label="Thứ tự hiển thị" name="order" rules={[{ type: 'number', min: 0 }]}>
            <InputNumber min={0} placeholder="0" size="large" className="w-full rounded-lg" />
          </Form.Item>

          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
