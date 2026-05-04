import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'
import { ORDERS_PAGE_SIZE_OPTIONS, getOrdersSummary } from '../utils'

export default function OrdersPagination({ current, pageSize, total, onPageChange, visible }) {
  const { t } = useTranslation('adminOrders')

  if (!visible) return null

  const summary = getOrdersSummary({ page: current, limit: pageSize, total })

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[var(--admin-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm leading-6 text-[var(--admin-text-muted)]">
        {t('pagination.summary', { from: summary.from, to: summary.to, total })}
      </div>

      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        pageSizeOptions={ORDERS_PAGE_SIZE_OPTIONS.map(String)}
        onChange={onPageChange}
      />
    </div>
  )
}
