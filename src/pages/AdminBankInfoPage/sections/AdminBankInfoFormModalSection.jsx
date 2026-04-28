import { BankOutlined, GlobalOutlined, QrcodeOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Typography, Upload } from 'antd'
import { ADMIN_BANK_INFO_FORM_INITIAL_VALUES } from '../utils'

const { Text } = Typography

export default function AdminBankInfoFormModalSection({
  t,
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
              {editing ? t('form.editTitle') : t('form.createTitle')}
            </div>
            <div className="admin-bank-info-modal__subtitle">
              {t('form.subtitle')}
            </div>
          </div>
        </div>
      }
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editing ? t('form.saveSubmit') : t('form.createSubmit')}
      cancelText={t('form.close')}
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
          <Form.Item name="bankName" label={t('form.bankName')} rules={[{ required: true, message: t('form.bankNameRequired') }]}>
            <Input size="large" placeholder="Vietcombank" className="admin-bank-info-input" />
          </Form.Item>

          <div className="admin-bank-info-modal__grid">
            <Form.Item name="accountNumber" label={t('form.accountNumber')} rules={[{ required: true, message: t('form.accountNumberRequired') }]}>
              <Input size="large" placeholder="1234567890" className="admin-bank-info-input admin-bank-info-input--mono" />
            </Form.Item>

            <Form.Item name="accountHolder" label={t('form.accountHolder')} rules={[{ required: true, message: t('form.accountHolderRequired') }]}>
              <Input size="large" placeholder="NGUYEN VAN A" className="admin-bank-info-input" />
            </Form.Item>
          </div>

          <Form.Item
            name="noteTemplate"
            label={t('form.noteTemplate')}
            rules={[{ required: true, message: t('form.noteTemplateRequired') }]}
          >
            <Input.TextArea rows={3} placeholder="[Ten KH] - [So dien thoai]" className="admin-bank-info-input" />
          </Form.Item>

          <div className="admin-bank-info-modal__translation-section">
            <div className="admin-bank-info-modal__translation-header">
              <GlobalOutlined />
              <h3 className="admin-bank-info-modal__translation-title">{t('form.translations.sectionTitle')}</h3>
            </div>

            <Form.Item name={['translations', 'en', 'bankName']} label={t('form.translations.bankName')}>
              <Input size="large" placeholder={t('form.translations.bankNamePlaceholder')} className="admin-bank-info-input" />
            </Form.Item>

            <div className="admin-bank-info-modal__grid">
              <Form.Item name={['translations', 'en', 'accountHolder']} label={t('form.translations.accountHolder')}>
                <Input size="large" placeholder={t('form.translations.accountHolderPlaceholder')} className="admin-bank-info-input" />
              </Form.Item>

              <Form.Item name={['translations', 'en', 'noteTemplate']} label={t('form.translations.noteTemplate')}>
                <Input.TextArea
                  rows={3}
                  placeholder={t('form.translations.noteTemplatePlaceholder')}
                  className="admin-bank-info-input"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="qrCode"
            label={t('form.qrCode')}
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
                <div className="admin-bank-info-upload__text">{t('form.uploadQr')}</div>
              </div>
            </Upload>
          </Form.Item>

          <Text className="admin-bank-info-modal__hint">
            {t('form.hint')}
          </Text>
        </Form>
      </div>
    </Modal>
  )
}
