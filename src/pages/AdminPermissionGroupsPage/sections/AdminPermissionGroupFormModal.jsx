import { Form, Input, Modal, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import { adminPermissionGroupInitialValues } from '../utils'

const inputClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const primaryButtonClass = '!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'
const secondaryButtonClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'

export default function AdminPermissionGroupFormModal({
  form,
  modalVisible,
  editingGroup,
  submitLoading,
  closeModal,
  handleSubmit,
  handleLabelChange
}) {
  const { t } = useTranslation('adminPermissionGroups')
  const { bodyStyle, contentRef } = useModalBodyScroll(modalVisible)

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-[var(--admin-text)]">
          {editingGroup ? t('form.editTitle') : t('form.createTitle')}
        </span>
      }
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText={editingGroup ? t('common.save') : t('common.submitCreate')}
      cancelText={t('common.cancel')}
      destroyOnClose
      confirmLoading={submitLoading}
      centered
      styles={{ body: bodyStyle }}
      className="admin-permission-group-modal"
      okButtonProps={{
        className: `rounded-lg font-medium ${primaryButtonClass}`
      }}
      cancelButtonProps={{
        className: `rounded-lg ${secondaryButtonClass}`
      }}
    >
      <div ref={contentRef}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={adminPermissionGroupInitialValues}
          onFinish={handleSubmit}
          className="[&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
        >
          <Form.Item
            label={t('form.name')}
            name="label"
            rules={[
              { required: true, message: t('form.nameRequired') },
              { min: 3, message: t('form.nameMin') }
            ]}
          >
            <Input placeholder={t('form.namePlaceholder')} className={inputClass} onChange={handleLabelChange} />
          </Form.Item>

          <Form.Item
            label={t('form.code')}
            name="value"
            rules={[
              { required: true, message: t('form.codeRequired') },
              { pattern: /^[a-z0-9_]+$/, message: t('form.codePattern') }
            ]}
          >
            <Input placeholder={t('form.codePlaceholder')} disabled={!!editingGroup} className={inputClass} />
          </Form.Item>

          <Form.Item label={t('form.description')} name="description" rules={[{ max: 300, message: t('form.descriptionMax') }]}>
            <Input.TextArea rows={3} placeholder={t('form.descriptionPlaceholder')} className={inputClass} />
          </Form.Item>

          <div className="admin-permission-group-modal__translation-section">
            <h3 className="admin-permission-group-modal__translation-title">{t('form.translations.sectionTitle')}</h3>

            <Form.Item label={t('form.translations.label')} name={['translations', 'en', 'label']}>
              <Input placeholder={t('form.translations.labelPlaceholder')} className={inputClass} />
            </Form.Item>

            <Form.Item
              label={t('form.translations.description')}
              name={['translations', 'en', 'description']}
              rules={[{ max: 300, message: t('form.descriptionMax') }]}
            >
              <Input.TextArea rows={3} placeholder={t('form.translations.descriptionPlaceholder')} className={inputClass} />
            </Form.Item>
          </div>

          <Form.Item label={t('form.status')} name="isActive" valuePropName="checked">
            <Switch checkedChildren={t('common.enable')} unCheckedChildren={t('common.disable')} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
