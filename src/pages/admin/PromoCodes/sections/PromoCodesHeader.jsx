import { Button } from 'antd'
import { Download, Plus, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'
const primaryButtonClass = 'rounded-lg !border-none !bg-[var(--admin-accent)] font-semibold !text-white hover:!opacity-90'

export default function PromoCodesHeader({ loading, onCreate, onExport, onRefresh }) {
  const { t } = useTranslation('adminPromoCodes')

  return (
    <section className="admin-promo-header rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-text)] sm:text-3xl">{t('page.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--admin-text-muted)] sm:text-base">{t('page.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button type="primary" size="large" icon={<Plus className="h-4 w-4" />} onClick={onCreate} className={primaryButtonClass}>
            {t('actions.create')}
          </Button>
          <Button size="large" icon={<Download className="h-4 w-4" />} onClick={onExport} className={secondaryButtonClass}>
            {t('actions.export')}
          </Button>
          <Button
            size="large"
            icon={<RefreshCw className="h-4 w-4" />}
            loading={loading}
            onClick={onRefresh}
            className={secondaryButtonClass}
          >
            {t('actions.refresh')}
          </Button>
        </div>
      </div>
    </section>
  )
}
