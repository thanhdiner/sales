import { Form, Input, Modal, Select, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  ADMIN_ACCOUNT_FORM_INITIAL_VALUES,
  getLocalizedAdminRoleLabel,
  getAdminAccountStatusOptions
} from '../utils'

const { Option } = Select

const modalRootClass = 'admin-accounts-modal'
const modalTitleClass = 'text-[var(--admin-text)]'
const modalPrimaryButtonClass = 'admin-accounts-modal-btn-primary'
const modalSecondaryButtonClass = 'admin-accounts-modal-btn-secondary'

const formLabelClass = 'text-[var(--admin-text-muted)]'
const inputClass =
  '!border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'
const selectClass =
  '[&_.ant-select-selector]:!border-[var(--admin-border)] [&_.ant-select-selector]:!bg-[var(--admin-surface-2)] [&_.ant-select-selector]:!text-[var(--admin-text)]'
const selectDropdownClass = 'admin-accounts-select-dropdown'

const uploadClass = 'admin-accounts-upload'
const uploadTextClass = 'mt-2 text-[var(--admin-text-muted)]'

const modalStyle = { maxWidth: '95%' }

function getFormFileList(event) {
  return Array.isArray(event) ? event : event?.fileList
}

function getPopupContainer(trigger) {
  return trigger.parentElement
}

export default function AccountsFormModal({
  open,
  editing,
  form,
  roles,
  bodyStyle,
  contentRef,
  submitLoading,
  onClose,
  onSubmit,
  onAvatarBeforeUpload,
  onAvatarRemove
}) {
  const { t } = useTranslation('adminAccounts')
  const language = useCurrentLanguage()

  return (
    <Modal
      open={open}
      title={<span className={modalTitleClass}>{editing ? t('form.editTitle') : t('form.createTitle')}</span>}
      onCancel={onClose}
      onOk={onSubmit}
      okText={editing ? t('common.save') : t('common.submitCreate')}
      cancelText={t('common.cancel')}
      rootClassName={modalRootClass}
      wrapClassName={modalRootClass}
      destroyOnClose
      confirmLoading={submitLoading}
      okButtonProps={{
        disabled: submitLoading,
        className: modalPrimaryButtonClass
      }}
      cancelButtonProps={{
        disabled: submitLoading,
        className: modalSecondaryButtonClass
      }}
      style={modalStyle}
      centered
      styles={{ body: bodyStyle }}
    >
      <div ref={contentRef}>
        <Form form={form} layout="vertical" initialValues={ADMIN_ACCOUNT_FORM_INITIAL_VALUES}>
          <Form.Item
            name="username"
            label={<span className={formLabelClass}>{t('form.username')}</span>}
            rules={[
              { required: true, message: t('form.usernameRequired') },
              { min: 4, message: t('form.usernameMin') },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: t('form.usernamePattern')
              }
            ]}
          >
            <Input className={inputClass} autoFocus disabled={!!editing} placeholder={t('form.usernamePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className={formLabelClass}>{t('form.email')}</span>}
            rules={[
              { required: true, message: t('form.emailRequired') },
              { type: 'email', message: t('form.emailInvalid') }
            ]}
          >
            <Input className={inputClass} placeholder={t('form.emailPlaceholder')} />
          </Form.Item>

          {editing ? (
            <Form.Item
              name="newPassword"
              label={<span className={formLabelClass}>{t('form.newPassword')}</span>}
              rules={[{ min: 6, message: t('form.passwordMin') }]}
            >
              <Input.Password
                className={inputClass}
                placeholder={t('form.newPasswordPlaceholder')}
                autoComplete="new-password"
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="password"
              label={<span className={formLabelClass}>{t('form.password')}</span>}
              rules={[
                { required: true, message: t('form.passwordRequired') },
                { min: 6, message: t('form.passwordMin') }
              ]}
            >
              <Input.Password className={inputClass} placeholder={t('form.passwordPlaceholder')} />
            </Form.Item>
          )}

          <Form.Item
            name="fullName"
            label={<span className={formLabelClass}>{t('form.fullName')}</span>}
            rules={[{ required: true, message: t('form.fullNameRequired') }]}
          >
            <Input className={inputClass} placeholder={t('form.fullNamePlaceholder')} />
          </Form.Item>

          <div className="admin-accounts-form__translation-section">
            <h3 className="admin-accounts-form__translation-title">{t('form.translations.sectionTitle')}</h3>
            <Form.Item
              name={['translations', 'en', 'fullName']}
              label={<span className={formLabelClass}>{t('form.translations.fullName')}</span>}
            >
              <Input className={inputClass} placeholder={t('form.translations.fullNamePlaceholder')} />
            </Form.Item>
          </div>

          <Form.Item
            name="role_id"
            label={<span className={formLabelClass}>{t('form.role')}</span>}
            rules={[{ required: true, message: t('form.roleRequired') }]}
          >
            <Select
              className={selectClass}
              popupClassName={selectDropdownClass}
              getPopupContainer={getPopupContainer}
              placeholder={t('form.roleRequired')}
            >
              {roles.map(role => (
                <Option key={role._id} value={role._id}>
                  {getLocalizedAdminRoleLabel(role, language, t('common.unknownRole'))}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={<span className={formLabelClass}>{t('form.status')}</span>}
            rules={[{ required: true, message: t('form.statusRequired') }]}
          >
            <Select
              className={selectClass}
              popupClassName={selectDropdownClass}
              getPopupContainer={getPopupContainer}
              placeholder={t('form.statusRequired')}
            >
              {getAdminAccountStatusOptions(t).map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="avatarUrl"
            label={<span className={formLabelClass}>{t('form.avatar')}</span>}
            valuePropName="fileList"
            getValueFromEvent={getFormFileList}
          >
            <Upload
              className={uploadClass}
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={onAvatarBeforeUpload}
              onRemove={onAvatarRemove}
            >
              <div>
                <PlusOutlined />
                <div className={uploadTextClass}>{t('form.addAvatar')}</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
