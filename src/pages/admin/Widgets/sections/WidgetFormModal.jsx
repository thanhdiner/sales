import { Divider, Form, Input, InputNumber, Modal, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { AdminForm } from '@/components/admin/ui'

export default function WidgetFormModal({
  t = key => key,
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
      title={<span className="admin-widgets-modal__title">{editingWidget ? t('form.titleEdit') : t('form.titleCreate')}</span>}
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText={t('form.save')}
      cancelText={t('form.cancel')}
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

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true, order: 0, iconUrl: [], translations: { en: { title: '' } } }}
        className="admin-widgets-form"
      >
        <Form.Item label={t('form.widgetTitle')} name="title" rules={[{ required: true, message: t('form.widgetTitleRequired') }]}>
          <Input placeholder={t('form.widgetTitlePlaceholder')} size="large" className="admin-widgets-input" />
        </Form.Item>

        <AdminForm className="admin-widgets-form__translation-section" title={t('form.translations.sectionTitle')}>
          <Form.Item label={t('form.translations.title')} name={['translations', 'en', 'title']}>
            <Input placeholder={t('form.translations.titlePlaceholder')} size="large" className="admin-widgets-input" />
          </Form.Item>
        </AdminForm>

        <Form.Item
          label={t('form.icon')}
          name="iconUrl"
          valuePropName="fileList"
          getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          rules={[{ required: !editingWidget, message: t('form.iconRequired') }]}
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
                <div className="admin-widgets-upload__label">{t('form.upload')}</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label={t('form.link')} name="link">
          <Input placeholder={t('form.linkPlaceholder')} size="large" className="admin-widgets-input" />
        </Form.Item>

        <div className="admin-widgets-form__grid">
          <Form.Item label={t('form.order')} name="order" rules={[{ type: 'number', min: 0 }]}>
            <InputNumber
              min={0}
              placeholder={t('form.orderPlaceholder')}
              size="large"
              className="admin-widgets-input admin-widgets-input-number"
            />
          </Form.Item>

          <Form.Item label={t('form.status')} name="isActive" valuePropName="checked">
            <Switch className="admin-widgets-switch" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
