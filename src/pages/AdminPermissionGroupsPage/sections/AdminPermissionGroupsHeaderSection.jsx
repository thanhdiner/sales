import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function AdminPermissionGroupsHeaderSection({ canCreateGroup, onCreateGroup }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Title level={2} className="!mb-1 !text-2xl !font-semibold !text-gray-900 dark:!text-white">
          Nhóm quyền
        </Title>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Quản lý các nhóm quyền dùng để phân loại quyền trong hệ thống.
        </Text>
      </div>

      {canCreateGroup && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateGroup}
          className="h-10 rounded-lg bg-gray-900 px-4 font-medium shadow-none hover:!bg-gray-800 sm:w-auto"
        >
          Thêm nhóm quyền
        </Button>
      )}
    </div>
  )
}
