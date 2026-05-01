import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'

export default function NotificationsPagination({ page, pageSize, total, onPageChange }) {
  const { t } = useTranslation('adminNotifications')

  if (total === 0) return null

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--admin-text-muted)]">
        {t('pagination.total', { count: total })}
      </p>
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        pageSizeOptions={[5, 10, 20, 50]}
        onChange={onPageChange}
      />
    </section>
  )
}
