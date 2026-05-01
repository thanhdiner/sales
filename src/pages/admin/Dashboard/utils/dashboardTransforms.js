export const DATE_RANGE_OPTIONS = [
  { value: '7days', labelKey: 'dateRanges.7days' },
  { value: '30days', labelKey: 'dateRanges.30days' },
  { value: '90days', labelKey: 'dateRanges.90days' }
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

export const getDashboardLocale = language => (String(language || '').startsWith('en') ? 'en-US' : 'vi-VN')

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const getLocalizedText = (item, field, language, fallback = '') => {
  if (!item) return fallback

  const translatedValue = isEnglishLanguage(language) ? item.translations?.en?.[field] : null
  const localizedValue = isEnglishLanguage(language)
    ? item[`localized${field.charAt(0).toUpperCase()}${field.slice(1)}`] || item.localizedName
    : null
  const baseValue = item[field]

  if (hasText(translatedValue)) return translatedValue
  if (hasText(localizedValue)) return localizedValue
  if (hasText(baseValue)) return baseValue
  if (hasText(fallback)) return fallback

  return fallback
}

export const formatCurrency = (value, locale = 'vi-VN') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(Number(value) || 0)

export const getSalesChartTitle = (dateRange, t) => {
  if (dateRange === '7days') return t?.('salesChart.last7Days') || 'Doanh thu 7 ngày qua'
  if (dateRange === '30days') return t?.('salesChart.last30Days') || 'Doanh thu 30 ngày qua'
  return t?.('salesChart.last3Months') || 'Doanh thu 3 tháng qua'
}

const getSalesLabel = (dateStr, total, locale) => {
  const date = new Date(dateStr)

  if (total <= 7) {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)
  }

  return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' })
}

export const normalizeDashboardPayload = (rawStats, language = 'vi') => {
  const stats = rawStats || {}
  const salesArr = stats.salesNDays || stats.sales7days || []
  const locale = getDashboardLocale(language)

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
      name: getSalesLabel(item.date, salesArr.length, locale),
      value: Number(item.value) || 0
    })),
    categoryData: (stats.categoryStats || []).map(item => ({
      name: getLocalizedText(item, 'title', language, item.name),
      value: Number(item.total) || 0
    })),
    recentOrders: (stats.recentOrders || []).map((order, idx) => ({
      id: order.orderId ? `#${order.orderId.toString().slice(-6)}` : `#ORD-${idx + 1}`,
      customer: order.customer,
      avatar: order.avatar,
      amount: Number(order.amount) || 0,
      status: order.status,
      time: new Date(order.time).toLocaleString(locale, { hour12: false })
    })),
    topProducts: (stats.topProducts || []).map(product => ({
      ...product,
      name: getLocalizedText(product, 'title', language, product.name)
    }))
  }
}
