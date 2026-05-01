import { Empty, Skeleton } from 'antd'
import { TicketPercent } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PromoCodeMobileCard from './PromoCodeMobileCard'

export default function PromoCodesMobileList({
  promoCodes,
  loading,
  language,
  onCopy,
  onShowDetail,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onExtendExpiry,
  onDelete
}) {
  const { t } = useTranslation('adminPromoCodes')

  return (
    <section className="admin-promo-mobile-section rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--admin-text)]">{t('table.title')}</h2>
        <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{t('table.description')}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
          ))}
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-2)] py-12">
          <Empty
            image={<TicketPercent className="mx-auto h-10 w-10 text-[var(--admin-text-subtle)]" />}
            description={<span className="text-sm text-[var(--admin-text-muted)]">{t('table.empty')}</span>}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {promoCodes.map(promoCode => (
            <PromoCodeMobileCard
              key={promoCode._id || promoCode.code}
              promoCode={promoCode}
              language={language}
              onCopy={onCopy}
              onShowDetail={onShowDetail}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleStatus={onToggleStatus}
              onExtendExpiry={onExtendExpiry}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
