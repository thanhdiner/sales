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

export const getTopCustomers = (limit = 5, language) => {
  return get(appendLanguage(`admin/dashboard/top-customers?limit=${limit}`, language))
}

export const getRecentOrders = (limit = 10, language) => {
  return get(appendLanguage(`admin/dashboard/recent-orders?limit=${limit}`, language))
}

export const getBestSellingProducts = (limit = 5, language) => {
  return get(appendLanguage(`admin/dashboard/best-selling-products?limit=${limit}`, language))
}

export const getDashboardSummary = getSummary
export const getDashboardCharts = getCharts
export const getDashboardTopCustomers = getTopCustomers
export const getDashboardRecentOrders = getRecentOrders
export const getDashboardBestSellingProducts = getBestSellingProducts
