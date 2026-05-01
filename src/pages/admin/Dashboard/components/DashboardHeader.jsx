import React from 'react'
import { Select } from 'antd'
import { CalendarDays, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DATE_RANGE_OPTIONS, getDashboardLocale } from '../utils/dashboardTransforms'

const formatToday = locale =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date())

export default function DashboardHeader({ dateRange, loading, onDateRangeChange }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)
  const dateRangeOptions = DATE_RANGE_OPTIONS.map(option => ({
    ...option,
    label: t(option.labelKey)
  }))

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="title-section min-w-0">
          <div className="dashboard-title-row">
            <h1 className="dashboard-title">{t('header.title')}</h1>
            <span className="dashboard-live-pill">
              <Circle size={8} fill="currentColor" strokeWidth={0} />
              {t('header.online')}
            </span>
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
            disabled={loading}
            options={dateRangeOptions}
            style={{ minWidth: 150 }}
          />
        </div>
      </div>
    </div>
  )
}
