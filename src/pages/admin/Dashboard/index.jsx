import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import './index.scss'
import DashboardHeader from './components/DashboardHeader'
import PendingActionsPanel from './components/PendingActionsPanel'
import Stats from './components/Stats'
import StockPanel from './components/StockPanel'
import TodayActivityPanel from './components/TodayActivityPanel'
import useDashboardRealtime from './hooks/useDashboardRealtime'
import { DATE_RANGE_OPTIONS } from './utils/dashboardTransforms'

const ConversionFunnelPanel = lazy(() => import('./components/ConversionFunnelPanel'))
const OrderStatusPanel = lazy(() => import('./components/OrderStatusPanel'))
const PaymentMethodsPanel = lazy(() => import('./components/PaymentMethodsPanel'))
const RecentOrdersPanel = lazy(() => import('./components/RecentOrdersPanel'))
const RevenueChartPanel = lazy(() => import('./components/RevenueChartPanel'))
const TopCustomersPanel = lazy(() => import('./components/TopCustomersPanel'))
const TopProducts = lazy(() => import('./components/TopProducts'))

const DEFAULT_DATE_RANGE = '7days'
const VALID_DATE_RANGES = new Set(DATE_RANGE_OPTIONS.map(option => option.value))

function DashboardSection({ className = '', children }) {
  return (
    <section className={`dashboard-logic-section ${className}`.trim()}>
      {children}
    </section>
  )
}

function LazyDashboardSection({ className = '', minHeight = 320, children }) {
  const ref = useRef(null)
  const [shouldRender, setShouldRender] = useState(() => (
    typeof globalThis.IntersectionObserver === 'undefined'
  ))

  useEffect(() => {
    if (shouldRender) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin: '360px 0px' }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [shouldRender])

  return (
    <DashboardSection className={className}>
      <div ref={ref} style={shouldRender ? undefined : { minHeight }}>
        {shouldRender ? (
          <Suspense fallback={<div className="dashboard-section-skeleton" />}>
            {children}
          </Suspense>
        ) : null}
      </div>
    </DashboardSection>
  )
}

function getValidDateRange(range) {
  return VALID_DATE_RANGES.has(range) ? range : DEFAULT_DATE_RANGE
}

export default function Dashboard() {
  const { t } = useTranslation('adminDashboard')
  useDashboardRealtime()
  const [searchParams, setSearchParams] = useSearchParams()
  const dateRange = getValidDateRange(searchParams.get('range'))
  const [lowStockThreshold, setLowStockThreshold] = useState(5)

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

      <DashboardHeader dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />

      <div className="dashboard-content">
        <DashboardSection className="dashboard-logic-section--vitals">
          <Stats />
        </DashboardSection>

        <DashboardSection className="dashboard-logic-section--operations">
          <section className="dashboard-operations-grid">
            <PendingActionsPanel />
            <StockPanel onThresholdChange={setLowStockThreshold} threshold={lowStockThreshold} />
            <TodayActivityPanel />
          </section>
        </DashboardSection>

        <LazyDashboardSection className="dashboard-logic-section--analytics" minHeight={420}>
          <section className="dashboard-analytics-grid">
            <RevenueChartPanel dateRange={dateRange} />
            <ConversionFunnelPanel />
            <OrderStatusPanel />
          </section>
        </LazyDashboardSection>

        <LazyDashboardSection className="dashboard-logic-section--target" minHeight={360}>
          <section className="dashboard-target-layout">
            <TopCustomersPanel />
            <TopProducts dateRange={dateRange} />
          </section>
        </LazyDashboardSection>

        <LazyDashboardSection className="dashboard-logic-section--transactions" minHeight={360}>
          <section className="dashboard-bottom-grid dashboard-bottom-grid--half">
            <RecentOrdersPanel />
            <PaymentMethodsPanel dateRange={dateRange} />
          </section>
        </LazyDashboardSection>
      </div>
    </div>
  )
}
