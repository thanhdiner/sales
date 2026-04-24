import SEO from '@/components/SEO'
import useAdminBankInfoPage from './hooks/useAdminBankInfoPage'
import AdminBankInfoFormModalSection from './sections/AdminBankInfoFormModalSection'
import AdminBankInfoTableSection from './sections/AdminBankInfoTableSection'

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
    <div className="rounded-xl p-4 dark:bg-gray-800">
      <SEO title="Admin - Ngân hàng" noIndex />

      <AdminBankInfoTableSection
        data={data}
        loading={loading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
      />

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
