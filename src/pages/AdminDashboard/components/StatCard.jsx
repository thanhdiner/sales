import React from 'react'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import { formatCurrency } from '../utils/dashboardTransforms'

export default function StatCard({ title, value, change, trend, icon, color, subInfo = [], isCurrency }) {
  const displayValue = isCurrency ? formatCurrency(value) : (Number(value) || 0).toLocaleString('vi-VN')

  return (
    <Card className="stat-card dark:bg-gray-900 dark:text-gray-100 shadow-md rounded-2xl border-0" hoverable>
      <div className="stat-content" style={{ display: 'flex', gap: 16 }}>
        <div
          className="stat-icon"
          style={{
            background: `${color}1A`,
            borderRadius: 12,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {React.cloneElement(icon, { style: { color, fontSize: 28 } })}
        </div>

        <div className="stat-info" style={{ flex: 1 }}>
          <div className="stat-title" style={{ color: '#64748b', fontWeight: 500, fontSize: 16 }}>
            {title}
          </div>

          <div style={{ fontSize: 28, fontWeight: 700, color: '#1f2937', marginTop: 4 }} className="stat-value">
            {displayValue}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: trend === 'up' ? '#d1fae5' : '#fee2e2',
              color: trend === 'up' ? '#059669' : '#ef4444',
              fontSize: 13,
              padding: '2px 6px',
              borderRadius: 8,
              marginTop: 4
            }}
          >
            {trend === 'up' ? (
              <ArrowUpOutlined style={{ fontSize: 12, marginRight: 4 }} />
            ) : (
              <ArrowDownOutlined style={{ fontSize: 12, marginRight: 4 }} />
            )}
            {change}%
          </div>

          {subInfo.map((item, index) => (
            <div key={`${item.label}-${index}`} style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              • {item.label}: <strong>{(Number(item.value) || 0).toLocaleString('vi-VN')}</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
