import { Button, Card, Divider, Form, Input } from 'antd'
import EmailUpdate from '../components/EmailUpdate'
import { PROFILE_PHONE_PATTERN } from '../constants'
import { isTemporaryProfileEmail } from '../utils/profileUtils'

function ProfileDetailsCard({ form, loading, onChangeEmail, onEmailUpdated, onSaveProfile, t, user }) {
  const isTemporaryEmail = isTemporaryProfileEmail(user?.email)

  return (
    <Card
      className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-8"
      styles={{ body: { padding: '28px' } }}
    >
      <Form form={form} layout="vertical" initialValues={user} onFinish={onSaveProfile} size="large">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('form.fullName')}</span>}
            name="fullName"
            rules={[{ required: true, message: t('form.fullNameRequired') }]}
            className="mb-0"
          >
            <Input
              placeholder={t('form.fullNamePlaceholder')}
              className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
          </Form.Item>

          <Form.Item label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('form.username')}</span>} className="mb-0">
            <Input
              value={user.username}
              disabled
              className="rounded-lg border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('form.phone')}</span>}
            name="phone"
            rules={[
              { required: false },
              {
                pattern: PROFILE_PHONE_PATTERN,
                message: t('form.phoneInvalid')
              }
            ]}
            className="mb-0"
          >
            <Input
              placeholder={t('form.phonePlaceholder')}
              className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              maxLength={11}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {t('form.email')}{' '}
              <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                {isTemporaryEmail ? t('form.unverified') : t('form.verified')}
              </span>
            </span>
          }
          className="mt-5 mb-0"
        >
          {user.email?.endsWith('@github.com') || user.email?.endsWith('@facebook.com') ? (
            <EmailUpdate user={user} onEmailUpdated={onEmailUpdated} />
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={user.email}
                disabled
                className="flex-1 rounded-lg border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
              />

              <Button
                onClick={onChangeEmail}
                disabled={loading}
                className="h-auto rounded-lg border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                {t('form.changeEmail')}
              </Button>
            </div>
          )}
        </Form.Item>

        <Divider className="my-7" />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            size="large"
            className="h-auto rounded-lg border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            onClick={() => form.resetFields()}
          >
            {t('form.cancel')}
          </Button>

          <Button
            htmlType="submit"
            loading={loading}
            size="large"
            className="h-auto rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
          >
            {loading ? t('form.saving') : t('form.save')}
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default ProfileDetailsCard
