import { Form, Input, Modal, Select, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ADMIN_ACCOUNT_FORM_INITIAL_VALUES,
  ADMIN_ACCOUNT_STATUS_OPTIONS
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

export default function AdminAccountsFormModalSection({
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
  return (
    <Modal
      open={open}
      title={<span className={modalTitleClass}>{editing ? 'Sửa tài khoản' : 'Thêm tài khoản'}</span>}
      onCancel={onClose}
      onOk={onSubmit}
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
            label={<span className={formLabelClass}>Username</span>}
            rules={[
              { required: true, min: 4 },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Chỉ nhập chữ cái, số, hoặc dấu _; không dùng ký tự đặc biệt!'
              }
            ]}
          >
            <Input className={inputClass} autoFocus disabled={!!editing} placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className={formLabelClass}>Email</span>}
            rules={[{ required: true, type: 'email' }]}
          >
            <Input className={inputClass} placeholder="Nhập email" />
          </Form.Item>

          {editing ? (
            <Form.Item
              name="newPassword"
              label={<span className={formLabelClass}>New Password</span>}
              rules={[{ min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
            >
              <Input.Password
                className={inputClass}
                placeholder="Nhập mật khẩu mới (không bắt buộc)"
                autoComplete="new-password"
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="password"
              label={<span className={formLabelClass}>Password</span>}
              rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
            >
              <Input.Password className={inputClass} placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item
            name="fullName"
            label={<span className={formLabelClass}>Full Name</span>}
            rules={[{ required: true, message: 'Tên đầy đủ là bắt buộc!' }]}
          >
            <Input className={inputClass} placeholder="Nhập tên đầy đủ" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label={<span className={formLabelClass}>Role</span>}
            rules={[{ required: true }]}
          >
            <Select
              className={selectClass}
              popupClassName={selectDropdownClass}
              getPopupContainer={getPopupContainer}
            >
              {roles.map(role => (
                <Option key={role._id} value={role._id}>
                  {role.label || role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={<span className={formLabelClass}>Status</span>}
            rules={[{ required: true }]}
          >
            <Select
              className={selectClass}
              popupClassName={selectDropdownClass}
              getPopupContainer={getPopupContainer}
            >
              {ADMIN_ACCOUNT_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="avatarUrl"
            label={<span className={formLabelClass}>Avatar Image</span>}
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
                <div className={uploadTextClass}>Add Avatar</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}