import { useTranslation } from 'react-i18next'

export default function AdminOrdersHeaderSection() {
  const { t } = useTranslation('adminOrders')

  return (
    <div className="mb-4 sm:mb-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-[var(--admin-text)] sm:text-2xl">{t('page.title')}</h1>
        <p className="text-sm text-[var(--admin-text-muted)]">{t('page.description')}</p>
      </div>
    </div>
  )
}
