import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminBannersHeaderSection({ onCreateBanner }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Title level={2} className="!mb-1 !text-2xl !font-semibold !text-[var(--admin-text)]">
          Quản lý Banner
        </Title>
        <Text className="text-sm text-[var(--admin-text-muted)]">
          Quản lý banner hiển thị trên trang người dùng.
        </Text>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateBanner}
        className="h-10 rounded-lg !border-none !bg-[var(--admin-accent)] px-4 font-medium !text-white shadow-none hover:!opacity-90 sm:w-auto"
      >
        Thêm Banner
      </Button>
    </div>
  )
}
