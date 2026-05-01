import { Form, Input, Modal, Select } from 'antd'
import { useModalBodyScroll } from '@/hooks/shared/useModalBodyScroll'
import { permissionInitialValues } from '../utils'
import { getLocalizedPermissionGroupLabel } from '@/utils/permissionLocalization'

export default function PermissionFormModal({
  t = key => key,
  form,
  modalVisible,
  editingPermission,
  submitLoading,
  permissionGroups,
  language,
  closeModal,
  handleSubmit,
  handleTitleChange
}) {
  const { bodyStyle, contentRef } = useModalBodyScroll(modalVisible)
  const permissionGroupOptions = permissionGroups.map(group => ({
    ...group,
    label: getLocalizedPermissionGroupLabel(group, language, group.label || group.value)
  }))

  return (
    <Modal
      title={
        <span className="text-base font-semibold text-[var(--admin-text)]">
          {editingPermission ? t('form.editTitle') : t('form.createTitle')}
        </span>
      }
      open={modalVisible}
      onCancel={closeModal}
      onOk={() => form.submit()}
      okText={editingPermission ? t('common.save') : t('common.submitCreate')}
      cancelText={t('common.cancel')}
      destroyOnClose
      confirmLoading={submitLoading}
      centered
      styles={{ body: bodyStyle }}
      className="admin-permission-modal"
      okButtonProps={{
        className: 'rounded-lg !border-none !bg-[var(--admin-accent)] font-medium !text-white hover:!opacity-90'
      }}
      cancelButtonProps={{
        className:
          'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'
      }}
    >
      <div ref={contentRef}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={permissionInitialValues}
          onFinish={handleSubmit}
          className="[&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
        >
          <Form.Item
            label={t('form.name')}
            name="title"
            rules={[
              { required: true, message: t('form.nameRequired') },
              { min: 3, message: t('form.nameMin') }
            ]}
          >
            <Input placeholder={t('form.namePlaceholder')} className="admin-permission-input rounded-lg" onChange={handleTitleChange} />
          </Form.Item>

          <Form.Item
            label={t('form.code')}
            name="name"
            rules={[
              { required: true, message: t('form.codeRequired') },
              { min: 3, message: t('form.codeMin') },
              { pattern: /^[a-z0-9_]+$/, message: t('form.codePattern') }
            ]}
          >
            <Input placeholder={t('form.codePlaceholder')} disabled={!!editingPermission} className="admin-permission-input rounded-lg" />
          </Form.Item>

          <Form.Item label={t('form.description')} name="description">
            <Input.TextArea rows={3} placeholder={t('form.descriptionPlaceholder')} className="admin-permission-input rounded-lg" />
          </Form.Item>

          <div className="admin-permission-form__translation-section">
            <h3 className="admin-permission-form__translation-title">{t('form.translations.sectionTitle')}</h3>

            <Form.Item label={t('form.translations.name')} name={['translations', 'en', 'title']}>
              <Input placeholder={t('form.translations.namePlaceholder')} className="admin-permission-input rounded-lg" />
            </Form.Item>

            <Form.Item label={t('form.translations.description')} name={['translations', 'en', 'description']}>
              <Input.TextArea
                rows={3}
                placeholder={t('form.translations.descriptionPlaceholder')}
                className="admin-permission-input rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item label={t('form.group')} name="group" rules={[{ required: true, message: t('form.groupRequired') }]}>
            <Select
              getPopupContainer={trigger => trigger.parentElement}
              dropdownStyle={{ zIndex: 1238 }}
              placeholder={t('form.groupPlaceholder')}
              options={permissionGroupOptions}
              allowClear
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
