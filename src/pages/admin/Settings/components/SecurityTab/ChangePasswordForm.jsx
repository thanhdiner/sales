import { Button, Form, Input, message } from 'antd'
import { LockKeyhole, Save, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { changePassword } from '@/services/admin/users/account'

const inputClass =
  'h-10 rounded-lg !border-[var(--admin-border)] !bg-white !text-[var(--admin-text)] placeholder:!text-[var(--admin-text-subtle)] dark:!bg-[var(--admin-surface-2)]'

const ChangePasswordForm = () => {
  const { t } = useTranslation('adminSettings')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async values => {
    const { username, ...rest } = values

    try {
      setLoading(true)
      await changePassword(rest)
      message.success(t('security.password.messages.success'))
      form.resetFields()
    } catch (err) {
      message.error(err?.response?.data?.message || t('security.password.messages.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
          <LockKeyhole className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h2 className="m-0 text-base font-semibold text-[var(--admin-text)]">{t('security.password.title')}</h2>
          <p className="mt-1 text-sm leading-5 text-[var(--admin-text-muted)]">{t('security.password.description')}</p>
        </div>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark
        className="
          [&_.ant-form-item]:mb-4
          [&_.ant-form-item-label]:pb-1.5
          [&_.ant-form-item-label>label]:text-sm
          [&_.ant-form-item-label>label]:font-medium
          [&_.ant-form-item-label>label]:text-[var(--admin-text-muted)]
          [&_.ant-input-password-icon]:text-[var(--admin-text-subtle)]
        "
      >
        <Form.Item name="username" initialValue="" className="hidden">
          <Input autoComplete="username" />
        </Form.Item>

        <Form.Item
          label={t('security.password.fields.currentPassword.label')}
          name="currentPassword"
          rules={[{ required: true, message: t('security.password.fields.currentPassword.required') }]}
        >
          <Input.Password className={inputClass} autoComplete="current-password" />
        </Form.Item>

        <Form.Item
          label={t('security.password.fields.newPassword.label')}
          name="newPassword"
          rules={[{ required: true, message: t('security.password.fields.newPassword.required') }]}
        >
          <Input.Password className={inputClass} autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          label={t('security.password.fields.confirmPassword.label')}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: t('security.password.fields.confirmPassword.required') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(new Error(t('security.password.fields.confirmPassword.mismatch')))
              }
            })
          ]}
        >
          <Input.Password className={inputClass} autoComplete="new-password" />
        </Form.Item>

        <div className="mt-1 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex gap-2">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{t('security.password.warning')}</span>
          </div>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<Save className="h-4 w-4" />}
          className="mt-5 h-10 w-full rounded-lg !border-none !bg-[var(--admin-accent)] font-semibold !text-white shadow-none hover:!opacity-90"
        >
          {t('security.password.submit')}
        </Button>
      </Form>
    </section>
  )
}

export default ChangePasswordForm
