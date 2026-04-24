import { QrcodeOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Upload } from 'antd'
import { ADMIN_BANK_INFO_FORM_INITIAL_VALUES } from '../utils'

export default function AdminBankInfoFormModalSection({
  open,
  editing,
  form,
  bodyStyle,
  contentRef,
  submitLoading,
  onClose,
  onSubmit,
  onQrBeforeUpload,
  onQrRemove
}) {
  return (
    <Modal
      title={editing ? 'Sửa thông tin' : 'Thêm thông tin mới'}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editing ? 'Lưu' : 'Tạo'}
      cancelText="Đóng"
      destroyOnClose
      className="rounded-xl"
      confirmLoading={submitLoading}
      okButtonProps={{ disabled: submitLoading }}
      cancelButtonProps={{ disabled: submitLoading }}
      centered
      styles={{ body: bodyStyle }}
    >
      <div ref={contentRef}>
        <Form
          form={form}
          layout="vertical"
          initialValues={ADMIN_BANK_INFO_FORM_INITIAL_VALUES}
        >
          <Form.Item
            name="bankName"
            label="Ngân hàng"
            rules={[{ required: true, message: 'Nhập tên ngân hàng' }]}
          >
            <Input placeholder="Vietcombank" className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
          </Form.Item>

          <Form.Item
            name="accountNumber"
            label="Số tài khoản"
            rules={[{ required: true, message: 'Nhập số tài khoản' }]}
          >
            <Input placeholder="1234567890" className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
          </Form.Item>

          <Form.Item
            name="accountHolder"
            label="Chủ tài khoản"
            rules={[{ required: true, message: 'Nhập chủ tài khoản' }]}
          >
            <Input placeholder="NGUYEN VAN A" className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
          </Form.Item>

          <Form.Item
            name="noteTemplate"
            label="Nội dung chuyển khoản (mẫu)"
            rules={[{ required: true, message: 'Nhập mẫu nội dung' }]}
          >
            <Input
              placeholder="[Ten KH] - [So dien thoai]"
              className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </Form.Item>

          <Form.Item
            name="qrCode"
            label="Ảnh QR Code"
            valuePropName="fileList"
            getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={onQrBeforeUpload}
              onRemove={onQrRemove}
            >
              <div>
                <QrcodeOutlined />
                <div className="mt-2 dark:text-gray-200">Thêm QR</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
