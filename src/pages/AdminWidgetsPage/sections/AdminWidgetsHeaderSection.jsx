import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminWidgetsHeaderSection({ onCreateWidget }) {
  return (
    <div className="admin-widgets-header">
      <div className="admin-widgets-header__content">
        <Title level={2} className="admin-widgets-header__title">
          Quản lý Widgets
        </Title>
        <Text className="admin-widgets-header__description">Quản lý các widget hiển thị trên trang chủ.</Text>
      </div>

      <Button type="primary" icon={<PlusOutlined />} onClick={onCreateWidget} className="admin-widgets-btn admin-widgets-btn--primary">
        Thêm Widget
      </Button>
    </div>
  )
}
