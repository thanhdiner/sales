import { Avatar, Card, List, Skeleton, Tag, Typography } from 'antd'

const { Text } = Typography

export default function TopCustomers({ customers = [], loading }) {
  return (
    <Card title="Top khách hàng tiêu biểu" className="chart-card">
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
                    <span className="dashboard-customer-meta">Tổng chi: </span>
                    <Tag color="success" style={{ fontWeight: 600 }}>
                      {user.total.toLocaleString('vi-VN')} đ
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
