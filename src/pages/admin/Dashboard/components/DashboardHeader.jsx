import React, { useCallback } from 'react'
import { Select } from 'antd'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Clock, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDashboardStats } from '../hooks/useDashboardQueries'
import { DATE_RANGE_OPTIONS, getDashboardLocale } from '../utils/dashboardTransforms'

const formatToday = locale =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date())

const formatUpdatedTime = (date, locale) =>
  date
    ? new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    : '--:--'

export default function DashboardHeader({ dateRange, onDateRangeChange }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const queryClient = useQueryClient()
  const dashboardFetchingCount = useIsFetching({ queryKey: ['adminDashboard'] })
  const { isLoading, lastUpdatedAt } = useDashboardStats()
  const locale = getDashboardLocale(i18n.language)
  const dateRangeOptions = DATE_RANGE_OPTIONS.map(option => ({
    ...option,
    label: t(option.labelKey)
  }))
  const updatedTime = formatUpdatedTime(lastUpdatedAt, locale)
  const isFetching = dashboardFetchingCount > 0
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['adminDashboard'], refetchType: 'active' })
  }, [queryClient])

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="title-section min-w-0">
          <div className="dashboard-title-row">
            <h1 className="dashboard-title">{t('header.title')}</h1>
            <span className="dashboard-updated-pill">
              <Clock size={14} />
              {t('header.updated', { time: updatedTime })}
            </span>
            <button
              type="button"
              className="dashboard-refresh-btn"
              onClick={handleRefresh}
              disabled={isFetching || isLoading}
              aria-label={t('header.refresh')}
            >
              <RefreshCw size={15} className={isFetching ? 'dashboard-refresh-btn__icon--spinning' : undefined} />
            </button>
          </div>
        </div>

        <div className="header-actions">
          <div className="dashboard-today">
            <CalendarDays size={17} />
            <span>{t('header.today', { date: formatToday(locale) })}</span>
          </div>

          <Select
            value={dateRange}
            onChange={onDateRangeChange}
            className="date-select"
            popupClassName="dashboard-date-dropdown"
            disabled={isLoading}
            options={dateRangeOptions}
            style={{ minWidth: 150 }}
          />
        </div>
      </div>
    </div>
  )
}
