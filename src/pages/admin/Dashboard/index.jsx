import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import './index.scss'
import Activity from './components/Activity'
import Charts from './components/Charts'
import DashboardHeader from './components/DashboardHeader'
import Stats from './components/Stats'
import TopProducts from './components/TopProducts'
import { useDashboardData, useDashboardMobile } from './hooks/useDashboardData'
import { DATE_RANGE_OPTIONS } from './utils/dashboardTransforms'

const DEFAULT_DATE_RANGE = '7days'
const VALID_DATE_RANGES = new Set(DATE_RANGE_OPTIONS.map(option => option.value))

function getValidDateRange(range) {
  return VALID_DATE_RANGES.has(range) ? range : DEFAULT_DATE_RANGE
}

export default function Dashboard() {
  const { t } = useTranslation('adminDashboard')
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
  } = useDashboardData(dateRange)

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
      <SEO title={t('seo.title')} noIndex />

      <DashboardHeader
        dateRange={dateRange}
        loading={statsLoading}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className="dashboard-content">
        <Stats loading={statsLoading} statsData={statsData} />

        <Charts
          recentOrders={recentOrders}
          recentOrdersLoading={recentOrdersLoading}
          statsData={statsData}
          statsLoading={statsLoading}
        />

        <Activity
          isMobile={isMobile}
          recentOrders={recentOrders}
          recentOrdersLoading={recentOrdersLoading}
          topCustomers={topCustomers}
          topCustomersLoading={topCustomersLoading}
        />

        <TopProducts
          categoryData={categoryData}
          categoryLoading={chartsLoading}
          loading={topProductsLoading}
          topProducts={topProducts}
        />
      </div>
    </div>
  )
}
