import { Form, Input, Modal, Select, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ADMIN_ACCOUNT_FORM_INITIAL_VALUES,
  ADMIN_ACCOUNT_STATUS_OPTIONS
} from '../utils'

const { Option } = Select

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
      title={<span className="dark:text-gray-300">{editing ? 'Sửa tài khoản' : 'Thêm tài khoản'}</span>}
      onCancel={onClose}
      onOk={onSubmit}
      destroyOnClose
      confirmLoading={submitLoading}
      okButtonProps={{ disabled: submitLoading }}
      cancelButtonProps={{ disabled: submitLoading }}
      style={{ maxWidth: '95%' }}
      centered
      styles={{ body: bodyStyle }}
    >
      <div ref={contentRef}>
        <Form form={form} layout="vertical" initialValues={ADMIN_ACCOUNT_FORM_INITIAL_VALUES}>
          <Form.Item
            name="username"
            label={<span className="dark:text-gray-300">Username</span>}
            rules={[
              { required: true, min: 4 },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Chỉ nhập chữ cái, số, hoặc dấu _; không dùng ký tự đặc biệt!'
              }
            ]}
          >
            <Input
              className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
              autoFocus
              disabled={!!editing}
              placeholder="Nhập tên người dùng"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="dark:text-gray-300">Email</span>}
            rules={[{ required: true, type: 'email' }]}
          >
            <Input
              className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
              placeholder="Nhập email"
            />
          </Form.Item>

          {editing ? (
            <Form.Item
              name="newPassword"
              label={<span className="dark:text-gray-300">New Password</span>}
              rules={[{ min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
            >
              <Input.Password
                className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
                placeholder="Nhập mật khẩu mới (không bắt buộc)"
                autoComplete="new-password"
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="password"
              label={<span className="dark:text-gray-300">Password</span>}
              rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
            >
              <Input.Password
                className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
          )}

          <Form.Item
            name="fullName"
            label={<span className="dark:text-gray-300">Full Name</span>}
            rules={[{ required: true, message: 'Tên đầy đủ là bắt buộc!' }]}
          >
            <Input
              className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
              placeholder="Nhập tên đầy đủ"
            />
          </Form.Item>

          <Form.Item
            name="role_id"
            label={<span className="dark:text-gray-300">Role</span>}
            rules={[{ required: true }]}
          >
            <Select getPopupContainer={trigger => trigger.parentElement}>
              {roles.map(role => (
                <Option key={role._id} value={role._id}>
                  {role.label || role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={<span className="dark:text-gray-300">Status</span>}
            rules={[{ required: true }]}
          >
            <Select getPopupContainer={trigger => trigger.parentElement}>
              {ADMIN_ACCOUNT_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="avatarUrl"
            label={<span className="dark:text-gray-300">Avatar Image</span>}
            valuePropName="fileList"
            getValueFromEvent={event => (Array.isArray(event) ? event : event?.fileList)}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={onAvatarBeforeUpload}
              onRemove={onAvatarRemove}
            >
              <div>
                <PlusOutlined />
                <div className="mt-2 dark:text-gray-300">Add Avatar</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
