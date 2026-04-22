import { useNavigate, useParams } from 'react-router-dom'
import SEO from '@/components/SEO'
import { useAdminOrderDetail } from './hooks/useAdminOrderDetail'
import AdminOrderCustomerSection from './sections/AdminOrderCustomerSection'
import AdminOrderDetailEmptyState from './sections/AdminOrderDetailEmptyState'
import AdminOrderDetailHeaderSection from './sections/AdminOrderDetailHeaderSection'
import AdminOrderDetailLoadingState from './sections/AdminOrderDetailLoadingState'
import AdminOrderItemsSection from './sections/AdminOrderItemsSection'
import AdminOrderSummarySection from './sections/AdminOrderSummarySection'
import AdminOrderTransferSection from './sections/AdminOrderTransferSection'

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    order,
    loading,
    status,
    updating,
    successMessage,
    handleStatusChange,
    handleUpdateStatus
  } = useAdminOrderDetail(id)

  const handleBack = () => {
    navigate('/admin/orders')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-slate-50 dark:bg-gray-900">
        <SEO title="Admin - Chi tiết đơn" noIndex />
        <AdminOrderDetailLoadingState />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-slate-50 dark:bg-gray-900">
        <SEO title="Admin - Chi tiết đơn" noIndex />
        <AdminOrderDetailEmptyState onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin - Chi tiết đơn" noIndex />

      <div className="mx-auto max-w-6xl">
        <AdminOrderDetailHeaderSection
          order={order}
          status={status}
          updating={updating}
          successMessage={successMessage}
          onBack={handleBack}
          onStatusChange={handleStatusChange}
          onUpdateStatus={handleUpdateStatus}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AdminOrderCustomerSection contact={order.contact} />
            <AdminOrderItemsSection orderItems={order.orderItems} />
          </div>

          <div className="space-y-6">
            <AdminOrderSummarySection order={order} />
            <AdminOrderTransferSection transferInfo={order.transferInfo} />
          </div>
        </div>
      </div>
    </div>
  )
}
