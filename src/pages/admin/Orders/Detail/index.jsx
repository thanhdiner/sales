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
import OrderStatusUpdate from './sections/OrderStatusUpdate'
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
      <div className="flex min-h-screen items-center justify-center text-[var(--admin-text)]">
        <SEO title={t('seo.title')} noIndex />
        <LoadingState />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--admin-text)]">
        <SEO title={t('seo.title')} noIndex />
        <EmptyState onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="text-[var(--admin-text)]">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-5xl">
        <Header
          order={order}
          successMessage={successMessage}
          onBack={handleBack}
        />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-3">
            <OrderCustomer contact={order.contact} />
            <OrderItems orderItems={order.orderItems} />
            <OrderDigitalDelivery orderItems={order.orderItems} paymentStatus={order.paymentStatus} />
          </div>

          <div className="space-y-4 lg:sticky lg:top-4 lg:-mt-24">
            <OrderStatusUpdate
              status={status}
              paymentStatus={paymentStatus}
              updating={updating}
              hasStatusChanges={status !== order.status || paymentStatus !== order.paymentStatus}
              canRetryDigitalDelivery={canRetryDigitalDelivery(order)}
              onStatusChange={handleStatusChange}
              onPaymentStatusChange={handlePaymentStatusChange}
              onUpdateStatus={handleUpdateStatus}
            />
            <OrderSummary order={order} />
            <OrderTransfer transferInfo={order.transferInfo} />
          </div>
        </div>
      </div>
    </div>
  )
}
