import { Button, message, Modal } from 'antd'
import { changePositionManyProducts, changeStatusManyProducts, deleteManyProducts } from '@/services/adminProductService'
import { useTranslation } from 'react-i18next'

const ADMIN_PRODUCTS_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function ApplyButton({
  value,
  setValue,
  selectedRowKeys,
  products,
  setProducts,
  setTotalProducts,
  setSelectedRowKeys,
  editedPositions,
  totalProducts,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const { t } = useTranslation('adminProducts')

  const handleApplyAction = () => {
    if (!selectedRowKeys.length) return message.warning(t('bulk.messages.selectFirst'))
    if (!value) return message.warning(t('bulk.messages.chooseAction'))

    switch (value) {
      case 'delete':
        Modal.confirm({
          className: 'admin-products-confirm-modal',
          maskStyle: ADMIN_PRODUCTS_CONFIRM_MASK_STYLE,
          title: <span>{t('bulk.modals.deleteTitle')}</span>,
          content: <span>{t('bulk.modals.deleteContent', { count: selectedRowKeys.length })}</span>,
          okText: t('common.yes'),
          okType: 'danger',
          cancelText: t('common.cancel'),
          onOk: async () => {
            try {
              await deleteManyProducts(selectedRowKeys)
              message.success(t('bulk.messages.deleteSuccess', { count: selectedRowKeys.length }))
              const updatedProducts = products.filter(p => !selectedRowKeys.includes(p._id))
              const updatedTotal = totalProducts - selectedRowKeys.length

              setTotalProducts(updatedTotal)
              setSelectedRowKeys([])
              setValue(undefined)

              if (updatedProducts.length === 0 && updatedTotal > 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1)
              } else {
                await fetchData()
              }
            } catch (err) {
              console.error('Failed to delete products:', err)
              message.error(t('bulk.messages.deleteError'))
            }
          }
        })
        break

      case 'status-active':
      case 'status-inactive': {
        const newStatus = value === 'status-active' ? 'active' : 'inactive'
        const statusLabel = t(`status.${newStatus}`)

        Modal.confirm({
          className: 'admin-products-confirm-modal',
          maskStyle: ADMIN_PRODUCTS_CONFIRM_MASK_STYLE,
          title: <span>{t('bulk.modals.statusTitle')}</span>,
          content: <span>{t('bulk.modals.statusContent', { count: selectedRowKeys.length, status: statusLabel })}</span>,
          okText: t('common.yes'),
          cancelText: t('common.cancel'),
          onOk: async () => {
            try {
              const res = await changeStatusManyProducts(selectedRowKeys, newStatus)
              const updatedProducts = res.products || []
              setProducts(prev =>
                prev.map(p => {
                  const found = updatedProducts.find(u => u._id === p._id)
                  return found ? { ...p, ...found } : p
                })
              )
              message.success(t('bulk.messages.statusSuccess', { count: selectedRowKeys.length, status: statusLabel }))
              setSelectedRowKeys([])
              setValue(undefined)
            } catch (err) {
              console.error('Failed to update status:', err)
              message.error(t('bulk.messages.statusError'))
            }
          }
        })
        break
      }
      case 'change-position':
        Modal.confirm({
          className: 'admin-products-confirm-modal',
          maskStyle: ADMIN_PRODUCTS_CONFIRM_MASK_STYLE,
          title: <span>{t('bulk.modals.positionTitle')}</span>,
          content: <span>{t('bulk.modals.positionContent', { count: selectedRowKeys.length })}</span>,
          okText: t('common.yes'),
          cancelText: t('common.cancel'),
          onOk: async () => {
            try {
              const data = selectedRowKeys.map(key => {
                const editedPosition = editedPositions[key]
                const originalProduct = products.find(p => p._id === key)

                return {
                  _id: key,
                  position: editedPosition !== undefined ? editedPosition : originalProduct?.position || 0
                }
              })
              const res = await changePositionManyProducts(data)
              const updatedProducts = res.products || []
              setProducts(prev =>
                prev.map(p => {
                  const found = updatedProducts.find(u => u._id === p._id)
                  return found ? { ...p, ...found } : p
                })
              )
              message.success(t('bulk.messages.positionSuccess', { count: selectedRowKeys.length }))
              setSelectedRowKeys([])
              setValue(undefined)
            } catch (err) {
              console.error('Failed to change positions:', err)
              message.error(t('bulk.messages.positionError'))
            }
          }
        })
        break

      default:
        message.warning(t('bulk.messages.unsupported'))
    }
  }
  return (
    <>
      <Button type="primary" className="admin-products-btn admin-products-btn--apply" disabled={!value || !selectedRowKeys.length} onClick={() => handleApplyAction()}>
        {t('common.apply')}
      </Button>
    </>
  )
}

export default ApplyButton
