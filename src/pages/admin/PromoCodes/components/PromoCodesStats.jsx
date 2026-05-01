import { CalendarOutlined, PlayCircleOutlined, TagOutlined, TeamOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { formatNumber, getPromoCodeStats } from '../utils/promoCodeHelpers'

export default function PromoCodesStats({ promoCodes, language, t }) {
  const stats = getPromoCodeStats(promoCodes)

  const statItems = [
    {
      title: t('stats.total'),
      value: formatNumber(stats.total, language),
      icon: <TagOutlined />,
      variant: 'total'
    },
    {
      title: t('stats.active'),
      value: formatNumber(stats.active, language),
      icon: <PlayCircleOutlined />,
      variant: 'active'
    },
    {
      title: t('stats.expired'),
      value: formatNumber(stats.expired, language),
      icon: <CalendarOutlined />,
      variant: 'expired'
    },
    {
      title: t('stats.usage'),
      value: formatNumber(stats.totalUsed, language),
      icon: <TeamOutlined />,
      variant: 'usage'
    }
  ]

  return (
    <Row gutter={[16, 16]} className="admin-promo-stats">
      {statItems.map(item => (
        <Col xs={12} lg={6} key={item.title}>
          <div className={`admin-promo-stat-card admin-promo-stat-card--${item.variant}`}>
            <span className="admin-promo-stat-card__icon">{item.icon}</span>

            <div className="admin-promo-stat-card__content">
              <p className="admin-promo-stat-card__label">{item.title}</p>
              <p className="admin-promo-stat-card__value">{item.value}</p>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  )
}
