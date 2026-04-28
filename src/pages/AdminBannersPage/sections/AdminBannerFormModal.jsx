import { Divider, Form, Input, Modal, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { AdminFormSection } from '@/components/admin/ui'

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
  const { t } = useTranslation('adminBanners')

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-[var(--admin-text)]">
          {editingBanner ? t('form.editTitle') : t('form.createTitle')}
        </span>
      }
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      width={720}
      style={{ top: 50, maxWidth: '95%' }}
      wrapClassName="admin-banners-modal"
      okButtonProps={{
        size: 'large',
        className: 'rounded-lg !border-none !bg-[var(--admin-accent)] font-medium !text-white hover:!opacity-90'
      }}
      cancelButtonProps={{
        size: 'large',
        className:
          'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'
      }}
      confirmLoading={submitLoading}
      destroyOnClose
    >
      <Divider className="my-4 !border-[var(--admin-border)]" />

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true, translations: { en: { title: '', link: '' } } }}>
        <Form.Item label={t('form.title')} name="title" rules={[{ required: true, message: t('form.titleRequired') }]}>
          <Input
            placeholder={t('form.titlePlaceholder')}
            size="large"
            className="admin-banners-input rounded-lg"
          />
        </Form.Item>

        <Form.Item label={t('form.link')} name="link">
          <Input
            placeholder={t('form.linkPlaceholder')}
            size="large"
            className="admin-banners-input rounded-lg"
          />
        </Form.Item>

        <AdminFormSection className="admin-banners-translation-section" title={t('form.translations.sectionTitle')}>
          <Form.Item label={t('form.translations.title')} name={['translations', 'en', 'title']}>
            <Input
              placeholder={t('form.translations.titlePlaceholder')}
              size="large"
              className="admin-banners-input rounded-lg"
            />
          </Form.Item>

          <Form.Item label={t('form.translations.link')} name={['translations', 'en', 'link']}>
            <Input
              placeholder={t('form.translations.linkPlaceholder')}
              size="large"
              className="admin-banners-input rounded-lg"
            />
          </Form.Item>
        </AdminFormSection>

        <Form.Item label={t('form.status')} name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('form.image')}
          name="img"
          valuePropName="fileList"
          getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          rules={[{ required: true, message: t('form.imageRequired') }]}
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
                <div className="mt-2">{t('common.upload')}</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
