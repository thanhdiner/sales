import { Button } from 'antd'

function EmailWarningBanner({ emailWarning, onChangeEmail, t }) {
  if (!emailWarning) return null

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('emailAlert.title')}</h3>
        <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">{emailWarning}</p>
      </div>

      <Button
        onClick={onChangeEmail}
        className="h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
      >
        {t('emailAlert.button')}
      </Button>
    </div>
  )
}

export default EmailWarningBanner
