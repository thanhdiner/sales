import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminWidgetsHeaderSection({ onCreateWidget }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Title level={2} className="!mb-1 !text-2xl !font-semibold !text-gray-900 dark:!text-white">
          Quản lý Widgets
        </Title>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Quản lý các widget hiển thị trên trang chủ.
        </Text>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateWidget}
        className="h-10 rounded-lg bg-gray-900 px-4 font-medium shadow-none hover:!bg-gray-800 sm:w-auto"
      >
        Thêm Widget
      </Button>
    </div>
  )
}
