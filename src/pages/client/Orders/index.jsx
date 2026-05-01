import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import { getMyOrders } from '@/services/client/commerce/order'
import OrdersEmptyState from './components/OrdersEmptyState'
import OrdersList from './sections/OrdersList'
import OrdersLoadingState from './components/OrdersLoadingState'
import OrdersHeader from './sections/OrdersHeader'
import OrdersStatsGrid from './sections/OrdersStatsGrid'
import { buildOrderStats } from './utils'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)

      try {
        const response = await getMyOrders()
        if (response.success) setOrders(response.orders)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const stats = buildOrderStats(orders)

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Đơn hàng của tôi" noIndex />

        <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center">
          <OrdersLoadingState />
        </div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Đơn hàng của tôi" noIndex />

        <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
          <OrdersEmptyState onStartShopping={() => navigate('/')} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
      <SEO title="Đơn hàng của tôi" noIndex />

      <div className="mx-auto max-w-6xl">
        <OrdersHeader />
        <OrdersStatsGrid stats={stats} />
        <OrdersList
          orders={orders}
          onSelectOrder={orderId => navigate(`/orders/${orderId}`)}
        />
      </div>
    </div>
  )
}