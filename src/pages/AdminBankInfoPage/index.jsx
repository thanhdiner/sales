import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
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
    <div className="admin-bank-info-page min-h-screen rounded-xl p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-bank-info-page__inner mx-auto max-w-7xl space-y-5">
        <AdminBankInfoHeaderSection t={t} onCreate={handleCreate} />

        <AdminBankInfoStatsSection t={t} bankInfos={data} />

        <AdminBankInfoTableSection
          t={t}
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

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
    </div>
  )
}
