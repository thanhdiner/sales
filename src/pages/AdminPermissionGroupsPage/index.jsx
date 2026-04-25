import { useMemo, useState } from 'react'
import SEO from '@/components/SEO'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useAdminPermissionGroupForm } from './hooks/useAdminPermissionGroupForm'
import { useAdminPermissionGroupsData } from './hooks/useAdminPermissionGroupsData'
import AdminPermissionGroupFormModal from './sections/AdminPermissionGroupFormModal'
import AdminPermissionGroupsHeaderSection from './sections/AdminPermissionGroupsHeaderSection'
import AdminPermissionGroupsTableSection from './sections/AdminPermissionGroupsTableSection'
import './AdminPermissionGroupsPage.scss'

const DEFAULT_PAGE_SIZE = 10

export default function AdminPermissionGroupsPage() {
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

  return (
    <div className="admin-permission-groups-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-6">
      <SEO title="Admin – Nhóm quyền" noIndex />

      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]">
          <AdminPermissionGroupsHeaderSection
            canCreateGroup={permissions.includes('create_permission_group')}
            onCreateGroup={() => groupForm.openModal()}
          />

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
        </div>

        <AdminPermissionGroupFormModal {...groupForm} />
      </div>
    </div>
  )
}
