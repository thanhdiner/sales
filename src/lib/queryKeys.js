export const AUTHENTICATED_QUERY_SCOPE = 'authenticated'
export const GUEST_QUERY_SCOPE = 'guest'

export const queryKeys = {
  websiteConfig: ['websiteConfig'],
  categories: ['productCategories', 'tree'],
  adminDashboard: range => ['adminDashboard', range],
  adminDashboardSummary: ['adminDashboard', 'summary'],
  adminDashboardCharts: range => ['adminDashboard', 'charts', range],
  adminDashboardTopCustomers: limit => ['adminDashboard', 'topCustomers', limit],
  adminDashboardRecentOrders: limit => ['adminDashboard', 'recentOrders', limit],
  adminDashboardBestSellingProducts: limit => ['adminDashboard', 'bestSellingProducts', limit],
  clientUser: scope => ['clientUser', scope],
  clientCart: scope => ['clientCart', scope],
  clientWishlist: scope => ['clientWishlist', scope]
}
