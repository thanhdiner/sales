export const DATE_RANGE_OPTIONS = [
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
  { value: '90days', label: '3 tháng qua' }
]

const buildValueMetric = raw => ({
  value: Number(raw?.value) || 0,
  change: Number(raw?.change) || 0,
  trend: raw?.trend || 'up'
})

const buildCountMetric = raw => ({
  value: Number(raw?.total) || 0,
  change: Number(raw?.new?.change) || 0,
  trend: raw?.new?.trend || 'up',
  new: { current: Number(raw?.new?.current) || 0 }
})

const buildOrderMetric = raw => ({
  total: Number(raw?.total) || 0,
  new: {
    current: Number(raw?.new?.current) || 0,
    change: Number(raw?.new?.change) || 0,
    trend: raw?.new?.trend || 'up'
  }
})

const buildEntityMetric = raw => ({
  total: Number(raw?.total) || 0,
  active: Number(raw?.active) || 0,
  inactive: Number(raw?.inactive) || 0,
  new: {
    current: Number(raw?.new?.current) || 0,
    change: Number(raw?.new?.change) || 0,
    trend: raw?.new?.trend || 'up'
  }
})

export const createEmptyStatsData = () => ({
  totalUsers: buildCountMetric(),
  totalAdmins: buildCountMetric(),
  order: {
    all: buildOrderMetric(),
    pending: buildOrderMetric(),
    confirmed: buildOrderMetric(),
    shipping: buildOrderMetric(),
    completed: buildOrderMetric(),
    cancelled: buildOrderMetric()
  },
  product: buildEntityMetric(),
  category: buildEntityMetric(),
  totalRevenue: buildValueMetric(),
  profit: buildValueMetric(),
  topCustomers: [],
  activeClients: 0,
  inactiveClients: 0,
  activeAdmins: 0,
  inactiveAdmins: 0
})

export const getPieColor = (idx, total) => `hsl(${(idx * 360) / Math.max(total, 1)}, 70%, 56%)`

export const formatCurrency = value =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value) || 0)

export const getSalesChartTitle = dateRange => {
  if (dateRange === '7days') return 'Doanh thu 7 ngày qua'
  if (dateRange === '30days') return 'Doanh thu 30 ngày qua'
  return 'Doanh thu 3 tháng qua'
}

const getSalesLabel = (dateStr, total) => {
  const date = new Date(dateStr)

  if (total <= 7) {
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return daysOfWeek[date.getDay()]
  }

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export const normalizeDashboardPayload = rawStats => {
  const stats = rawStats || {}
  const salesArr = stats.salesNDays || stats.sales7days || []

  return {
    statsData: {
      totalUsers: buildCountMetric(stats.user),
      totalAdmins: buildCountMetric(stats.adminAccount),
      order: {
        all: buildOrderMetric(stats.order?.all),
        pending: buildOrderMetric(stats.order?.pending),
        confirmed: buildOrderMetric(stats.order?.confirmed),
        shipping: buildOrderMetric(stats.order?.shipping),
        completed: buildOrderMetric(stats.order?.completed),
        cancelled: buildOrderMetric(stats.order?.cancelled)
      },
      product: buildEntityMetric(stats.product),
      category: buildEntityMetric(stats.category),
      totalRevenue: buildValueMetric(stats.totalRevenue),
      profit: buildValueMetric(stats.profit),
      topCustomers: stats.topCustomers || [],
      activeClients: Number(stats.user?.active) || 0,
      inactiveClients: Number(stats.user?.inactive) || 0,
      activeAdmins: Number(stats.adminAccount?.active) || 0,
      inactiveAdmins: Number(stats.adminAccount?.inactive) || 0
    },
    salesData: salesArr.map(item => ({
      name: getSalesLabel(item.date, salesArr.length),
      value: Number(item.value) || 0
    })),
    categoryData: (stats.categoryStats || []).map(item => ({
      name: item.name,
      value: Number(item.total) || 0
    })),
    recentOrders: (stats.recentOrders || []).map((order, idx) => ({
      id: order.orderId ? `#${order.orderId.toString().slice(-6)}` : `#ORD-${idx + 1}`,
      customer: order.customer,
      avatar: order.avatar,
      amount: Number(order.amount) || 0,
      status: order.status,
      time: new Date(order.time).toLocaleString('vi-VN', { hour12: false })
    })),
    topProducts: stats.topProducts || []
  }
}
