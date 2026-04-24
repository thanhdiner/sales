import './AdminRolePermissionPage.scss'
import SEO from '@/components/SEO'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useAdminRolePermissionsData } from './hooks/useAdminRolePermissionsData'
import AdminRolePermissionsHeaderSection from './sections/AdminRolePermissionsHeaderSection'
import AdminRolePermissionsTableSection from './sections/AdminRolePermissionsTableSection'

export default function AdminRolePermissionsPage() {
  const grantedPermissions = useAdminPermissions()
  const {
    roles,
    permissions,
    permissionGroups,
    loading,
    rolePerm,
    handleRoleSelectAll,
    handleGroupSelectAll,
    handleCheckbox,
    handleUpdate
  } = useAdminRolePermissionsData()

  return (
    <>
      <SEO title="Admin – Phân quyền" noIndex />

      <AdminRolePermissionsHeaderSection
        canEditRolePermission={grantedPermissions.includes('edit_role_permission')}
        loading={loading}
        onSave={handleUpdate}
      />

      <AdminRolePermissionsTableSection
        roles={roles}
        permissions={permissions}
        permissionGroups={permissionGroups}
        loading={loading}
        rolePerm={rolePerm}
        onRoleSelectAll={handleRoleSelectAll}
        onGroupSelectAll={handleGroupSelectAll}
        onPermissionToggle={handleCheckbox}
      />
    </>
  )
}
