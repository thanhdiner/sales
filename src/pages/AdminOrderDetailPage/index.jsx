import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import { useAdminOrderDetail } from './hooks/useAdminOrderDetail'
import AdminOrderCustomerSection from './sections/AdminOrderCustomerSection'
import AdminOrderDigitalDeliverySection from './sections/AdminOrderDigitalDeliverySection'
import AdminOrderDetailEmptyState from './sections/AdminOrderDetailEmptyState'
import AdminOrderDetailHeaderSection from './sections/AdminOrderDetailHeaderSection'
import AdminOrderDetailLoadingState from './sections/AdminOrderDetailLoadingState'
import AdminOrderItemsSection from './sections/AdminOrderItemsSection'
import AdminOrderSummarySection from './sections/AdminOrderSummarySection'
import AdminOrderTransferSection from './sections/AdminOrderTransferSection'

const canRetryDigitalDelivery = order =>
  order?.paymentStatus === 'paid' &&
  order?.status !== 'cancelled' &&
  (order.orderItems || []).some(item => item.deliveryType === 'instant_account' && !item.digitalDeliveries?.length)

export default function AdminOrderDetailPage() {
  const { t } = useTranslation('adminOrderDetail')
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    order,
    loading,
    status,
    paymentStatus,
    updating,
    successMessage,
    handleStatusChange,
    handlePaymentStatusChange,
    handleUpdateStatus
  } = useAdminOrderDetail(id)

  const handleBack = () => {
    navigate('/admin/orders')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-[var(--admin-bg-soft)] text-[var(--admin-text)]">
        <SEO title={t('seo.title')} noIndex />
        <AdminOrderDetailLoadingState />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-[var(--admin-bg-soft)] text-[var(--admin-text)]">
        <SEO title={t('seo.title')} noIndex />
        <AdminOrderDetailEmptyState onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-3 text-[var(--admin-text)] sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-6xl">
        <AdminOrderDetailHeaderSection
          order={order}
          status={status}
          paymentStatus={paymentStatus}
          updating={updating}
          successMessage={successMessage}
          canRetryDigitalDelivery={canRetryDigitalDelivery(order)}
          onBack={handleBack}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onUpdateStatus={handleUpdateStatus}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AdminOrderCustomerSection contact={order.contact} />
            <AdminOrderItemsSection orderItems={order.orderItems} />
            <AdminOrderDigitalDeliverySection orderItems={order.orderItems} paymentStatus={order.paymentStatus} />
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
