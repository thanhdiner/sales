import { Button, Form, Input, Modal } from 'antd'

function EmailUpdateModal({
  emailStep,
  newEmail,
  onCancel,
  onSendCode,
  onVerifyEmail,
  open,
  setNewEmail,
  setVerifyCode,
  t,
  updatingEmail,
  verifyCode
}) {
  return (
    <Modal title={t('emailModal.title')} open={open} onCancel={onCancel} footer={null} destroyOnClose width={500}>
      {emailStep === 0 && (
        <div className="py-4">
          <Form layout="vertical" onFinish={onSendCode}>
            <Form.Item
              label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('emailModal.newEmail')}</span>}
              name="email"
              rules={[
                { required: true, message: t('emailModal.newEmailRequired') },
                { type: 'email', message: t('emailModal.newEmailInvalid') }
              ]}
            >
              <Input
                placeholder={t('emailModal.newEmailPlaceholder')}
                value={newEmail}
                onChange={event => setNewEmail(event.target.value)}
                disabled={updatingEmail}
                size="large"
                className="rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </Form.Item>

            <Button
              htmlType="submit"
              loading={updatingEmail}
              block
              size="large"
              className="mt-3 h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
            >
              {t('emailModal.sendCode')}
            </Button>
          </Form>
        </div>
      )}

      {emailStep === 1 && (
        <div className="py-4">
          <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('emailModal.checkEmailTitle')}</h3>

            <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t('emailModal.checkEmailDescription', { email: newEmail })}
            </p>
          </div>

          <Form layout="vertical" onFinish={onVerifyEmail}>
            <Form.Item
              label={<span className="font-medium text-gray-700 dark:text-gray-300">{t('emailModal.verifyCode')}</span>}
              name="code"
              rules={[
                { required: true, message: t('emailModal.verifyCodeRequired') },
                { len: 6, message: t('emailModal.verifyCodeLength') }
              ]}
            >
              <Input
                placeholder={t('emailModal.verifyCodePlaceholder')}
                value={verifyCode}
                onChange={event => setVerifyCode(event.target.value)}
                maxLength={6}
                disabled={updatingEmail}
                size="large"
                className="rounded-lg border-gray-200 text-center text-xl tracking-widest dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </Form.Item>

            <Button
              htmlType="submit"
              loading={updatingEmail}
              block
              size="large"
              className="h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
            >
              {t('emailModal.verifyAndUpdate')}
            </Button>
          </Form>
        </div>
      )}
    </Modal>
  )
}

export default EmailUpdateModal
