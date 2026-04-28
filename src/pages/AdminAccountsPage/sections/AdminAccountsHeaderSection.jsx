import { Button, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

const headerWrapperClass = 'mb-3 flex flex-col items-start gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between'
const titleClass = '!mb-0 !text-[20px] !font-semibold !text-[var(--admin-text)] sm:!text-2xl'
const createButtonClass =
  'inline-flex h-8 items-center rounded-md !border-none !bg-[var(--admin-accent)] px-3 !text-xs !font-medium !text-white hover:!opacity-90 sm:h-9 sm:!text-sm'

export default function AdminAccountsHeaderSection({ onCreate }) {
  const { t } = useTranslation('adminAccounts')

  return (
    <div className={headerWrapperClass}>
      <Title level={3} className={titleClass}>
        {t('page.title')}
      </Title>

      <Button type="primary" onClick={onCreate} className={createButtonClass}>
        {t('common.create')}
      </Button>
    </div>
  )
}
