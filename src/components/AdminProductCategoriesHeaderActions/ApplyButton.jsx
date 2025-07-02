import { Button, message, Modal } from 'antd'
import {
  changePositionManyProductCategories,
  changeStatusManyProductCategories,
  deleteManyProductCategories
} from '../../services/productCategoryService'

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
          okText: 'Yes',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await changeStatusManyProductCategories(selectedRowKeys, newStatus)
              setProductCategories(prev => prev.map(p => (selectedRowKeys.includes(p._id) ? { ...p, status: newStatus } : p)))
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
              await changePositionManyProductCategories(data)
              setProductCategories(prev =>
                prev.map(p => {
                  const edited = data.find(d => d._id === p._id)
                  return edited ? { ...p, position: edited.position } : p
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
      <Button type="primary" disabled={!value || !selectedRowKeys.length} onClick={() => handleApplyAction()}>
        Apply
      </Button>
    </>
  )
}

export default ApplyButton
