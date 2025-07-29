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
          title: <span className="dark:text-gray-300">Confirm Delete</span>,
          content: (
            <span className="dark:text-gray-300">
              Are you sure you want to delete {selectedRowKeys.length} selected product categories?
            </span>
          ),
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
          title: <span className="dark:text-gray-300">Confirm Status Change</span>,
          content: (
            <span className="dark:text-gray-300">
              Change status of {selectedRowKeys.length} product categories to "{newStatus}"?
            </span>
          ),
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
          title: <span className="dark:text-gray-300">Confirm Position Change</span>,
          content: <span className="dark:text-gray-300">Change position of {selectedRowKeys.length} product categories?</span>,
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
      <Button type="primary" disabled={!value || !selectedRowKeys.length} onClick={() => handleApplyAction()}>
        Apply
      </Button>
    </>
  )
}

export default ApplyButton
