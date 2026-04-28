import { Avatar, Card, List, Skeleton, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { formatCurrency, getDashboardLocale } from '../../utils/dashboardTransforms'

const { Text } = Typography

export default function TopCustomers({ customers = [], loading }) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)

  return (
    <Card title={t('legacyTopCustomers.title')} className="chart-card">
      {loading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array(5).fill(0)}
          renderItem={() => (
            <List.Item>
              <List.Item.Meta
                avatar={<Skeleton.Avatar active size={40} shape="circle" />}
                title={<Skeleton.Input active size="small" style={{ width: 140 }} />}
                description={<Skeleton active title={false} paragraph={{ rows: 1, width: '40%' }} style={{ marginTop: 6 }} />}
              />
            </List.Item>
          )}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={customers.filter(user => user && typeof user.total === 'number')}
          renderItem={(user, index) => (
            <List.Item className="dashboard-customer-item rounded-xl">
              <List.Item.Meta
                avatar={<Avatar src={user.avatar} size={40} />}
                title={
                  <Text strong>
                    <span className="dashboard-customer-name">
                      {index + 1}. {user.name}
                    </span>
                  </Text>
                }
                description={
                  <Text type="secondary">
                    <span className="dashboard-customer-meta">{t('legacyTopCustomers.totalSpent')} </span>
                    <Tag color="success" style={{ fontWeight: 600 }}>
                      {formatCurrency(user.total, locale)}
                    </Tag>
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
