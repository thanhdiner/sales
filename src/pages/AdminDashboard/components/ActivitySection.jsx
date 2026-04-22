import React from 'react'
import { Avatar, Card, Col, Row, Space, Table, Tag, Typography } from 'antd'
import TopCustomers from '@/components/TopCustomers'
import OrdersTableSkeleton from './OrdersTableSkeleton'
import { formatCurrency } from '../utils/dashboardTransforms'

const { Text } = Typography

const orderColumns = [
  {
    title: 'Đơn hàng',
    dataIndex: 'id',
    key: 'id',
    render: id => (
      <Text strong style={{ color: '#6366f1' }}>
        {id}
      </Text>
    )
  },
  {
    title: 'Khách hàng',
    key: 'customer',
    render: (_, record) => (
      <Space>
        <Avatar src={record.avatar} size={32} />
        <Text>{record.customer}</Text>
      </Space>
    )
  },
  {
    title: 'Giá trị',
    dataIndex: 'amount',
    key: 'amount',
    render: amount => (
      <Text strong style={{ color: '#059669' }}>
        {formatCurrency(amount)}
      </Text>
    )
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      const statusConfig = {
        completed: { color: 'success', text: 'Hoàn thành' },
        pending: { color: 'warning', text: 'Chờ xử lý' },
        processing: { color: 'processing', text: 'Đang xử lý' }
      }

      return <Tag color={statusConfig[status]?.color}>{statusConfig[status]?.text || status}</Tag>
    }
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    key: 'time',
    render: time => <Text type="secondary">{time}</Text>
  }
]

export default function ActivitySection({ isMobile, loading, recentOrders, topCustomers }) {
  return (
    <Row gutter={[24, 24]} className="activity-row">
      <Col xs={24} lg={8}>
        <TopCustomers
          customers={(topCustomers || []).map((user, idx) => ({
            key: user._id || idx,
            avatar: user.avatarUrl,
            name: user.fullName,
            total: user.totalSpent,
            orders: user.totalOrders,
            email: user.email
          }))}
          loading={loading}
        />
      </Col>

      <Col xs={24} lg={16}>
        <Card title="Đơn hàng gần đây" className="orders-card">
          {loading ? (
            <OrdersTableSkeleton />
          ) : (
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              pagination={false}
              size={isMobile ? 'small' : 'middle'}
              className="orders-table"
              rowKey="id"
              scroll={{ x: 680 }}
            />
          )}
        </Card>
      </Col>
    </Row>
  )
}
