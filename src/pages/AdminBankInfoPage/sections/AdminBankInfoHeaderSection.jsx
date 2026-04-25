import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function AdminBankInfoHeaderSection({ onCreate }) {
  return (
    <div className="admin-bank-info-header">
      <div>
        <Title level={2} className="admin-bank-info-header__title">
          Quản lý thông tin ngân hàng
        </Title>

        <Text className="admin-bank-info-header__desc">
          Cấu hình tài khoản nhận chuyển khoản hiển thị trong bước thanh toán.
        </Text>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className="admin-bank-info-btn admin-bank-info-btn--primary admin-bank-info-header__create-btn"
      >
        Thêm tài khoản
      </Button>
    </div>
  )
}

