import { Button, Form, Input, message } from 'antd'
import { LockKeyhole, Save, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

import { changePasswordAdminAccount } from '@/services/adminAccountsService'

const inputClass =
  'h-10 rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)]'

const ChangePasswordForm = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async values => {
    const { username, ...rest } = values
    try {
      setLoading(true)
      await changePasswordAdminAccount(rest)
      message.success('Đã đổi mật khẩu thành công')
      form.resetFields()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không thể đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
          <LockKeyhole className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--admin-text)]">Đổi mật khẩu</h2>
          <p className="mt-1 text-sm leading-5 text-[var(--admin-text-muted)]">
            Cập nhật mật khẩu quản trị định kỳ để giảm rủi ro truy cập trái phép.
          </p>
        </div>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="[&_.ant-form-item-label>label]:text-sm [&_.ant-form-item-label>label]:font-medium [&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]"
      >
        <Form.Item name="username" initialValue="" className="hidden">
          <Input autoComplete="username" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        >
          <Input.Password className={inputClass} autoComplete="current-password" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
        >
          <Input.Password className={inputClass} autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
              }
            })
          ]}
        >
          <Input.Password className={inputClass} autoComplete="new-password" />
        </Form.Item>

        <div className="rounded-lg border border-[color-mix(in_srgb,#f59e0b_30%,var(--admin-border))] bg-[color-mix(in_srgb,#f59e0b_12%,var(--admin-surface-2))] px-3 py-2 text-xs leading-5 text-[#d97706]">
          <div className="flex gap-2">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Không chia sẻ mật khẩu quản trị. Sau khi đổi mật khẩu, hãy kiểm tra lại các thiết bị đang đăng nhập.</span>
          </div>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<Save className="h-4 w-4" />}
          className="mt-5 h-10 w-full rounded-lg !border-none !bg-[var(--admin-accent)] font-semibold !text-white hover:!opacity-90"
        >
          Cập nhật mật khẩu
        </Button>
      </Form>
    </section>
  )
}

export default ChangePasswordForm

