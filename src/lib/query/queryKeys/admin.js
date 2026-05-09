export const adminQueryKeys = {
  dashboard: (range, language) => ['adminDashboard', range, language],
  dashboardSummary: language => ['adminDashboard', 'summary', language],
  dashboardCharts: (range, language) => ['adminDashboard', 'charts', range, language],
  dashboardTopCustomers: (limit, language) => ['adminDashboard', 'topCustomers', limit, language],
  dashboardRecentOrders: (limit, language) => ['adminDashboard', 'recentOrders', limit, language],
  dashboardBestSellingProducts: (limit, language, range) => ['adminDashboard', 'bestSellingProducts', limit, language, range],
  dashboardLowStockProducts: (limit, language, threshold) => ['adminDashboard', 'lowStockProducts', limit, language, threshold]
}
