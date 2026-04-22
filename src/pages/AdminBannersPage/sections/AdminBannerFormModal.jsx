import { Divider, Form, Input, Modal, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function AdminBannerFormModal({
  form,
  modalVisible,
  editingBanner,
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
          {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
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

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true }}>
        <Form.Item label="Tiêu đề banner" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input
            placeholder="Nhập tiêu đề banner"
            size="large"
            className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </Form.Item>

        <Form.Item label="Liên kết" name="link">
          <Input
            placeholder="Nhập link chuyển hướng"
            size="large"
            className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label="Ảnh banner"
          name="img"
          valuePropName="fileList"
          getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          rules={[{ required: !editingBanner, message: 'Vui lòng upload ảnh banner' }]}
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
      </Form>
    </Modal>
  )
}
