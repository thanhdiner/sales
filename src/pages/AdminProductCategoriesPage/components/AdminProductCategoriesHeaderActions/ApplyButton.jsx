import { Button, message, Modal } from 'antd'
import {
  changePositionManyProductCategories,
  changeStatusManyProductCategories,
  deleteManyProductCategories
} from '@/services/adminProductCategoryService'
import { useTranslation } from 'react-i18next'

const ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function ApplyButton({
  value,
  setValue,
  selectedRowKeys,
  productCategories,
  setProductCategories,
  setTotalProductCategories,
  setSelectedRowKeys,
  editedPositions,
  totalProductCategories,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const { t } = useTranslation('adminProductCategories')

  const handleApplyAction = () => {
    if (!selectedRowKeys.length) return message.warning(t('bulk.messages.selectFirst'))
    if (!value) return message.warning(t('bulk.messages.chooseAction'))

    switch (value) {
      case 'delete':
        Modal.confirm({
          title: t('bulk.modals.deleteTitle'),
          content: t('bulk.modals.deleteContent', { count: selectedRowKeys.length }),
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: t('common.yes'),
          okType: 'danger',
          cancelText: t('common.cancel'),
          onOk: async () => {
            try {
              await deleteManyProductCategories(selectedRowKeys)
              message.success(t('bulk.messages.deleteSuccess', { count: selectedRowKeys.length }))
              const updatedProductCategories = productCategories.filter(p => !selectedRowKeys.includes(p._id))
              const updatedTotal = totalProductCategories - selectedRowKeys.length

              setTotalProductCategories(updatedTotal)
              setSelectedRowKeys([])
              setValue(undefined)

              if (updatedProductCategories.length === 0 && updatedTotal > 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1)
              } else {
                await fetchData()
              }
            } catch (err) {
              console.error('Failed to delete product categories:', err)
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
          title: t('bulk.modals.statusTitle'),
          content: t('bulk.modals.statusContent', { count: selectedRowKeys.length, status: statusLabel }),
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: t('common.yes'),
          cancelText: t('common.cancel'),
          onOk: async () => {
            try {
              const res = await changeStatusManyProductCategories(selectedRowKeys, newStatus)
              const updatedProductCategories = res.productCategories || []
              setProductCategories(prev =>
                prev.map(p => {
                  const found = updatedProductCategories.find(u => u._id === p._id)
                  return found ? { ...p, ...found } : p
                })
              )
              message.success(t('bulk.messages.statusSuccess', { status: statusLabel, count: selectedRowKeys.length }))
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
          title: t('bulk.modals.positionTitle'),
          content: t('bulk.modals.positionContent', { count: selectedRowKeys.length }),
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: t('common.yes'),
          cancelText: t('common.cancel'),
          onOk: async () => {
            try {
              const data = selectedRowKeys.map(key => {
                const editedPosition = editedPositions[key]
                const originalProductCategory = productCategories.find(p => p._id === key)

                return {
                  _id: key,
                  position: editedPosition !== undefined ? editedPosition : originalProductCategory?.position || 0
                }
              })
              const res = await changePositionManyProductCategories(data)
              const updatedProductCategories = res.productCategories || []
              setProductCategories(prev =>
                prev.map(p => {
                  const found = updatedProductCategories.find(u => u._id === p._id)
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
    <Button
      type="primary"
      disabled={!value || !selectedRowKeys.length}
      onClick={() => handleApplyAction()}
      className="admin-product-categories-btn admin-product-categories-btn--apply"
    >
      {t('common.apply')}
    </Button>
  )
}

export default ApplyButton
