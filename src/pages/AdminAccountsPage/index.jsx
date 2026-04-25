import { useMemo, useState } from 'react'
import SEO from '@/components/SEO'
import useAdminAccountsPage from './hooks/useAdminAccountsPage'
import AdminAccountsHeaderSection from './sections/AdminAccountsHeaderSection'
import AdminAccountsTableSection from './sections/AdminAccountsTableSection'
import AdminAccountsFormModalSection from './sections/AdminAccountsFormModalSection'
import './AdminAccountsPage.scss'

const DEFAULT_PAGE_SIZE = 10

export default function AdminAccountsPage() {
  const {
    data,
    roles,
    loading,
    modalOpen,
    editing,
    form,
    bodyStyle,
    contentRef,
    submitLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleChangeStatus,
    handleAvatarBeforeUpload,
    handleAvatarRemove
  } = useAdminAccountsPage()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [currentPage, data, pageSize])

  return (
    <div className="admin-accounts-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-6 text-[var(--admin-text)]">
      <SEO title="Admin - Tài khoản" noIndex />

      <div className="mx-auto max-w-7xl space-y-5">
        <AdminAccountsHeaderSection onCreate={handleOpenCreate} />

        <AdminAccountsTableSection
          data={paginatedData}
          total={data.length}
          currentPage={currentPage}
          pageSize={pageSize}
          roles={roles}
          loading={loading}
          onPageChange={page => setCurrentPage(page)}
          onPageSizeChange={(page, size) => {
            setCurrentPage(page)
            setPageSize(size)
          }}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onChangeStatus={handleChangeStatus}
        />

        <AdminAccountsFormModalSection
          open={modalOpen}
          editing={editing}
          form={form}
          roles={roles}
          bodyStyle={bodyStyle}
          contentRef={contentRef}
          submitLoading={submitLoading}
          onClose={handleCloseModal}
          onSubmit={handleSave}
          onAvatarBeforeUpload={handleAvatarBeforeUpload}
          onAvatarRemove={handleAvatarRemove}
        />
      </div>
    </div>
  )
}
