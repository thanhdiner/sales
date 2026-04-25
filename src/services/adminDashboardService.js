import { get } from '@/utils/request'

export const getAdminDashboardSummary = () => get('admin/dashboard/summary')
export const getAdminDashboardCharts = (range = '7days') => get(`admin/dashboard/charts?range=${range}`)
export const getAdminDashboardTopCustomers = (limit = 5) => get(`admin/dashboard/top-customers?limit=${limit}`)
export const getAdminDashboardRecentOrders = (limit = 10) => get(`admin/dashboard/recent-orders?limit=${limit}`)
export const getAdminDashboardBestSellingProducts = (limit = 5) =>
  get(`admin/dashboard/best-selling-products?limit=${limit}`)
