import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function AdminPermissionGroupsHeaderSection({ canCreateGroup, onCreateGroup }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Title level={2} className="!mb-1 !text-2xl !font-semibold !text-[var(--admin-text)]">
          Nhóm quyền
        </Title>
        <Text className="text-sm text-[var(--admin-text-muted)]">
          Quản lý các nhóm quyền dùng để phân loại quyền trong hệ thống.
        </Text>
      </div>

      {canCreateGroup && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateGroup}
          className="h-10 rounded-lg !border-none !bg-[var(--admin-accent)] px-4 font-medium !text-white shadow-none hover:!opacity-90 sm:w-auto"
        >
          Thêm nhóm quyền
        </Button>
      )}
    </div>
  )
}
