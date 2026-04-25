import React from 'react'
import { Skeleton } from 'antd'
import { CircleDollarSign, PackagePlus, ShieldCheck, UserPlus } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { formatCurrency } from '../utils/dashboardTransforms'

const ORDER_STATUS_ITEMS = [
  { key: 'pending', label: 'Chờ xác nhận', color: '#22c55e' },
  { key: 'confirmed', label: 'Đã xác nhận', color: '#3b82f6' },
  { key: 'shipping', label: 'Đang giao', color: '#facc15' },
  { key: 'completed', label: 'Hoàn thành', color: '#94a3b8' },
  { key: 'cancelled', label: 'Đã hủy', color: '#ef4444' }
]

const extractClock = value => {
  if (!value) return '--:--'
  return String(value).match(/\d{1,2}:\d{2}/)?.[0] || '--:--'
}

const clampPercent = value => Math.max(0, Math.min(100, Number(value) || 0))

const percentOf = (value, target) => clampPercent(((Number(value) || 0) / target) * 100)

const formatNumber = value => (Number(value) || 0).toLocaleString('vi-VN')

function buildOverviewRows(statsData) {
  return [
    {
      label: 'Khách hàng',
      value: `${formatNumber(statsData.totalUsers.value)}/1000`,
      percent: percentOf(statsData.totalUsers.value, 1000)
    },
    {
      label: 'Đơn hàng',
      value: `${formatNumber(statsData.order.all.total)}/1000`,
      percent: percentOf(statsData.order.all.total, 1000)
    },
    {
      label: 'Doanh thu',
      value: formatCurrency(statsData.totalRevenue.value),
      percent: clampPercent(statsData.totalRevenue.change)
    },
    {
      label: 'Lợi nhuận',
      value: formatCurrency(statsData.profit.value),
      percent: clampPercent(statsData.profit.change)
    },
    {
      label: 'Sản phẩm',
      value: `${formatNumber(statsData.product.total)}/1000`,
      percent: percentOf(statsData.product.total, 1000)
    },
    {
      label: 'Danh mục',
      value: `${formatNumber(statsData.category.total)}/100`,
      percent: percentOf(statsData.category.total, 100)
    }
  ]
}

function buildActivityItems(statsData, recentOrders) {
  const latestOrderTime = extractClock(recentOrders?.[0]?.time)

  return [
    {
      title: 'Đơn hàng mới được tạo',
      detail: `Mới tuần này: ${formatNumber(statsData.order.all.new.current)}`,
      time: latestOrderTime,
      icon: <ShieldCheck size={18} />,
      tone: 'green'
    },
    {
      title: 'Khách hàng mới đăng ký',
      detail: `Mới tuần này: ${formatNumber(statsData.totalUsers.new.current)}`,
      time: '09:15',
      icon: <UserPlus size={18} />,
      tone: 'blue'
    },
    {
      title: 'Sản phẩm mới được thêm',
      detail: `Mới tuần này: ${formatNumber(statsData.product.new.current)}`,
      time: '08:42',
      icon: <PackagePlus size={18} />,
      tone: 'purple'
    },
    {
      title: 'Doanh thu hôm nay',
      detail: formatCurrency(statsData.totalRevenue.value),
      time: '00:01',
      icon: <CircleDollarSign size={18} />,
      tone: 'green'
    }
  ]
}

export default function ChartsSection({ recentOrders, recentOrdersLoading, statsData, statsLoading }) {
  const overviewRows = buildOverviewRows(statsData)
  const orderStatusData = ORDER_STATUS_ITEMS.map(item => ({
    ...item,
    value: Number(statsData.order[item.key]?.total) || 0
  }))
  const orderTotal = Number(statsData.order.all.total) || 0
  const chartData = orderTotal > 0 ? orderStatusData : [{ key: 'empty', label: 'Chưa có dữ liệu', value: 1, color: '#2a2d31' }]
  const activityItems = buildActivityItems(statsData, recentOrders)

  return (
    <section className="dashboard-overview-grid">
      <div className="dashboard-panel dashboard-quick-panel">
        <div className="dashboard-panel-header">
          <h2>Tổng quan nhanh</h2>
        </div>

        {statsLoading ? (
          <div className="dashboard-stack">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton.Input key={index} active block className="dashboard-line-skeleton" />
            ))}
          </div>
        ) : (
          <div className="dashboard-progress-list">
            {overviewRows.map(row => (
              <div className="dashboard-progress-row" key={row.label}>
                <div className="dashboard-progress-meta">
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                  <em>{Math.round(row.percent)}%</em>
                </div>
                <div className="dashboard-progress-track">
                  <span style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-panel dashboard-order-panel">
        <div className="dashboard-panel-header">
          <h2>Đơn hàng theo trạng thái</h2>
        </div>

        {statsLoading ? (
          <Skeleton.Input active block className="dashboard-donut-skeleton" />
        ) : (
          <div className="dashboard-order-content">
            <div className="dashboard-donut-wrap">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={78}
                    outerRadius={112}
                    paddingAngle={orderTotal > 0 ? 2 : 0}
                    stroke="var(--dashboard-surface)"
                    strokeWidth={2}
                  >
                    {chartData.map(entry => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name, props) => [formatNumber(value), props?.payload?.label || name]}
                    contentStyle={{
                      backgroundColor: 'var(--dashboard-surface-2)',
                      border: '1px solid var(--dashboard-border-strong)',
                      color: 'var(--dashboard-text)',
                      borderRadius: 8
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="dashboard-donut-center">
                <strong>{formatNumber(orderTotal)}</strong>
                <span>Tổng đơn</span>
              </div>
            </div>

            <div className="dashboard-status-list">
              {orderStatusData.map(item => {
                const percent = orderTotal ? Math.round((item.value / orderTotal) * 100) : 0

                return (
                  <div className="dashboard-status-row" key={item.key}>
                    <span className="dashboard-status-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                    <strong>
                      {formatNumber(item.value)} <em>({percent}%)</em>
                    </strong>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-panel dashboard-activity-panel">
        <div className="dashboard-panel-header">
          <h2>Hoạt động hôm nay</h2>
        </div>

        {recentOrdersLoading ? (
          <div className="dashboard-stack">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton.Input key={index} active block className="dashboard-activity-skeleton" />
            ))}
          </div>
        ) : (
          <div className="dashboard-activity-list">
            {activityItems.map(item => (
              <div className="dashboard-activity-item" key={item.title}>
                <span className={`dashboard-activity-icon ${item.tone}`}>{item.icon}</span>
                <span className="dashboard-activity-copy">
                  <strong>{item.title}</strong>
                  <em>{item.detail}</em>
                </span>
                <span className="dashboard-activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
