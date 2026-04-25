import React, { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '@/components/SEO'
import './AdminDashboard.scss'
import ActivitySection from './components/ActivitySection'
import ChartsSection from './components/ChartsSection'
import DashboardHeader from './components/DashboardHeader'
import StatsSection from './components/StatsSection'
import TopProductsSection from './components/TopProductsSection'
import { useAdminDashboardData, useDashboardMobile } from './hooks/useAdminDashboardData'
import { DATE_RANGE_OPTIONS } from './utils/dashboardTransforms'

const DEFAULT_DATE_RANGE = '7days'
const VALID_DATE_RANGES = new Set(DATE_RANGE_OPTIONS.map(option => option.value))

function getValidDateRange(range) {
  return VALID_DATE_RANGES.has(range) ? range : DEFAULT_DATE_RANGE
}

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dateRange = getValidDateRange(searchParams.get('range'))
  const isMobile = useDashboardMobile()

  const {
    chartsLoading,
    statsData,
    statsLoading,
    categoryData,
    recentOrders,
    recentOrdersLoading,
    topCustomers,
    topCustomersLoading,
    topProducts,
    topProductsLoading
  } = useAdminDashboardData(dateRange)

  const handleDateRangeChange = useCallback(
    nextRange => {
      const normalizedRange = getValidDateRange(nextRange)

      setSearchParams(
        prevParams => {
          const nextParams = new URLSearchParams(prevParams)
          nextParams.set('range', normalizedRange)
          return nextParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return (
    <div className="dashboard-container rounded-xl">
      <SEO title="Admin – Tổng quan" noIndex />

      <DashboardHeader
        dateRange={dateRange}
        loading={statsLoading}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className="dashboard-content">
        <StatsSection loading={statsLoading} statsData={statsData} />

        <ChartsSection
          recentOrders={recentOrders}
          recentOrdersLoading={recentOrdersLoading}
          statsData={statsData}
          statsLoading={statsLoading}
        />

        <ActivitySection
          isMobile={isMobile}
          recentOrders={recentOrders}
          recentOrdersLoading={recentOrdersLoading}
          topCustomers={topCustomers}
          topCustomersLoading={topCustomersLoading}
        />

        <TopProductsSection
          categoryData={categoryData}
          categoryLoading={chartsLoading}
          loading={topProductsLoading}
          topProducts={topProducts}
        />
      </div>
    </div>
  )
}
