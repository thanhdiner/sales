import React from 'react'
import { Skeleton } from 'antd'

export default function DashboardRowSkeleton({ rows = 5, compact = false }) {
  return (
    <div className="dashboard-list">
      {Array.from({ length: rows }).map((_, index) => (
        <div className={`dashboard-list-row dashboard-row-skeleton-item ${compact ? 'dashboard-row-skeleton-item--compact' : ''}`} key={index}>
          <Skeleton.Avatar active size={compact ? 28 : 34} shape="square" className="dashboard-row-skeleton-icon" />
          <span className="dashboard-row-skeleton-copy">
            <Skeleton.Input active size="small" className="dashboard-row-skeleton-title" />
            {!compact ? <Skeleton.Input active size="small" className="dashboard-row-skeleton-subtitle" /> : null}
          </span>
          <Skeleton.Input active size="small" className="dashboard-row-skeleton-badge" />
        </div>
      ))}
    </div>
  )
}
