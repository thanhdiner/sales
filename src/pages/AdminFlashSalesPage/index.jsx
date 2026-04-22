import { Plus } from 'lucide-react'
import { Button, Modal, message } from 'antd'
import SEO from '@/components/SEO'
import FlashSaleFormModal from './components/FlashSaleFormModal'
import FlashSalesTable from './components/FlashSalesTable'
import FlashSaleStats from './components/FlashSaleStats'
import { useAdminFlashSalesData } from './hooks/useAdminFlashSalesData'
import { useFlashSaleForm } from './hooks/useFlashSaleForm'
import { validateFlashSaleForm } from './utils/flashSaleHelpers'

const FlashSaleAdmin = () => {
  const { flashSales, tableLoading, submitLoading, submitFlashSale, deleteFlashSaleItem } = useAdminFlashSalesData()
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
      title: <span className="dark:text-white">Xác nhận xóa</span>,
      content: <span className="dark:text-white">Bạn có chắc chắn muốn xóa flash sale này?</span>,
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
    <div className="min-h-screen rounded-xl bg-gray-50 p-4 dark:bg-gray-800 sm:p-6">
      <SEO title="Admin – Flash Sale" noIndex />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Quản Lý Flash Sale</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý các chương trình khuyến mãi flash sale</p>
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
          flashSales={flashSales}
          tableLoading={tableLoading}
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
