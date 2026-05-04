import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import usePermissions from '@/hooks/admin/useAdminPermissions'
import { useListSearchParams } from '@/hooks/shared/useListSearchParams'
import { usePermissionGroupForm } from './hooks/usePermissionGroupForm'
import { usePermissionGroupsData } from './hooks/usePermissionGroupsData'
import PermissionGroupFormModal from './sections/PermissionGroupFormModal'
import PermissionGroupsHeader from './sections/PermissionGroupsHeader'
import PermissionGroupsStats from './sections/PermissionGroupsStats'
import PermissionGroupsTable from './sections/PermissionGroupsTable'
import './index.scss'

const DEFAULT_PAGE_SIZE = 10

export default function PermissionGroups() {
  const { t } = useTranslation('adminPermissionGroups')
  const permissions = usePermissions()
  const { groups, loading, updatingId, fetchGroups, handleDeleteGroup, handleToggleGroupActive } = usePermissionGroupsData()
  const groupForm = usePermissionGroupForm({ onSaved: fetchGroups })
  const { page: currentPage, setPage: setCurrentPage, pageSize, setPageSize } = useListSearchParams({
    defaultPage: 1,
    defaultPageSize: DEFAULT_PAGE_SIZE
  })

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return groups.slice(startIndex, startIndex + pageSize)
  }, [currentPage, groups, pageSize])

  useEffect(() => {
    if (loading) return

    const maxPage = Math.max(1, Math.ceil(groups.length / pageSize))

    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [currentPage, groups.length, loading, pageSize, setCurrentPage])

  return (
    <div className="admin-permission-groups-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-permission-groups-page__inner">
        <section className="admin-permission-groups-card">
          <PermissionGroupsHeader
            canCreateGroup={permissions.includes('create_permission_group')}
            onCreateGroup={() => groupForm.openModal()}
          />

          <PermissionGroupsStats groups={groups} />

          <PermissionGroupsTable
            groups={paginatedGroups}
            total={groups.length}
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
            updatingId={updatingId}
            permissions={permissions}
            onPageChange={page => setCurrentPage(page)}
            onPageSizeChange={(_, size) => setPageSize(size)}
            onEditGroup={groupForm.openModal}
            onDeleteGroup={handleDeleteGroup}
            onToggleGroupActive={handleToggleGroupActive}
          />
        </section>

        <PermissionGroupFormModal {...groupForm} />
      </div>
    </div>
  )
}
