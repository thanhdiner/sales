import React from 'react'
import { Skeleton } from 'antd'
import {
  CircleDollarSign,
  Grid3X3,
  Package,
  ShieldCheck,
  ShoppingCart,
  UsersRound
} from 'lucide-react'
import StatCard from './StatCard'

export default function StatsSection({ loading, statsData }) {
  const statCards = [
    {
      title: 'Tổng khách hàng',
      value: statsData.totalUsers.value,
      change: statsData.totalUsers.change,
      trend: statsData.totalUsers.trend,
      icon: <UsersRound />,
      color: '#34d399',
      subInfo: [
        { label: 'Đang hoạt động', value: statsData.activeClients },
        { label: 'Dừng hoạt động', value: statsData.inactiveClients },
        { label: 'Mới tuần này', value: statsData.totalUsers.new.current }
      ]
    },
    {
      title: 'Tổng quản trị viên',
      value: statsData.totalAdmins.value,
      change: statsData.totalAdmins.change,
      trend: statsData.totalAdmins.trend,
      icon: <ShieldCheck />,
      color: '#a7b0bd',
      subInfo: [
        { label: 'Đang hoạt động', value: statsData.activeAdmins },
        { label: 'Dừng hoạt động', value: statsData.inactiveAdmins },
        { label: 'Mới tuần này', value: statsData.totalAdmins.new.current }
      ]
    },
    {
      title: 'Tổng đơn hàng',
      value: statsData.order.all.total,
      change: statsData.order.all.new.change,
      trend: statsData.order.all.new.trend,
      icon: <ShoppingCart />,
      color: '#d4d4d8',
      subInfo: [
        { label: 'Chờ xác nhận', value: statsData.order.pending.total },
        { label: 'Đã xác nhận', value: statsData.order.confirmed.total },
        { label: 'Đang giao', value: statsData.order.shipping.total },
        { label: 'Hoàn thành', value: statsData.order.completed.total },
        { label: 'Đã hủy', value: statsData.order.cancelled.total },
        { label: 'Mới tuần này', value: statsData.order.all.new.current }
      ]
    },
    {
      title: 'Doanh thu',
      value: statsData.totalRevenue.value,
      change: statsData.totalRevenue.change,
      trend: statsData.totalRevenue.trend,
      icon: <CircleDollarSign />,
      color: '#d4d4d8',
      isCurrency: true,
      sparkline: true,
      caption: 'So với tuần trước'
    },
    {
      title: 'Lợi nhuận',
      value: statsData.profit.value,
      change: statsData.profit.change,
      trend: statsData.profit.trend,
      icon: <CircleDollarSign />,
      color: '#d4d4d8',
      isCurrency: true,
      sparkline: true,
      caption: 'So với tuần trước'
    },
    {
      title: 'Sản phẩm',
      value: statsData.product.total,
      change: statsData.product.new.change,
      trend: statsData.product.new.trend,
      icon: <Package />,
      color: '#d4d4d8',
      subInfo: [
        { label: 'Đang hiển thị', value: statsData.product.active },
        { label: 'Đã ẩn', value: statsData.product.inactive },
        { label: 'Mới tuần này', value: statsData.product.new.current }
      ]
    },
    {
      title: 'Danh mục sản phẩm',
      value: statsData.category.total,
      change: statsData.category.new.change,
      trend: statsData.category.new.trend,
      icon: <Grid3X3 />,
      color: '#d4d4d8',
      subInfo: [
        { label: 'Đang hiển thị', value: statsData.category.active },
        { label: 'Đã ẩn', value: statsData.category.inactive },
        { label: 'Mới tuần này', value: statsData.category.new.current }
      ]
    }
  ]

  return (
    <section className="stats-row">
      {loading
        ? Array.from({ length: 7 }).map((_, index) => (
            <Skeleton.Button
              key={index}
              block
              active
              className="dashboard-card-skeleton"
            />
          ))
        : statCards.map(card => <StatCard key={card.title} {...card} />)}
    </section>
  )
}
