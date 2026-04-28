import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useAdminPermissionForm } from './hooks/useAdminPermissionForm'
import { useAdminPermissionsData } from './hooks/useAdminPermissionsData'
import AdminPermissionFormModal from './sections/AdminPermissionFormModal'
import AdminPermissionsHeaderSection from './sections/AdminPermissionsHeaderSection'
import AdminPermissionsStatsSection from './sections/AdminPermissionsStatsSection'
import AdminPermissionsTableSection from './sections/AdminPermissionsTableSection'
import './AdminPermissionsPage.scss'

const DEFAULT_PAGE_SIZE = 10

export default function AdminPermissionsPage() {
  const { t, i18n } = useTranslation('adminPermissions')
  const language = i18n.resolvedLanguage || i18n.language
  const grantedPermissions = useAdminPermissions()
  const { permissionList, loading, fetchPermissions, handleDeletePermission } = useAdminPermissionsData({ t })
  const permissionForm = useAdminPermissionForm({ onSaved: fetchPermissions, t })
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
          <AdminPermissionsHeaderSection
            t={t}
            canCreatePermission={grantedPermissions.includes('create_permission')}
            onCreatePermission={() => permissionForm.openModal()}
          />

          <AdminPermissionsStatsSection t={t} permissionList={permissionList} />

          <AdminPermissionsTableSection
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

        <AdminPermissionFormModal t={t} language={language} {...permissionForm} />
      </div>
    </div>
  )
}
