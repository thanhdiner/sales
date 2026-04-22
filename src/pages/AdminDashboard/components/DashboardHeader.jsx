import React from 'react'
import { Select, Typography } from 'antd'
import { DATE_RANGE_OPTIONS } from '../utils/dashboardTransforms'

const { Title, Text } = Typography

export default function DashboardHeader({ dateRange, loading, onDateRangeChange }) {
  return (
    <div className="dashboard-header rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="header-content flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="title-section min-w-0">
          <Title
            level={1}
            className="dashboard-title"
            style={{
              margin: 0,
              color: '#111827',
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            Dashboard
          </Title>

          <Text
            className="dashboard-subtitle"
            style={{
              display: 'block',
              marginTop: 6,
              color: '#6b7280',
              fontSize: 14,
              lineHeight: 1.6
            }}
          >
            Tổng quan hoạt động hệ thống trong khoảng thời gian đã chọn.
          </Text>
        </div>

        <div className="header-actions flex shrink-0 items-center">
          <Select
            value={dateRange}
            onChange={onDateRangeChange}
            className="date-select"
            disabled={loading}
            options={DATE_RANGE_OPTIONS}
            style={{ minWidth: 150 }}
          />
        </div>
      </div>
    </div>
  )
}