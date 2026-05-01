import './index.scss'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { useRolePermissionsData } from './hooks/useRolePermissionsData'
import RolePermissionsHeader from './sections/RolePermissionsHeader'
import RolePermissionsTable from './sections/RolePermissionsTable'

export default function RolePermissions() {
  const { t } = useTranslation('adminRolePermission')
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
  } = useRolePermissionsData()
  const [selectedRoleId, setSelectedRoleId] = useState('')

  useEffect(() => {
    if (!roles.length) {
      if (selectedRoleId) setSelectedRoleId('')
      return
    }

    if (!selectedRoleId || !roles.some(role => role._id === selectedRoleId)) {
      setSelectedRoleId(roles[0]._id)
    }
  }, [roles, selectedRoleId])

  return (
    <div className="admin-role-permission-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-role-permission-page__inner">
        <section className="admin-role-permission-card">
          <RolePermissionsHeader
            canEditRolePermission={grantedPermissions.includes('edit_role_permission')}
            loading={loading}
            roles={roles}
            selectedRoleId={selectedRoleId}
            onRoleChange={setSelectedRoleId}
            onSave={handleUpdate}
          />

          <RolePermissionsTable
            roles={roles}
            permissions={permissions}
            permissionGroups={permissionGroups}
            loading={loading}
            rolePerm={rolePerm}
            selectedRoleId={selectedRoleId}
            onRoleSelectAll={handleRoleSelectAll}
            onGroupSelectAll={handleGroupSelectAll}
            onPermissionToggle={handleCheckbox}
          />
        </section>
      </div>
    </div>
  )
}