import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Modal, message } from 'antd'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import FlashSaleFormModal from './components/FlashSaleFormModal'
import FlashSalesTable from './components/FlashSalesTable'
import FlashSaleStats from './components/FlashSaleStats'
import { useAdminFlashSalesData } from './hooks/useAdminFlashSalesData'
import { useFlashSaleForm } from './hooks/useFlashSaleForm'
import { validateFlashSaleForm } from './utils/flashSaleHelpers'
import './AdminFlashSalesPage.scss'

const DEFAULT_PAGE_SIZE = 10
const ADMIN_FLASH_SALES_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

const FlashSaleAdmin = () => {
  const { t } = useTranslation('adminFlashSales')
  const { flashSales, tableLoading, submitLoading, submitFlashSale, deleteFlashSaleItem } = useAdminFlashSalesData()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const paginatedFlashSales = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return flashSales.slice(startIndex, startIndex + pageSize)
  }, [currentPage, flashSales, pageSize])
  const {
    showModal,
    editingItem,
    formData,
    productList,
    productLoading,
    openCreate,
    openEdit,
    closeModal,
    handleChange,
    handleSearchProduct
  } = useFlashSaleForm()

  const handleDelete = id => {
    Modal.confirm({
      className: 'admin-flash-sales-confirm-modal',
      maskStyle: ADMIN_FLASH_SALES_CONFIRM_MASK_STYLE,
      title: <span>{t('confirmDelete.title')}</span>,
      content: <span>{t('confirmDelete.content')}</span>,
      okText: t('confirmDelete.ok'),
      cancelText: t('confirmDelete.cancel'),
      okType: 'danger',
      onOk: () => deleteFlashSaleItem(id)
    })
  }

  const handleSubmit = async () => {
    const validationError = validateFlashSaleForm(formData, t)

    if (validationError) {
      message.warning(validationError)
      return
    }

    const isSuccess = await submitFlashSale({ editingItem, formData })

    if (isSuccess) {
      closeModal()
    }
  }

  const renderCreateButton = () => (
    <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate} className="admin-flash-sales-create-btn">
      <span>{t('actions.create')}</span>
    </Button>
  )

  return (
    <div className="admin-flash-sales-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-3 sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-flash-sales-page__inner mx-auto max-w-7xl">
        <div className="admin-flash-sales-header mb-6">
          <div className="min-w-0">
            <h1 className="mb-2 text-2xl font-bold leading-tight text-[var(--admin-text)] sm:text-3xl">
              {t('page.title')}
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)] sm:text-base">
              {t('page.description')}
            </p>
          </div>

          <div className="admin-flash-sales-header__mobile-action">
            {renderCreateButton()}
          </div>
        </div>

        <FlashSaleStats flashSales={flashSales} />

        <div className="admin-flash-sales-toolbar mb-6">
          <div className="flex flex-wrap gap-3">{/* Future filters */}</div>
          {renderCreateButton()}
        </div>

        <FlashSalesTable
          flashSales={paginatedFlashSales}
          total={flashSales.length}
          currentPage={currentPage}
          pageSize={pageSize}
          tableLoading={tableLoading}
          onPageChange={page => setCurrentPage(page)}
          onPageSizeChange={(page, size) => {
            setCurrentPage(page)
            setPageSize(size)
          }}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        <FlashSaleFormModal
          open={showModal}
          editingItem={editingItem}
          formData={formData}
          productList={productList}
          productLoading={productLoading}
          submitLoading={submitLoading}
          onCancel={closeModal}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onSearchProduct={handleSearchProduct}
        />
      </div>
    </div>
  )
}

export default FlashSaleAdmin
