import { BankOutlined, QrcodeOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Typography, Upload } from 'antd'
import { ADMIN_BANK_INFO_FORM_INITIAL_VALUES } from '../utils'

const { Text } = Typography

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
      rootClassName="admin-bank-info-modal"
      wrapClassName="admin-bank-info-modal"
      className="admin-bank-info-modal"
      title={
        <div className="admin-bank-info-modal__title-wrap">
          <div className="admin-bank-info-modal__title-icon">
            <BankOutlined />
          </div>
          <div>
            <div className="admin-bank-info-modal__title">
              {editing ? 'Sửa thông tin ngân hàng' : 'Thêm tài khoản ngân hàng'}
            </div>
            <div className="admin-bank-info-modal__subtitle">
              Cập nhật dữ liệu chuyển khoản cho bước thanh toán.
            </div>
          </div>
        </div>
      }
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editing ? 'Lưu thay đổi' : 'Tạo tài khoản'}
      cancelText="Đóng"
      destroyOnClose
      confirmLoading={submitLoading}
      okButtonProps={{
        disabled: submitLoading,
        className: 'admin-bank-info-btn admin-bank-info-btn--primary'
      }}
      cancelButtonProps={{
        disabled: submitLoading,
        className: 'admin-bank-info-btn admin-bank-info-btn--secondary'
      }}
      centered
      width={620}
      styles={{ body: bodyStyle }}
    >
      <div ref={contentRef}>
        <Form form={form} layout="vertical" initialValues={ADMIN_BANK_INFO_FORM_INITIAL_VALUES} className="admin-bank-info-modal__form">
          <Form.Item name="bankName" label="Ngân hàng" rules={[{ required: true, message: 'Nhập tên ngân hàng' }]}>
            <Input size="large" placeholder="Vietcombank" className="admin-bank-info-input" />
          </Form.Item>

          <div className="admin-bank-info-modal__grid">
            <Form.Item name="accountNumber" label="Số tài khoản" rules={[{ required: true, message: 'Nhập số tài khoản' }]}>
              <Input size="large" placeholder="1234567890" className="admin-bank-info-input admin-bank-info-input--mono" />
            </Form.Item>

            <Form.Item name="accountHolder" label="Chủ tài khoản" rules={[{ required: true, message: 'Nhập chủ tài khoản' }]}>
              <Input size="large" placeholder="NGUYEN VAN A" className="admin-bank-info-input" />
            </Form.Item>
          </div>

          <Form.Item
            name="noteTemplate"
            label="Nội dung chuyển khoản mẫu"
            rules={[{ required: true, message: 'Nhập mẫu nội dung' }]}
          >
            <Input.TextArea rows={3} placeholder="[Ten KH] - [So dien thoai]" className="admin-bank-info-input" />
          </Form.Item>

          <Form.Item
            name="qrCode"
            label="Ảnh QR Code"
            valuePropName="fileList"
            getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          >
            <Upload
              className="admin-bank-info-upload"
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={onQrBeforeUpload}
              onRemove={onQrRemove}
            >
              <div className="admin-bank-info-upload__trigger">
                <QrcodeOutlined />
                <div className="admin-bank-info-upload__text">Tải QR</div>
              </div>
            </Upload>
          </Form.Item>

          <Text className="admin-bank-info-modal__hint">
            Hỗ trợ ảnh QR dưới 5MB. Khi đổi ảnh, ảnh cũ sẽ được gỡ khỏi hệ thống.
          </Text>
        </Form>
      </div>
    </Modal>
  )
}

