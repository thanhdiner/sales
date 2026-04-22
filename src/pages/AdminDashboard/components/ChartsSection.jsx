import React from 'react'
import { Card, Col, Row, Skeleton } from 'antd'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatCurrency, getPieColor, getSalesChartTitle } from '../utils/dashboardTransforms'

export default function ChartsSection({ categoryData, dateRange, isMobile, loading, salesData }) {
  return (
    <Row gutter={[24, 24]} className="charts-row">
      <Col xs={24} lg={16}>
        {loading ? (
          <Skeleton.Input block active style={{ width: '100%', height: 404, borderRadius: 20 }} />
        ) : (
          <Card title={getSalesChartTitle(dateRange)} className="chart-card">
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={value => `${(value / 1000000).toFixed(0)}M`} />
                <RechartsTooltip
                  formatter={value => [formatCurrency(value), 'Doanh thu']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}
      </Col>

      <Col xs={24} lg={8}>
        {loading ? (
          <Skeleton.Input block active style={{ width: '100%', height: 404, borderRadius: 20 }} />
        ) : (
          <Card title="Phân loại sản phẩm" className="chart-card">
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={false}
                  labelLine={false}
                >
                  {categoryData.map((entry, idx) => (
                    <Cell key={`${entry.name}-${idx}`} fill={getPieColor(idx, categoryData.length)} />
                  ))}
                </Pie>

                <RechartsTooltip
                  formatter={(value, name, props) => [`${value} sản phẩm`, categoryData[props.dataIndex]?.name ?? name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </Col>
    </Row>
  )
}
