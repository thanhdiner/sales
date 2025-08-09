// TopCustomers.jsx
import { Card, List, Avatar, Typography, Tag, Skeleton } from 'antd'
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
          dataSource={customers.filter(u => u && typeof u.total === 'number')}
          renderItem={(user, idx) => (
            <List.Item className="dark:hover:!bg-gray-600 rounded-xl">
              <List.Item.Meta
                avatar={<Avatar src={user.avatar} size={40} />}
                title={
                  <Text strong>
                    <span className="text-gray-800 dark:text-gray-100">
                      {idx + 1}. {user.name}
                    </span>
                  </Text>
                }
                description={
                  <Text type="secondary">
                    <span className="text-gray-800 dark:text-gray-100">Tổng chi: </span>
                    <Tag color="success" style={{ fontWeight: 600 }}>
                      {user.total.toLocaleString('vi-VN')} ₫
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
