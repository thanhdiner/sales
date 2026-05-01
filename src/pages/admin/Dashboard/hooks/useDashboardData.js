import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminQueryKeys } from '@/lib/query/queryKeys/index.js'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import {
  getDashboardBestSellingProducts,
  getDashboardCharts,
  getDashboardRecentOrders,
  getDashboardSummary,
  getDashboardTopCustomers
} from '@/services/admin/dashboard/dashboard'
import { normalizeDashboardPayload } from '../utils/dashboardTransforms'

const DASHBOARD_GC_TIME = 30 * 60 * 1000
const SUMMARY_STALE_TIME = 30 * 1000
const CHARTS_STALE_TIME = 60 * 1000
const RECENT_ORDERS_STALE_TIME = 15 * 1000
const TOP_LISTS_STALE_TIME = 5 * 60 * 1000
const SECONDARY_BLOCK_DELAY = 400
const RECENT_ORDERS_DELAY = 900
const TOP_CUSTOMERS_LIMIT = 5
const RECENT_ORDERS_LIMIT = 10
const BEST_SELLING_PRODUCTS_LIMIT = 5
const EMPTY_DASHBOARD_DATA = normalizeDashboardPayload({})

const baseDashboardQueryOptions = {
  gcTime: DASHBOARD_GC_TIME,
  retry: (failureCount, error) => error?.status !== 404 && failureCount < 2,
  meta: { persist: false }
}

function useDelayedDashboardBlocks(summaryReady) {
  const [secondaryEnabled, setSecondaryEnabled] = useState(false)
  const [recentOrdersEnabled, setRecentOrdersEnabled] = useState(false)

  useEffect(() => {
    if (!summaryReady) {
      return undefined
    }

    const secondaryTimer = setTimeout(() => setSecondaryEnabled(true), SECONDARY_BLOCK_DELAY)
    const recentOrdersTimer = setTimeout(() => setRecentOrdersEnabled(true), RECENT_ORDERS_DELAY)

    return () => {
      clearTimeout(secondaryTimer)
      clearTimeout(recentOrdersTimer)
    }
  }, [summaryReady])

  return { secondaryEnabled, recentOrdersEnabled }
}

export function useDashboardData(dateRange) {
  const language = useCurrentLanguage()

  const summaryQuery = useQuery({
    queryKey: adminQueryKeys.dashboardSummary(language),
    queryFn: async () => {
      const res = await getDashboardSummary(language)
      return normalizeDashboardPayload(res?.data, language).statsData
    },
    staleTime: SUMMARY_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  const { secondaryEnabled, recentOrdersEnabled } = useDelayedDashboardBlocks(summaryQuery.isSuccess)

  const chartsQuery = useQuery({
    queryKey: adminQueryKeys.dashboardCharts(dateRange, language),
    queryFn: async () => {
      const res = await getDashboardCharts(dateRange, language)
      const normalized = normalizeDashboardPayload(res?.data, language)
      return {
        salesData: normalized.salesData,
        categoryData: normalized.categoryData
      }
    },
    enabled: secondaryEnabled,
    staleTime: CHARTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  const topCustomersQuery = useQuery({
    queryKey: adminQueryKeys.dashboardTopCustomers(TOP_CUSTOMERS_LIMIT, language),
    queryFn: async () => {
      const res = await getDashboardTopCustomers(TOP_CUSTOMERS_LIMIT, language)
      return normalizeDashboardPayload(res?.data, language).statsData.topCustomers
    },
    enabled: secondaryEnabled,
    staleTime: TOP_LISTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  const bestSellingProductsQuery = useQuery({
    queryKey: adminQueryKeys.dashboardBestSellingProducts(BEST_SELLING_PRODUCTS_LIMIT, language),
    queryFn: async () => {
      const res = await getDashboardBestSellingProducts(BEST_SELLING_PRODUCTS_LIMIT, language)
      return normalizeDashboardPayload(res?.data, language).topProducts
    },
    enabled: secondaryEnabled,
    staleTime: TOP_LISTS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  const recentOrdersQuery = useQuery({
    queryKey: adminQueryKeys.dashboardRecentOrders(RECENT_ORDERS_LIMIT, language),
    queryFn: async () => {
      const res = await getDashboardRecentOrders(RECENT_ORDERS_LIMIT, language)
      return normalizeDashboardPayload(res?.data, language).recentOrders
    },
    enabled: recentOrdersEnabled,
    staleTime: RECENT_ORDERS_STALE_TIME,
    ...baseDashboardQueryOptions
  })

  useEffect(() => {
    const error =
      summaryQuery.error ||
      chartsQuery.error ||
      topCustomersQuery.error ||
      bestSellingProductsQuery.error ||
      recentOrdersQuery.error

    if (error) {
      console.error('Failed to load dashboard:', error)
    }
  }, [
    bestSellingProductsQuery.error,
    chartsQuery.error,
    recentOrdersQuery.error,
    summaryQuery.error,
    topCustomersQuery.error
  ])

  const chartsLoading = chartsQuery.data
    ? false
    : secondaryEnabled
      ? chartsQuery.isLoading
      : true
  const topCustomersLoading = topCustomersQuery.data
    ? false
    : secondaryEnabled
      ? topCustomersQuery.isLoading
      : true
  const topProductsLoading = bestSellingProductsQuery.data
    ? false
    : secondaryEnabled
      ? bestSellingProductsQuery.isLoading
      : true
  const recentOrdersLoading = recentOrdersQuery.data
    ? false
    : recentOrdersEnabled
      ? recentOrdersQuery.isLoading
      : true

  return {
    loading: summaryQuery.isLoading,
    refreshing: summaryQuery.isFetching && !summaryQuery.isLoading,
    statsLoading: summaryQuery.isLoading,
    chartsLoading,
    topCustomersLoading,
    topProductsLoading,
    recentOrdersLoading,
    statsData: summaryQuery.data || EMPTY_DASHBOARD_DATA.statsData,
    salesData: chartsQuery.data?.salesData || EMPTY_DASHBOARD_DATA.salesData,
    categoryData: chartsQuery.data?.categoryData || EMPTY_DASHBOARD_DATA.categoryData,
    recentOrders: recentOrdersQuery.data || EMPTY_DASHBOARD_DATA.recentOrders,
    topCustomers: topCustomersQuery.data || EMPTY_DASHBOARD_DATA.statsData.topCustomers,
    topProducts: bestSellingProductsQuery.data || EMPTY_DASHBOARD_DATA.topProducts
  }
}

export function useDashboardMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakpoint])

  return isMobile
}
