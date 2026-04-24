import { Save } from 'lucide-react'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function AdminRolePermissionsHeaderSection({
  canEditRolePermission,
  loading,
  onSave
}) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={3} className="!mb-1 !text-xl !font-semibold text-gray-900 dark:!text-gray-100">
            Role Permission
          </Title>

          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Manage access permissions for each admin role.
          </Text>
        </div>

        {canEditRolePermission && (
          <Button
            type="primary"
            onClick={onSave}
            loading={loading}
            icon={<Save size={16} />}
            className="flex h-10 w-full items-center justify-center rounded-lg border-none bg-gray-900 px-5 text-sm font-medium text-white shadow-none hover:!bg-gray-800 sm:w-auto dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
          >
            Save changes
          </Button>
        )}
      </div>
    </div>
  )
}