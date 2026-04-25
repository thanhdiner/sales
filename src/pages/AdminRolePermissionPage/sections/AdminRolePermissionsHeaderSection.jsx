import { Save } from 'lucide-react'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function AdminRolePermissionsHeaderSection({ canEditRolePermission, loading, onSave }) {
  return (
    <div className="admin-role-permission-header">
      <div className="admin-role-permission-header__content">
        <Title level={3} className="admin-role-permission-header__title">
          Phân quyền vai trò
        </Title>

        <Text className="admin-role-permission-header__description">
          Quản lý quyền truy cập cho từng vai trò quản trị.
        </Text>
      </div>

      {canEditRolePermission && (
        <Button
          type="primary"
          onClick={onSave}
          loading={loading}
          icon={<Save size={16} />}
          className="admin-role-permission-btn admin-role-permission-btn--primary"
        >
          Lưu thay đổi
        </Button>
      )}
    </div>
  )
}
