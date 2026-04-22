import React, { useState } from 'react'
import SEO from '@/components/SEO'
import './AdminDashboard.scss'
import ActivitySection from './components/ActivitySection'
import ChartsSection from './components/ChartsSection'
import DashboardHeader from './components/DashboardHeader'
import StatsSection from './components/StatsSection'
import TopProductsSection from './components/TopProductsSection'
import { useAdminDashboardData, useDashboardMobile } from './hooks/useAdminDashboardData'

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7days')
  const isMobile = useDashboardMobile()
  const { loading, statsData, salesData, categoryData, recentOrders, topProducts } = useAdminDashboardData(dateRange)

  return (
    <div className="dashboard-container dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid rounded-xl">
      <SEO title="Admin – Tổng quan" noIndex />

      <DashboardHeader dateRange={dateRange} loading={loading} onDateRangeChange={setDateRange} />

      <div className="dashboard-content">
        <StatsSection loading={loading} statsData={statsData} />

        <ChartsSection
          categoryData={categoryData}
          dateRange={dateRange}
          isMobile={isMobile}
          loading={loading}
          salesData={salesData}
        />

        <ActivitySection
          isMobile={isMobile}
          loading={loading}
          recentOrders={recentOrders}
          topCustomers={statsData.topCustomers}
        />

        <TopProductsSection loading={loading} topProducts={topProducts} />
      </div>
    </div>
  )
}
