import { CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AdminOrderTransferSection({ transferInfo }) {
  const { t } = useTranslation('adminOrderDetail')

  if (!transferInfo?.bank) {
    return null
  }

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <CreditCard className="h-5 w-5 text-[var(--admin-text-muted)]" />
        {t('transfer.title')}
      </h2>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">{t('transfer.bank')}</p>
          <p className="font-medium text-[var(--admin-text)]">{transferInfo.bank}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">{t('transfer.accountNumber')}</p>
          <p className="break-all font-mono font-medium text-[var(--admin-text)]">{transferInfo.accountNumber}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">{t('transfer.accountName')}</p>
          <p className="break-words font-medium text-[var(--admin-text)]">{transferInfo.accountName}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-subtle)]">{t('transfer.content')}</p>
          <p className="break-all rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 font-mono text-sm font-medium text-[var(--admin-text)]">
            {transferInfo.content}
          </p>
        </div>
      </div>
    </div>
  )
}
