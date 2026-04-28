import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useAdminPermissionGroupForm } from './hooks/useAdminPermissionGroupForm'
import { useAdminPermissionGroupsData } from './hooks/useAdminPermissionGroupsData'
import AdminPermissionGroupFormModal from './sections/AdminPermissionGroupFormModal'
import AdminPermissionGroupsHeaderSection from './sections/AdminPermissionGroupsHeaderSection'
import AdminPermissionGroupsStatsSection from './sections/AdminPermissionGroupsStatsSection'
import AdminPermissionGroupsTableSection from './sections/AdminPermissionGroupsTableSection'
import './AdminPermissionGroupsPage.scss'

const DEFAULT_PAGE_SIZE = 10

export default function AdminPermissionGroupsPage() {
  const { t } = useTranslation('adminPermissionGroups')
  const permissions = useAdminPermissions()
  const { groups, loading, updatingId, fetchGroups, handleDeleteGroup, handleToggleGroupActive } =
    useAdminPermissionGroupsData()
  const groupForm = useAdminPermissionGroupForm({ onSaved: fetchGroups })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return groups.slice(startIndex, startIndex + pageSize)
  }, [currentPage, groups, pageSize])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(groups.length / pageSize))

    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [currentPage, groups.length, pageSize])

  return (
    <div className="admin-permission-groups-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-permission-groups-page__inner">
        <section className="admin-permission-groups-card">
          <AdminPermissionGroupsHeaderSection
            canCreateGroup={permissions.includes('create_permission_group')}
            onCreateGroup={() => groupForm.openModal()}
          />

          <AdminPermissionGroupsStatsSection groups={groups} />

          <AdminPermissionGroupsTableSection
            groups={paginatedGroups}
            total={groups.length}
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
            updatingId={updatingId}
            permissions={permissions}
            onPageChange={page => setCurrentPage(page)}
            onPageSizeChange={(page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            }}
            onEditGroup={groupForm.openModal}
            onDeleteGroup={handleDeleteGroup}
            onToggleGroupActive={handleToggleGroupActive}
          />
        </section>

        <AdminPermissionGroupFormModal {...groupForm} />
      </div>
    </div>
  )
}
