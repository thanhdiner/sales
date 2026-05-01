import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { usePermissionForm } from './hooks/usePermissionForm'
import { usePermissionsData } from './hooks/usePermissionsData'
import PermissionFormModal from './sections/PermissionFormModal'
import PermissionsHeader from './sections/PermissionsHeader'
import PermissionsStats from './sections/PermissionsStats'
import PermissionsTable from './sections/PermissionsTable'
import './index.scss'

const DEFAULT_PAGE_SIZE = 10

export default function Permissions() {
  const { t, i18n } = useTranslation('adminPermissions')
  const language = i18n.resolvedLanguage || i18n.language
  const grantedPermissions = useAdminPermissions()
  const { permissionList, loading, fetchPermissions, handleDeletePermission } = usePermissionsData({ t })
  const permissionForm = usePermissionForm({ onSaved: fetchPermissions, t })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedPermissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return permissionList.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, permissionList])

  return (
    <div className="admin-permissions-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-3 sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-permissions-page__inner mx-auto max-w-7xl">
        <div className="admin-permissions-panel rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
          <PermissionsHeader
            t={t}
            canCreatePermission={grantedPermissions.includes('create_permission')}
            onCreatePermission={() => permissionForm.openModal()}
          />

          <PermissionsStats t={t} permissionList={permissionList} />

          <PermissionsTable
            t={t}
            permissionList={paginatedPermissions}
            total={permissionList.length}
            currentPage={currentPage}
            pageSize={pageSize}
            permissionGroups={permissionForm.permissionGroups}
            language={language}
            loading={loading}
            grantedPermissions={grantedPermissions}
            onPageChange={page => setCurrentPage(page)}
            onPageSizeChange={(page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            }}
            onEditPermission={permissionForm.openModal}
            onDeletePermission={handleDeletePermission}
          />
        </div>

        <PermissionFormModal t={t} language={language} {...permissionForm} />
      </div>
    </div>
  )
}
