import SEO from '@/components/shared/SEO'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOrders } from './hooks/useOrders'
import OrdersFilters from './sections/OrdersFilters'
import OrdersHeader from './sections/OrdersHeader'
import OrdersPagination from './sections/OrdersPagination'
import OrdersTable from './sections/OrdersTable'

export default function Orders() {
  const { t } = useTranslation('adminOrders')
  const navigate = useNavigate()
  const {
    orders,
    loading,
    keyword,
    status,
    page,
    total,
    totalPages,
    limit,
    handleKeywordChange,
    handleStatusChange,
    handlePageChange
  } = useOrders()

  return (
    <div className="min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-3 text-[var(--admin-text)] sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <OrdersHeader />

        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow)] sm:rounded-2xl sm:p-4 lg:p-5">
          <OrdersFilters
            keyword={keyword}
            status={status}
            onKeywordChange={handleKeywordChange}
            onStatusChange={handleStatusChange}
          />

          <div className="mt-5">
            <OrdersTable
              loading={loading}
              orders={orders}
              onViewOrder={orderId => navigate(`/admin/orders/${orderId}`)}
            />
          </div>

          <OrdersPagination
            visible={!loading && orders.length > 0}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
