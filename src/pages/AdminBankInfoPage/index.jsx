import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/ui'
import useAdminBankInfoPage from './hooks/useAdminBankInfoPage'
import AdminBankInfoFormModalSection from './sections/AdminBankInfoFormModalSection'
import AdminBankInfoHeaderSection from './sections/AdminBankInfoHeaderSection'
import AdminBankInfoStatsSection from './sections/AdminBankInfoStatsSection'
import AdminBankInfoTableSection from './sections/AdminBankInfoTableSection'
import './AdminBankInfoPage.scss'

export default function AdminBankInfoPage() {
  const { t } = useTranslation('adminBankInfo')
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
    handleQrBeforeUpload,
    handleQrRemove
  } = useAdminBankInfoPage({ t })

  return (
    <AdminPageShell
      seoTitle={t('seo.title')}
      className="admin-bank-info-page"
      contentClassName="admin-bank-info-page__inner space-y-5"
      maxWidth="1280px"
    >
      <AdminBankInfoHeaderSection t={t} onCreate={handleCreate} />

      <AdminBankInfoStatsSection t={t} bankInfos={data} />

      <AdminBankInfoTableSection
        t={t}
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminBankInfoFormModalSection
        t={t}
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
    </AdminPageShell>
  )
}
