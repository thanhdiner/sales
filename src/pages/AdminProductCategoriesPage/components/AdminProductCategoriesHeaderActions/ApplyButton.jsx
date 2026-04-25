import { Button, message, Modal } from 'antd'
import {
  changePositionManyProductCategories,
  changeStatusManyProductCategories,
  deleteManyProductCategories
} from '@/services/adminProductCategoryService'

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
  const handleApplyAction = () => {
    if (!selectedRowKeys.length) return message.warning('⚠️ Please select products first.')
    if (!value) return message.warning('⚠️ Please choose an action.')

    switch (value) {
      case 'delete':
        Modal.confirm({
          title: 'Confirm Delete',
          content: `Are you sure you want to delete ${selectedRowKeys.length} selected product categories?`,
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await deleteManyProductCategories(selectedRowKeys)
              message.success(`🗑️ Deleted ${selectedRowKeys.length} product categories successfully!`)
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
              message.error('❌ Failed to delete selected product categories.')
            }
          }
        })
        break

      case 'status-active':
      case 'status-inactive': {
        const newStatus = value === 'status-active' ? 'active' : 'inactive'

        Modal.confirm({
          title: 'Confirm Status Change',
          content: `Change status of ${selectedRowKeys.length} product categories to "${newStatus}"?`,
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: 'Yes',
          cancelText: 'Cancel',
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
              message.success(`✅ Status updated to "${newStatus}" for ${selectedRowKeys.length} product categories`)
              setSelectedRowKeys([])
              setValue(undefined)
            } catch (err) {
              console.error('Failed to update status:', err)
              message.error('❌ Failed to change status.')
            }
          }
        })
        break
      }
      case 'change-position':
        Modal.confirm({
          title: 'Confirm Position Change',
          content: `Change position of ${selectedRowKeys.length} product categories?`,
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: 'Yes',
          cancelText: 'Cancel',
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
              message.success(`✅ Changed position for ${selectedRowKeys.length} product categories`)
              setSelectedRowKeys([])
              setValue(undefined)
            } catch (err) {
              console.error('Failed to change positions:', err)
              message.error('❌ Failed to change positions.')
            }
          }
        })
        break

      default:
        message.warning('⚠️ This action is not supported yet.')
    }
  }
  return (
    <>
      <Button
        type="primary"
        disabled={!value || !selectedRowKeys.length}
        onClick={() => handleApplyAction()}
        className="admin-product-categories-btn admin-product-categories-btn--apply"
      >
        Apply
      </Button>
    </>
  )
}

export default ApplyButton
