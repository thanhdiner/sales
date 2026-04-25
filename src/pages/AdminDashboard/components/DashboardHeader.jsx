import React from 'react'
import { Select } from 'antd'
import { CalendarDays, Circle } from 'lucide-react'
import { DATE_RANGE_OPTIONS } from '../utils/dashboardTransforms'

const formatToday = () =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date())

export default function DashboardHeader({ dateRange, loading, onDateRangeChange }) {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="title-section min-w-0">
          <div className="dashboard-title-row">
            <h1 className="dashboard-title">Trung tâm điều khiển</h1>
            <span className="dashboard-live-pill">
              <Circle size={8} fill="currentColor" strokeWidth={0} />
              Trực tuyến
            </span>
          </div>
        </div>

        <div className="header-actions">
          <div className="dashboard-today">
            <CalendarDays size={17} />
            <span>Hôm nay: {formatToday()}</span>
          </div>

          <Select
            value={dateRange}
            onChange={onDateRangeChange}
            className="date-select"
            popupClassName="dashboard-date-dropdown"
            disabled={loading}
            options={DATE_RANGE_OPTIONS}
            style={{ minWidth: 150 }}
          />
        </div>
      </div>
    </div>
  )
}
