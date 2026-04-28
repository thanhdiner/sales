import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'
import { getPromoCodePaginationSummary } from '../utils/promoCodeHelpers'

export default function PromoCodesPaginationSection({ pagination, language, onPageChange }) {
  const { t } = useTranslation('adminPromoCodes')
  const summary = getPromoCodePaginationSummary({ pagination, language, t })
  const total = Number(pagination?.total) || 0

  return (
    <section className="admin-promo-pagination-section flex flex-col gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--admin-text-muted)]">{summary}</p>

      {total > 0 ? (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={[10, 20, 50]}
          onChange={(page, pageSize) => onPageChange({ current: page, pageSize })}
          className="admin-promo-pagination"
        />
      ) : null}
    </section>
  )
}
