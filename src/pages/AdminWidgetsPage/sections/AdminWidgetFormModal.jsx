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
      className="admin-widgets-modal"
      rootClassName="admin-widgets-modal"
      wrapClassName="admin-widgets-modal"
      title={<span className="admin-widgets-modal__title">{editingWidget ? 'Chỉnh sửa Widget' : 'Thêm Widget mới'}</span>}
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
      style={{ top: 50, maxWidth: '95%' }}
      okButtonProps={{
        size: 'large',
        className: 'admin-widgets-btn admin-widgets-btn--primary'
      }}
      cancelButtonProps={{
        size: 'large',
        className: 'admin-widgets-btn admin-widgets-btn--default'
      }}
      confirmLoading={submitLoading}
      destroyOnClose
    >
      <Divider className="admin-widgets-modal__divider" />

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true, order: 0, iconUrl: [] }} className="admin-widgets-form">
        <Form.Item label="Tiêu đề widget" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề cho widget" size="large" className="admin-widgets-input" />
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
            className="admin-widgets-upload"
          >
            {fileList.length < 1 && (
              <div className="admin-widgets-upload__trigger">
                <PlusOutlined />
                <div className="admin-widgets-upload__label">Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Liên kết" name="link">
          <Input placeholder="https://example.com" size="large" className="admin-widgets-input" />
        </Form.Item>

        <div className="admin-widgets-form__grid">
          <Form.Item label="Thứ tự hiển thị" name="order" rules={[{ type: 'number', min: 0 }]}>
            <InputNumber min={0} placeholder="0" size="large" className="admin-widgets-input admin-widgets-input-number" />
          </Form.Item>

          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch className="admin-widgets-switch" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
