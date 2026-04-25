import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Modal, message } from 'antd'
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
      title: <span>Xác nhận xóa</span>,
      content: <span>Bạn có chắc chắn muốn xóa flash sale này?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => deleteFlashSaleItem(id)
    })
  }

  const handleSubmit = async () => {
    const validationError = validateFlashSaleForm(formData)

    if (validationError) {
      message.warning(validationError)
      return
    }

    const isSuccess = await submitFlashSale({ editingItem, formData })

    if (isSuccess) {
      closeModal()
    }
  }

  return (
    <div className="admin-flash-sales-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-4 sm:p-6">
      <SEO title="Admin - Flash Sale" noIndex />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[var(--admin-text)]">Quản Lý Flash Sale</h1>
          <p className="text-[var(--admin-text-muted)]">Quản lý các chương trình khuyến mãi flash sale</p>
        </div>

        <FlashSaleStats flashSales={flashSales} />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">{/* Filters sau này */}</div>

          <div>
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={openCreate}
              className="w-full sm:w-auto"
            >
              Tạo Flash Sale Mới
            </Button>
          </div>
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
