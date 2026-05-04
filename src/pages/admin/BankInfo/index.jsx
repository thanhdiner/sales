import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useBankInfo from './hooks/useBankInfo'
import BankInfoFormModal from './sections/BankInfoFormModal'
import BankInfoHeader from './sections/BankInfoHeader'
import BankInfoStats from './sections/BankInfoStats'
import BankInfoTable from './sections/BankInfoTable'
import './index.scss'

export default function BankInfo() {
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
  } = useBankInfo({ t })

  return (
    <div className="admin-bank-info-page space-y-5">
      <SEO title={t('seo.title')} noIndex />

      <BankInfoHeader t={t} onCreate={handleCreate} />

      <BankInfoStats t={t} bankInfos={data} />

      <BankInfoTable
        t={t}
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BankInfoFormModal
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
