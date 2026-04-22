import SEO from '@/components/SEO'
import { useNavigate } from 'react-router-dom'
import { useAdminOrders } from './hooks/useAdminOrders'
import AdminOrdersFiltersSection from './sections/AdminOrdersFiltersSection'
import AdminOrdersHeaderSection from './sections/AdminOrdersHeaderSection'
import AdminOrdersPaginationSection from './sections/AdminOrdersPaginationSection'
import AdminOrdersTableSection from './sections/AdminOrdersTableSection'

export default function AdminOrdersPage() {
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
  } = useAdminOrders()

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin - Đơn hàng" noIndex />

      <div className="mx-auto max-w-7xl space-y-5">
        <AdminOrdersHeaderSection />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <AdminOrdersFiltersSection
            keyword={keyword}
            status={status}
            onKeywordChange={handleKeywordChange}
            onStatusChange={handleStatusChange}
          />

          <div className="mt-5">
            <AdminOrdersTableSection
              loading={loading}
              orders={orders}
              onViewOrder={orderId => navigate(`/admin/orders/${orderId}`)}
            />
          </div>

          <AdminOrdersPaginationSection
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