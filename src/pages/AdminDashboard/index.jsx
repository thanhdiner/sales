import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Table, Tag, Avatar, Typography, Space, Select, Skeleton } from 'antd'
import {
  ShoppingCartOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts'
import './AdminDashboard.scss'
import SEO from '@/components/SEO'
import { getAdminDashboard } from '@/services/adminDashboardService'
import TopCustomers from '@/components/TopCustomers'

const { Title, Text } = Typography
const { Option } = Select

const getPieColor = (idx, total) => `hsl(${(idx * 360) / total}, 70%, 56%)`

export default function AdminDashboard() {const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('7days')
  const [isMobile, setIsMobile] = useState(false)
  const [statsData, setStatsData] = useState({
    totalUsers: { value: 0, change: 0, trend: 'up', new: { current: 0 } },
    totalAdmins: { value: 0, change: 0, trend: 'up', new: { current: 0 } },
    order: {
      all: { total: 0, new: { current: 0, change: 0, trend: 'up' } },
      pending: { total: 0, new: { current: 0, change: 0, trend: 'up' } },
      confirmed: { total: 0, new: { current: 0, change: 0, trend: 'up' } },
      shipping: { total: 0, new: { current: 0, change: 0, trend: 'up' } },
      completed: { total: 0, new: { current: 0, change: 0, trend: 'up' } },
      cancelled: { total: 0, new: { current: 0, change: 0, trend: 'up' } }
    },
    product: { total: 0, active: 0, inactive: 0, new: { current: 0 } },
    category: { total: 0, active: 0, inactive: 0, new: { current: 0 } },
    totalRevenue: { value: 0, change: 0, trend: 'up' },
    profit: { value: 0, change: 0, trend: 'up' },
    topCustomers: [],
    activeClients: 0,
    inactiveClients: 0,
    activeAdmins: 0,
    inactiveAdmins: 0
  })
  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      try {
        const res = await getAdminDashboard(dateRange)
        const stats = res.data

        setStatsData(prev => ({
          ...prev,
          totalUsers: {
            value: stats.user?.total || 0,
            change: stats.user?.new?.change || 0,
            trend: stats.user?.new?.trend || 'up',
            new: { current: stats.user?.new?.current || 0 }
          },
          totalAdmins: {
            value: stats.adminAccount?.total || 0,
            change: stats.adminAccount?.new?.change || 0,
            trend: stats.adminAccount?.new?.trend || 'up',
            new: { current: stats.adminAccount?.new?.current || 0 }
          },
          order: {
            all: stats.order?.all || { total: 0, new: { current: 0, change: 0, trend: 'up' } },
            pending: stats.order?.pending || { total: 0, new: { current: 0, change: 0, trend: 'up' } },
            confirmed: stats.order?.confirmed || { total: 0, new: { current: 0, change: 0, trend: 'up' } },
            shipping: stats.order?.shipping || { total: 0, new: { current: 0, change: 0, trend: 'up' } },
            completed: stats.order?.completed || { total: 0, new: { current: 0, change: 0, trend: 'up' } },
            cancelled: stats.order?.cancelled || { total: 0, new: { current: 0, change: 0, trend: 'up' } }
          },
          product: stats.product || { total: 0, active: 0, inactive: 0, new: { current: 0 } },
          category: stats.category || { total: 0, active: 0, inactive: 0, new: { current: 0 } },
          totalRevenue: stats.totalRevenue || { value: 0, change: 0, trend: 'up' },
          profit: stats.profit || { value: 0, change: 0, trend: 'up' },
          topCustomers: stats.topCustomers || [],
          activeClients: stats.user?.active || 0,
          inactiveClients: stats.user?.inactive || 0,
          activeAdmins: stats.adminAccount?.active || 0,
          inactiveAdmins: stats.adminAccount?.inactive || 0
        }))

        // Lấy đúng dữ liệu theo key mới của BE
        const salesArr = stats.salesNDays || stats.sales7days || []

        function getLabel(dateStr, total) {
          const date = new Date(dateStr)
          if (total <= 7) {
            const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
            return daysOfWeek[date.getDay()]
          }
          // Nếu nhiều hơn 7 ngày thì hiện ngày/tháng
          return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        }

        const _salesData = salesArr.map(item => ({
          name: getLabel(item.date, salesArr.length),
          value: item.value || 0
        }))
        setSalesData(_salesData)

        const _categoryData = (stats.categoryStats || []).map(item => ({
          name: item.name,
          value: item.total
        }))
        setCategoryData(_categoryData)

        setRecentOrders(
          (stats.recentOrders || []).map((order, idx) => ({
            id: order.orderId ? `#${order.orderId.toString().slice(-6)}` : `#ORD-${idx + 1}`,
            customer: order.customer,
            avatar: order.avatar,
            amount: order.amount,
            status: order.status,
            time: new Date(order.time).toLocaleString('vi-VN', { hour12: false })
          }))
        )

        setTopProducts(stats.topProducts || [])
      } catch (err) {
        console.error('Lỗi lấy dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [dateRange])

  // Detect mobile / tablet to adjust component heights & density
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
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

  const formatCurrency = value => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const StatCard = ({ title, value, change, trend, icon, color, prefix = '', subInfo = [], isCurrency }) => (
    <Card className="stat-card dark:bg-gray-900 dark:text-gray-100 shadow-md rounded-2xl border-0" hoverable>
      <div className="stat-content " style={{ display: 'flex', gap: 16 }}>
        <div
          className="stat-icon"
          style={{
            background: `${color}1A`,
            borderRadius: 12,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {React.cloneElement(icon, { style: { color, fontSize: 28 } })}
        </div>
        <div className="stat-info" style={{ flex: 1 }}>
          <div className="stat-title" style={{ color: '#64748b', fontWeight: 500, fontSize: 16 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1f2937', marginTop: 4 }} className="stat-value">
            {isCurrency
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
              : value.toLocaleString('vi-VN')}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: trend === 'up' ? '#d1fae5' : '#fee2e2',
              color: trend === 'up' ? '#059669' : '#ef4444',
              fontSize: 13,
              padding: '2px 6px',
              borderRadius: 8,
              marginTop: 4
            }}
          >
            {trend === 'up' ? (
              <ArrowUpOutlined style={{ fontSize: 12, marginRight: 4 }} />
            ) : (
              <ArrowDownOutlined style={{ fontSize: 12, marginRight: 4 }} />
            )}
            {change}%
          </div>
          {/* Sub info - xuống hết hàng riêng luôn */}
          {subInfo?.map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              • {item.label}: <strong>{(item.value ?? 0).toLocaleString('vi-VN')}</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="dashboard-container dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid rounded-xl">
      <SEO title="Admin – Tổng quan" noIndex />
            <div className="dashboard-header dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
        <div className="header-content">
          <div className="title-section">
            <Title level={1} className="dashboard-title">
              Dashboard
            </Title>
            <Text className="dashboard-subtitle">Chào mừng bạn quay trở lại! Đây là tổng quan hoạt động hệ thống.</Text>
          </div>
          <div className="header-actions">
            <Space size="middle">
              <Select value={dateRange} onChange={setDateRange} className="date-select" disabled={loading}>
                <Option value="7days">7 ngày qua</Option>
                <Option value="30days">30 ngày qua</Option>
                <Option value="90days">3 tháng qua</Option>
              </Select>
            </Space>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="stats-row">
          {loading ? (
            Array(7)
              .fill(0)
              .map((_, idx) => (
                <Col xs={24} sm={12} lg={6} key={idx}>
                  <Skeleton.Button block active style={{ width: '100%', height: 290, borderRadius: 18 }} />
                </Col>
              ))
          ) : (
            <>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Tổng khách hàng"
                  value={statsData.totalUsers.value}
                  change={statsData.totalUsers.change}
                  trend={statsData.totalUsers.trend}
                  icon={<TeamOutlined />}
                  color="#6366f1"
                  subInfo={[
                    { label: 'Đang hoạt động', value: statsData.activeClients },
                    { label: 'Dừng hoạt động', value: statsData.inactiveClients },
                    { label: 'Mới tuần này', value: statsData.totalUsers.new.current }
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Tổng quản trị viên"
                  value={statsData.totalAdmins.value}
                  change={statsData.totalAdmins.change}
                  trend={statsData.totalAdmins.trend}
                  icon={<TeamOutlined />}
                  color="#3b82f6"
                  subInfo={[
                    { label: 'Đang hoạt động', value: statsData.activeAdmins },
                    { label: 'Dừng hoạt động', value: statsData.inactiveAdmins },
                    { label: 'Mới tuần này', value: statsData.totalAdmins.new.current }
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Tổng đơn hàng"
                  value={statsData.order.all.total}
                  change={statsData.order.all.new.change}
                  trend={statsData.order.all.new.trend}
                  icon={<ShoppingCartOutlined />}
                  color="#8b5cf6"
                  subInfo={[
                    { label: 'Chờ xác nhận', value: statsData.order.pending.total },
                    { label: 'Đã xác nhận', value: statsData.order.confirmed.total },
                    { label: 'Đang giao', value: statsData.order.shipping.total },
                    { label: 'Hoàn thành', value: statsData.order.completed.total },
                    { label: 'Đã hủy', value: statsData.order.cancelled.total },
                    { label: 'Mới tuần này', value: statsData.order.all.new.current }
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Doanh thu"
                  value={statsData.totalRevenue.value}
                  change={statsData.totalRevenue.change}
                  trend={statsData.totalRevenue.trend}
                  icon={<DollarCircleOutlined />}
                  color="#10b981"
                  isCurrency
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Lợi nhuận"
                  value={statsData.profit.value}
                  change={statsData.profit.change}
                  trend={statsData.profit.trend}
                  icon={<DollarCircleOutlined />}
                  color="#fbbf24"
                  isCurrency
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Sản phẩm"
                  value={statsData.product.total}
                  change={statsData.product.new.change}
                  trend={statsData.product.new.trend}
                  icon={<ShoppingCartOutlined />}
                  color="#f43f5e"
                  subInfo={[
                    { label: 'Đang hiển thị', value: statsData.product.active },
                    { label: 'Đã ẩn', value: statsData.product.inactive },
                    { label: 'Mới tuần này', value: statsData.product.new.current }
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Danh mục sản phẩm"
                  value={statsData.category.total}
                  change={statsData.category.new.change}
                  trend={statsData.category.new.trend}
                  icon={<AppstoreOutlined />}
                  color="#fb923c"
                  subInfo={[
                    { label: 'Đang hiển thị', value: statsData.category.active },
                    { label: 'Đã ẩn', value: statsData.category.inactive },
                    { label: 'Mới tuần này', value: statsData.category.new.current }
                  ]}
                />
              </Col>
            </>
          )}
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]} className="charts-row">
          <Col xs={24} lg={16}>
            {loading ? (
              <Skeleton.Input block active style={{ width: '100%', height: 404, borderRadius: 20 }} />
            ) : (
              <Card
                title={
                  dateRange === '7days'
                    ? 'Doanh thu 7 ngày qua'
                    : dateRange === '30days'
                    ? 'Doanh thu 30 ngày qua'
                    : 'Doanh thu 3 tháng qua'
                }
                className="chart-card"
              >
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={value => `${(value / 1000000).toFixed(0)}M`} />
                    <RechartsTooltip
                      formatter={value => [formatCurrency(value), 'Doanh thu']}
                      labelStyle={{ color: '#1f2937' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
          </Col>
          <Col xs={24} lg={8}>
            {loading ? (
              <Skeleton.Input block active style={{ width: '100%', height: 404, borderRadius: 20 }} />
            ) : (
              <Card title="Phân loại sản phẩm" className="chart-card">
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={false}
                      labelLine={false}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={entry.name} fill={getPieColor(idx, categoryData.length)} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name, props) => [`${value} sản phẩm`, categoryData[props.dataIndex]?.name ?? name]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </Col>
        </Row>

        {/* Activity & Orders Row */}
        <Row gutter={[24, 24]} className="activity-row">
          <Col xs={24} lg={8}>
            <TopCustomers
              customers={(statsData.topCustomers || []).map((user, idx) => ({
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
            <Card title="Đơn hàng gần đây" className="orders-card ">
              {loading ? (
                <div className="orders-table-skeleton">
                  <table>
                    <thead>
                      <tr>
                        <th>Đơn hàng</th>
                        <th>Khách hàng</th>
                        <th>Giá trị</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array(8)
                        .fill(0)
                        .map((_, idx) => (
                          <tr key={idx}>
                            <td>
                              <Skeleton.Input className="skeleton-input" style={{ width: 72 }} active size="small" />
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
                                <Skeleton.Avatar active size={32} shape="circle" style={{ margin: 0 }} />
                                <Skeleton.Input
                                  className="skeleton-input"
                                  style={{ width: 88, height: 32, borderRadius: 8, margin: 0, lineHeight: '32px' }}
                                  active
                                  size="small"
                                />
                              </div>
                            </td>

                            <td>
                              <Skeleton.Input className="skeleton-input" style={{ width: 80 }} active size="small" />
                            </td>
                            <td>
                              <Skeleton.Button className="skeleton-btn" style={{ width: 72 }} active size="small" />
                            </td>
                            <td>
                              <Skeleton.Input className="skeleton-input" style={{ width: 98 }} active size="small" />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
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

        {/* Top Products */}
        <Row gutter={[24, 24]} className="products-row">
          <Col span={24}>
            <Card title="Sản phẩm bán chạy" className="products-card">
              <Row gutter={[16, 16]}>
                {loading
                  ? Array(9)
                      .fill(0)
                      .map((_, idx) => (
                        <Col xs={24} sm={12} lg={8} xl={4.8} key={idx}>
                          <div className="product-item dark:bg-gray-800 dark:outline dark:outline-bg-gray-600 dark:outline-1 dark:outline-solid">
                            <div className="product-img-wrapper" style={{ marginBottom: 12 }}>
                              <Skeleton.Avatar shape="square" size={64} active style={{ borderRadius: 12 }} />
                            </div>
                            <div className="product-rank">
                              <Skeleton.Input style={{ width: 28, height: 18, borderRadius: 6 }} active size="small" />
                            </div>
                            <div className="product-info" style={{ paddingRight: 20 }}>
                              <Skeleton.Input style={{ width: 72, height: 40, borderRadius: 6, marginBottom: 12 }} active size="small" />
                              <div className="product-stats" style={{ marginBottom: 12 }}>
                                <div className="stat" style={{ marginBottom: 4 }}>
                                  <Skeleton.Input style={{ width: 44, height: 16, borderRadius: 5, marginRight: 6 }} active size="small" />
                                  <Skeleton.Input style={{ width: 24, height: 16, borderRadius: 5 }} active size="small" />
                                </div>
                                <div className="stat">
                                  <Skeleton.Input style={{ width: 54, height: 16, borderRadius: 5, marginRight: 6 }} active size="small" />
                                  <Skeleton.Input style={{ width: 42, height: 16, borderRadius: 5 }} active size="small" />
                                </div>
                              </div>
                              <Skeleton.Button style={{ width: 48, height: 18, borderRadius: 8 }} active size="small" />
                            </div>
                          </div>
                        </Col>
                      ))
                  : topProducts.map((product, index) => (
                      <Col xs={24} sm={12} lg={8} xl={4.8} key={index}>
                        <div className="product-item dark:bg-gray-800 dark:outline dark:outline-bg-gray-600 dark:outline-1 dark:outline-solid">
                          <div className="product-img-wrapper">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="product-rank">#{index + 1}</div>
                          <div className="product-info">
                            <Text strong className="product-name">
                              {product.name}
                            </Text>
                            <div className="product-stats">
                              <div className="stat">
                                <Text type="secondary">Đã bán: </Text>
                                <Text strong>{product.sales}</Text>
                              </div>
                              <div className="stat">
                                <Text type="secondary">Doanh thu: </Text>
                                <Text strong style={{ color: '#059669' }}>
                                  {formatCurrency(product.revenue)}
                                </Text>
                              </div>
                            </div>
                            <div className={`product-trend ${product.trend}`}>
                              {product.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                              <Text>{product.trend === 'up' ? 'Tăng' : 'Giảm'}</Text>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
