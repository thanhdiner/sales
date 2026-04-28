export const AUTHENTICATED_QUERY_SCOPE = 'authenticated'
export const GUEST_QUERY_SCOPE = 'guest'

export const queryKeys = {
  websiteConfig: language => ['websiteConfig', language],
  categories: language => ['productCategories', 'tree', language],
  adminDashboard: (range, language) => ['adminDashboard', range, language],
  adminDashboardSummary: language => ['adminDashboard', 'summary', language],
  adminDashboardCharts: (range, language) => ['adminDashboard', 'charts', range, language],
  adminDashboardTopCustomers: (limit, language) => ['adminDashboard', 'topCustomers', limit, language],
  adminDashboardRecentOrders: (limit, language) => ['adminDashboard', 'recentOrders', limit, language],
  adminDashboardBestSellingProducts: (limit, language) => ['adminDashboard', 'bestSellingProducts', limit, language],
  clientUser: scope => ['clientUser', scope],
  clientCart: scope => ['clientCart', scope],
  clientWishlist: scope => ['clientWishlist', scope]
}
