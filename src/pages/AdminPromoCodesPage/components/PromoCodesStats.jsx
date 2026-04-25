import { CalendarOutlined, PercentageOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { getPromoCodeStats } from '../utils/promoCodeHelpers'

export default function PromoCodesStats({ promoCodes }) {
  const stats = getPromoCodeStats(promoCodes)

  const statItems = [
    {
      title: 'Tổng số mã',
      value: stats.total,
      icon: <PercentageOutlined />
    },
    {
      title: 'Đang hoạt động',
      value: stats.active,
      icon: <PercentageOutlined />
    },
    {
      title: 'Đã hết hạn',
      value: stats.expired,
      icon: <CalendarOutlined />
    },
    {
      title: 'Lượt sử dụng',
      value: stats.totalUsed,
      icon: <UserOutlined />
    }
  ]

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {statItems.map(item => (
        <Col xs={24} sm={12} lg={6} key={item.title}>
          <Card className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
            <Statistic
              title={<span className="text-[var(--admin-text-muted)]">{item.title}</span>}
              value={item.value}
              prefix={item.icon}
              valueStyle={{
                color: 'inherit',
                fontWeight: 600
              }}
              className="text-[var(--admin-text)]"
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}
