import { useEffect, useState } from 'react'
import { message, Modal } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import { cancelOrder, getOrderDetail } from '@/services/client/commerce/order'
import OrderAccountInfoModal from './components/OrderAccountInfoModal'
import OrderDeliveryInfo from './components/OrderDeliveryInfo'
import Header from './sections/Header'
import LoadingState from './sections/LoadingState'
import OrderItems from './components/OrderItems'
import OrderSummaryCard from './components/OrderSummaryCard'
import { getShortOrderId } from './utils'

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)

      try {
        const response = await getOrderDetail(id)

        if (response && response.success) {
          setOrder(response.order)
        } else {
          navigate('/orders')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleCancelOrder = () => {
    Modal.confirm({
      title: <span className="text-gray-900 dark:text-gray-100">Xác nhận hủy đơn hàng</span>,
      content: <span className="text-gray-600 dark:text-gray-300">Bạn có chắc muốn hủy đơn hàng này không?</span>,
      okText: 'Hủy đơn',
      cancelText: 'Không',
      okButtonProps: { danger: true, loading: cancelling },
      onOk: async () => {
        setCancelling(true)

        try {
          const response = await cancelOrder(order._id)

          if (response.success) {
            message.success('Đã hủy đơn hàng thành công!')
            setOrder(response.order)
          } else {
            message.error(response.error || 'Không thể hủy đơn hàng!')
          }
        } catch (error) {
          message.error('Có lỗi xảy ra, vui lòng thử lại!')
        } finally {
          setCancelling(false)
        }
      },
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Chi tiết đơn hàng" noIndex />
        <LoadingState />
      </div>
    )
  }

  if (!order) return null

  const shortOrderId = getShortOrderId(order._id)

  return (
    <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
      <SEO title="Chi tiết đơn hàng" noIndex />

      <div className="mx-auto max-w-6xl">
        <Header
          orderId={shortOrderId}
          status={order.status}
          onBack={() => navigate('/orders')}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <OrderDeliveryInfo contact={order.contact} />
            <OrderItems items={order.orderItems} />
          </div>

          <aside className="lg:col-span-1">
            <OrderSummaryCard
              order={order}
              canCancel={order.status === 'pending'}
              cancelling={cancelling}
              onCancelOrder={handleCancelOrder}
              onOpenAccountInfo={() => setIsAccountModalOpen(true)}
              onContactSupport={() => navigate('/contact')}
            />
          </aside>
        </div>
      </div>

      <OrderAccountInfoModal
        open={isAccountModalOpen}
        order={order}
        orderCode={shortOrderId}
        onClose={() => setIsAccountModalOpen(false)}
        onContactSupport={() => navigate('/contact')}
      />
    </div>
  )
}
