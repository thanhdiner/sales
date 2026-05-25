import { get } from '@/utils/request'

const normalizeLanguage = language => {
  return language === 'en' ? 'en' : 'vi'
}

const appendLanguage = (path, language) => {
  return `${path}${path.includes('?') ? '&' : '?'}lang=${normalizeLanguage(language)}`
}

export const getSummary = language => {
  return get(appendLanguage('admin/dashboard/summary', language))
}

export const getCharts = (range = '7days', language) => {
  return get(appendLanguage(`admin/dashboard/charts?range=${range}`, language))
}

export const getUserStats = language => {
  return get(appendLanguage('admin/dashboard/stats/users', language))
}

export const getFinanceStats = language => {
  return get(appendLanguage('admin/dashboard/stats/finance', language))
}

export const getInventoryStats = language => {
  return get(appendLanguage('admin/dashboard/stats/inventory', language))
}

export const getTopCustomers = (limit = 5, language) => {
  return get(appendLanguage(`admin/dashboard/top-customers?limit=${limit}`, language))
}

export const getRecentOrders = (limit = 10, language) => {
  return get(appendLanguage(`admin/dashboard/recent-orders?limit=${limit}`, language))
}

export const getBestSellingProducts = (limit = 5, language, range = '7days') => {
  return get(appendLanguage(`admin/dashboard/best-selling-products?limit=${limit}&range=${range}`, language))
}

export const getDashboardSummary = getSummary
export const getDashboardCharts = getCharts
export const getDashboardUserStats = getUserStats
export const getDashboardFinanceStats = getFinanceStats
export const getDashboardInventoryStats = getInventoryStats
export const getDashboardTopCustomers = getTopCustomers
export const getDashboardRecentOrders = getRecentOrders
export const getDashboardBestSellingProducts = getBestSellingProducts
