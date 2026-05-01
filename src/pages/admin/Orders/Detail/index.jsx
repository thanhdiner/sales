import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import { useDetail } from './hooks/useDetail'
import OrderCustomer from './sections/OrderCustomer'
import OrderDigitalDelivery from './sections/OrderDigitalDelivery'
import EmptyState from './sections/EmptyState'
import Header from './sections/Header'
import LoadingState from './sections/LoadingState'
import OrderItems from './sections/OrderItems'
import OrderSummary from './sections/OrderSummary'
import OrderTransfer from './sections/OrderTransfer'

const canRetryDigitalDelivery = order =>
  order?.paymentStatus === 'paid' &&
  order?.status !== 'cancelled' &&
  (order.orderItems || []).some(item => item.deliveryType === 'instant_account' && !item.digitalDeliveries?.length)

export default function Detail() {
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
  } = useDetail(id)

  const handleBack = () => {
    navigate('/admin/orders')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-[var(--admin-bg-soft)] text-[var(--admin-text)]">
        <SEO title={t('seo.title')} noIndex />
        <LoadingState />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-[var(--admin-bg-soft)] text-[var(--admin-text)]">
        <SEO title={t('seo.title')} noIndex />
        <EmptyState onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-3 text-[var(--admin-text)] sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-6xl">
        <Header
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
            <OrderCustomer contact={order.contact} />
            <OrderItems orderItems={order.orderItems} />
            <OrderDigitalDelivery orderItems={order.orderItems} paymentStatus={order.paymentStatus} />
          </div>

          <div className="space-y-6">
            <OrderSummary order={order} />
            <OrderTransfer transferInfo={order.transferInfo} />
          </div>
        </div>
      </div>
    </div>
  )
}
