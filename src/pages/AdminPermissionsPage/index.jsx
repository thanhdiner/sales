import SEO from '@/components/SEO'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useAdminPermissionForm } from './hooks/useAdminPermissionForm'
import { useAdminPermissionsData } from './hooks/useAdminPermissionsData'
import AdminPermissionFormModal from './sections/AdminPermissionFormModal'
import AdminPermissionsHeaderSection from './sections/AdminPermissionsHeaderSection'
import AdminPermissionsTableSection from './sections/AdminPermissionsTableSection'

export default function AdminPermissionsPage() {
  const grantedPermissions = useAdminPermissions()
  const { permissionList, loading, fetchPermissions, handleDeletePermission } = useAdminPermissionsData()
  const permissionForm = useAdminPermissionForm({ onSaved: fetchPermissions })

  return (
    <div className="min-h-screen rounded-xl bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin – Quyền hạn" noIndex />

      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <AdminPermissionsHeaderSection
            canCreatePermission={grantedPermissions.includes('create_permission')}
            onCreatePermission={() => permissionForm.openModal()}
          />

          <AdminPermissionsTableSection
            permissionList={permissionList}
            permissionGroups={permissionForm.permissionGroups}
            loading={loading}
            grantedPermissions={grantedPermissions}
            onEditPermission={permissionForm.openModal}
            onDeletePermission={handleDeletePermission}
          />
        </div>

        <AdminPermissionFormModal {...permissionForm} />
      </div>
    </div>
  )
}
