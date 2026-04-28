import { get } from '@/utils/request'

const normalizeLanguage = language => (language === 'en' ? 'en' : 'vi')

const appendLanguage = (path, language) => `${path}${path.includes('?') ? '&' : '?'}lang=${normalizeLanguage(language)}`

export const getAdminDashboardSummary = language => get(appendLanguage('admin/dashboard/summary', language))
export const getAdminDashboardCharts = (range = '7days', language) =>
  get(appendLanguage(`admin/dashboard/charts?range=${range}`, language))
export const getAdminDashboardTopCustomers = (limit = 5, language) =>
  get(appendLanguage(`admin/dashboard/top-customers?limit=${limit}`, language))
export const getAdminDashboardRecentOrders = (limit = 10, language) =>
  get(appendLanguage(`admin/dashboard/recent-orders?limit=${limit}`, language))
export const getAdminDashboardBestSellingProducts = (limit = 5, language) =>
  get(appendLanguage(`admin/dashboard/best-selling-products?limit=${limit}`, language))
