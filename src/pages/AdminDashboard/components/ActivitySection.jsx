import React from 'react'
import { Avatar, Empty, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { formatCurrency } from '../utils/dashboardTransforms'

const STATUS_CONFIG = {
  completed: { label: 'Hoàn thành', className: 'success' },
  pending: { label: 'Chờ xác nhận', className: 'warning' },
  confirmed: { label: 'Đã xác nhận', className: 'info' },
  processing: { label: 'Đang xử lý', className: 'info' },
  shipping: { label: 'Đang giao', className: 'shipping' },
  cancelled: { label: 'Đã hủy', className: 'danger' }
}

const extractClock = value => String(value || '').match(/\d{1,2}:\d{2}/)?.[0] || '--:--'

const getInitials = value => {
  const parts = String(value || 'KH').trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || 'K'
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || 'H'

  return `${first}${last}`.toUpperCase()
}

function CustomerList({ customers, loading }) {
  if (loading) {
    return (
      <div className="dashboard-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input key={index} active block className="dashboard-row-skeleton" />
        ))}
      </div>
    )
  }

  if (!customers.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu khách hàng" />
  }

  return (
    <div className="dashboard-list">
      {customers.map((user, index) => (
        <div className="dashboard-list-row dashboard-customer-row" key={user.key || `${user.name}-${index}`}>
          <Avatar src={user.avatar} size={38} className="dashboard-avatar">
            {getInitials(user.name)}
          </Avatar>
          <div className="dashboard-row-copy">
            <strong>{user.name || 'Khách hàng'}</strong>
            <span>{formatCurrency(user.total)} - {user.orders || 0} đơn</span>
          </div>
          <span className="dashboard-status-badge success">Hoạt động</span>
        </div>
      ))}
    </div>
  )
}

function OrdersList({ orders, loading }) {
  if (loading) {
    return (
      <div className="dashboard-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input key={index} active block className="dashboard-row-skeleton" />
        ))}
      </div>
    )
  }

  if (!orders.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn hàng gần đây" />
  }

  return (
    <div className="dashboard-list">
      {orders.slice(0, 5).map(order => {
        const status = STATUS_CONFIG[order.status] || { label: order.status || 'Không rõ', className: 'neutral' }

        return (
          <div className="dashboard-list-row dashboard-order-row" key={order.id}>
            <span className="dashboard-square-icon">
              <ShoppingCart size={17} />
            </span>
            <strong className="dashboard-order-id">{order.id}</strong>
            <span className={`dashboard-status-badge ${status.className}`}>{status.label}</span>
            <span className="dashboard-order-amount">{formatCurrency(order.amount)}</span>
            <span className="dashboard-order-time">{extractClock(order.time)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function ActivitySection({
  recentOrders,
  recentOrdersLoading,
  topCustomers,
  topCustomersLoading
}) {
  const customers = (topCustomers || [])
    .filter(user => user && typeof user.totalSpent === 'number')
    .map((user, idx) => ({
      key: user._id || idx,
      avatar: user.avatarUrl,
      name: user.fullName || user.email,
      total: user.totalSpent,
      orders: user.totalOrders
    }))

  return (
    <section className="dashboard-bottom-grid dashboard-bottom-grid--half">
      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>Khách hàng nổi bật</h2>
        </div>
        <CustomerList customers={customers} loading={topCustomersLoading} />
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-header dashboard-panel-header--action">
          <h2>Đơn hàng gần nhất</h2>
          <Link to="/admin/orders">Xem tất cả</Link>
        </div>
        <OrdersList orders={recentOrders || []} loading={recentOrdersLoading} />
      </div>
    </section>
  )
}
