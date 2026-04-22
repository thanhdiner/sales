import React from 'react'
import { AppstoreOutlined, DollarCircleOutlined, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons'
import { Col, Row, Skeleton } from 'antd'
import StatCard from './StatCard'

export default function StatsSection({ loading, statsData }) {
  const statCards = [
    {
      title: 'Tổng khách hàng',
      value: statsData.totalUsers.value,
      change: statsData.totalUsers.change,
      trend: statsData.totalUsers.trend,
      icon: <TeamOutlined />,
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
      icon: <TeamOutlined />,
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
      icon: <ShoppingCartOutlined />,
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
      icon: <DollarCircleOutlined />,
      isCurrency: true
    },
    {
      title: 'Lợi nhuận',
      value: statsData.profit.value,
      change: statsData.profit.change,
      trend: statsData.profit.trend,
      icon: <DollarCircleOutlined />,
      isCurrency: true
    },
    {
      title: 'Sản phẩm',
      value: statsData.product.total,
      change: statsData.product.new.change,
      trend: statsData.product.new.trend,
      icon: <ShoppingCartOutlined />,
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
      icon: <AppstoreOutlined />,
      subInfo: [
        { label: 'Đang hiển thị', value: statsData.category.active },
        { label: 'Đã ẩn', value: statsData.category.inactive },
        { label: 'Mới tuần này', value: statsData.category.new.current }
      ]
    }
  ]

  return (
    <Row gutter={[16, 16]} className="stats-row">
      {loading
        ? Array.from({ length: 7 }).map((_, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={index}>
              <Skeleton.Button
                block
                active
                style={{
                  width: '100%',
                  height: 176,
                  borderRadius: 16
                }}
              />
            </Col>
          ))
        : statCards.map(card => (
            <Col xs={24} sm={12} lg={8} xl={6} key={card.title}>
              <StatCard {...card} />
            </Col>
          ))}
    </Row>
  )
}