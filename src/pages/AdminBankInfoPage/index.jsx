import SEO from '@/components/SEO'
import useAdminBankInfoPage from './hooks/useAdminBankInfoPage'
import AdminBankInfoFormModalSection from './sections/AdminBankInfoFormModalSection'
import AdminBankInfoHeaderSection from './sections/AdminBankInfoHeaderSection'
import AdminBankInfoStatsSection from './sections/AdminBankInfoStatsSection'
import AdminBankInfoTableSection from './sections/AdminBankInfoTableSection'
import './AdminBankInfoPage.scss'

export default function AdminBankInfoPage() {
  const {
    data,
    loading,
    open,
    editing,
    form,
    bodyStyle,
    contentRef,
    submitLoading,
    activateLoadingId,
    handleCreate,
    handleEdit,
    handleClose,
    handleSubmit,
    handleDelete,
    handleActivate,
    handleQrBeforeUpload,
    handleQrRemove
  } = useAdminBankInfoPage()

  return (
    <div className="admin-bank-info-page min-h-screen rounded-xl p-6">
      <SEO title="Admin - Ngân hàng" noIndex />

      <div className="admin-bank-info-page__inner mx-auto max-w-7xl space-y-5">
        <AdminBankInfoHeaderSection onCreate={handleCreate} />

        <AdminBankInfoStatsSection bankInfos={data} />

        <AdminBankInfoTableSection
          data={data}
          loading={loading}
          activateLoadingId={activateLoadingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onActivate={handleActivate}
        />
      </div>

      <AdminBankInfoFormModalSection
        open={open}
        editing={editing}
        form={form}
        bodyStyle={bodyStyle}
        contentRef={contentRef}
        submitLoading={submitLoading}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onQrBeforeUpload={handleQrBeforeUpload}
        onQrRemove={handleQrRemove}
      />
    </div>
  )
}

