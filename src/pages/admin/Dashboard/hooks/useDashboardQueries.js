import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { adminQueryKeys } from '@/lib/query/queryKeys/index.js'
import { getProducts } from '@/services/admin/commerce/product'
import {
  getDashboardBestSellingProducts,
  getDashboardCharts,
  getDashboardFinanceStats,
  getDashboardInventoryStats,
  getDashboardRecentOrders,
  getDashboardSummary,
  getDashboardTopCustomers,
  getDashboardUserStats
} from '@/services/admin/dashboard/dashboard'
import { normalizeDashboardPayload } from '../utils/dashboardTransforms'

const DASHBOARD_GC_TIME = 30 * 60 * 1000
const SUMMARY_STALE_TIME = 30 * 1000
const CHARTS_STALE_TIME = 60 * 1000
const RECENT_ORDERS_STALE_TIME = 15 * 1000
const TOP_LISTS_STALE_TIME = 5 * 60 * 1000
const TOP_CUSTOMERS_LIMIT = 5
const RECENT_ORDERS_LIMIT = 10
const BEST_SELLING_PRODUCTS_LIMIT = 5
const LOW_STOCK_PRODUCTS_LIMIT = 5
const EMPTY_DASHBOARD_DATA = normalizeDashboardPayload({})

const baseDashboardQueryOptions = {
  gcTime: DASHBOARD_GC_TIME,
  retry: (failureCount, error) => error?.status !== 404 && failureCount < 2,
  meta: { persist: false }
}

export function useDashboardStats() {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: adminQueryKeys.dashboardSummary(language),
    queryFn: async () => {
      const res = await getDashboardSummary(language)
      return normalizeDashboardPayload(res?.data, language).statsData
    },
    staleTime: SUMMARY_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  return {
    ...query,
    statsData: query.data || EMPTY_DASHBOARD_DATA.statsData,
    statsLoading: query.isLoading,
    lastUpdatedAt: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null
  }
}

function useDashboardStatGroup(group, queryFn, selectStatsData) {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: adminQueryKeys.dashboardStatGroup(group, language),
    queryFn: async () => {
      const res = await queryFn(language)
      return selectStatsData(normalizeDashboardPayload(res?.data, language).statsData)
    },
    staleTime: SUMMARY_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  return {
    ...query,
    statsData: query.data ? { ...EMPTY_DASHBOARD_DATA.statsData, ...query.data } : EMPTY_DASHBOARD_DATA.statsData,
    statsLoading: query.isLoading
  }
}

export function useDashboardUserStats() {
  return useDashboardStatGroup('users', getDashboardUserStats, statsData => ({
    totalUsers: statsData.totalUsers,
    totalAdmins: statsData.totalAdmins,
    activeClients: statsData.activeClients,
    inactiveClients: statsData.inactiveClients,
    activeAdmins: statsData.activeAdmins,
    inactiveAdmins: statsData.inactiveAdmins
  }))
}

export function useDashboardFinanceStats() {
  return useDashboardStatGroup('finance', getDashboardFinanceStats, statsData => ({
    totalRevenue: statsData.totalRevenue,
    profit: statsData.profit
  }))
}

export function useDashboardInventoryStats() {
  return useDashboardStatGroup('inventory', getDashboardInventoryStats, statsData => ({
    product: statsData.product,
    category: statsData.category
  }))
}

function useDashboardChartsQuery(dateRange) {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: adminQueryKeys.dashboardCharts(dateRange, language),
    queryFn: async () => {
      const res = await getDashboardCharts(dateRange, language)
      const normalized = normalizeDashboardPayload(res?.data, language)
      return {
        salesData: normalized.salesData,
        categoryData: normalized.categoryData,
        paymentMethodData: normalized.paymentMethodData
      }
    },
    staleTime: CHARTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })
}

export function useDashboardSalesChart(dateRange) {
  const query = useDashboardChartsQuery(dateRange)

  return {
    ...query,
    salesData: query.data?.salesData || EMPTY_DASHBOARD_DATA.salesData,
    salesLoading: query.isLoading
  }
}

export function useDashboardPaymentMethods(dateRange) {
  const query = useDashboardChartsQuery(dateRange)

  return {
    ...query,
    paymentMethodData: query.data?.paymentMethodData || EMPTY_DASHBOARD_DATA.paymentMethodData,
    paymentMethodsLoading: query.isLoading
  }
}

export function useDashboardCategoryChart(dateRange) {
  const query = useDashboardChartsQuery(dateRange)

  return {
    ...query,
    categoryData: query.data?.categoryData || EMPTY_DASHBOARD_DATA.categoryData,
    categoryLoading: query.isLoading
  }
}

export function useDashboardRecentOrders() {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: adminQueryKeys.dashboardRecentOrders(RECENT_ORDERS_LIMIT, language),
    queryFn: async () => {
      const res = await getDashboardRecentOrders(RECENT_ORDERS_LIMIT, language)
      return normalizeDashboardPayload(res?.data, language).recentOrders
    },
    staleTime: RECENT_ORDERS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  return {
    ...query,
    recentOrders: query.data || EMPTY_DASHBOARD_DATA.recentOrders,
    recentOrdersLoading: query.isLoading
  }
}

export function useDashboardTopCustomers() {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: adminQueryKeys.dashboardTopCustomers(TOP_CUSTOMERS_LIMIT, language),
    queryFn: async () => {
      const res = await getDashboardTopCustomers(TOP_CUSTOMERS_LIMIT, language)
      return normalizeDashboardPayload(res?.data, language).statsData.topCustomers
    },
    staleTime: TOP_LISTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  return {
    ...query,
    topCustomers: query.data || EMPTY_DASHBOARD_DATA.statsData.topCustomers,
    topCustomersLoading: query.isLoading
  }
}

export function useDashboardTopProducts(dateRange) {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: adminQueryKeys.dashboardBestSellingProducts(BEST_SELLING_PRODUCTS_LIMIT, language, dateRange),
    queryFn: async () => {
      const res = await getDashboardBestSellingProducts(BEST_SELLING_PRODUCTS_LIMIT, language, dateRange)
      return normalizeDashboardPayload(res?.data, language).topProducts
    },
    staleTime: TOP_LISTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  return {
    ...query,
    topProducts: query.data || EMPTY_DASHBOARD_DATA.topProducts,
    topProductsLoading: query.isLoading
  }
}

export function useDashboardLowStock(lowStockThreshold = 5) {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: adminQueryKeys.dashboardLowStockProducts(LOW_STOCK_PRODUCTS_LIMIT, language, lowStockThreshold),
    queryFn: async () => {
      const res = await getProducts({ page: 1, limit: 100, sortField: 'stock', sortOrder: 'asc' })
      return (res?.products || [])
        .map(product => ({
          id: product._id || product.id,
          name: product.title?.[language] || product.title || product.name || 'Product',
          thumbnail: product.thumbnail || product.images?.[0],
          stock: Number(product.stock) || 0,
          status: product.status
        }))
        .filter(product => product.stock <= lowStockThreshold)
        .slice(0, LOW_STOCK_PRODUCTS_LIMIT)
    },
    staleTime: TOP_LISTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  return {
    ...query,
    lowStockProducts: query.data || [],
    lowStockProductsLoading: query.isLoading
  }
}
