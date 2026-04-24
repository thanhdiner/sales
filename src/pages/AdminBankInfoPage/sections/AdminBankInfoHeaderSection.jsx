import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function AdminBankInfoHeaderSection({ onCreate }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Title level={4} className="!mb-0">
        Quản lý thông tin chuyển khoản
      </Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className="w-full rounded-lg sm:w-auto"
      >
        Thêm tài khoản
      </Button>
    </div>
  )
}
