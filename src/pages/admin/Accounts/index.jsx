import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useAccounts from './hooks/useAccounts'
import AccountsHeader from './sections/AccountsHeader'
import AccountsTable from './sections/AccountsTable'
import AccountsFormModal from './sections/AccountsFormModal'
import './index.scss'

const DEFAULT_PAGE_SIZE = 10

export default function Accounts() {
  const { t } = useTranslation('adminAccounts')
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
  } = useAccounts()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [currentPage, data, pageSize])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(data.length / pageSize))

    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [currentPage, data.length, pageSize])

  return (
    <div className="admin-accounts-page min-h-full rounded-xl bg-[var(--admin-bg-soft)] p-3 text-[var(--admin-text)] sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-4 lg:space-y-5">
        <AccountsHeader onCreate={handleOpenCreate} />

        <AccountsTable
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

        <AccountsFormModal
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
