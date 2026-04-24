import { Button, message, Modal } from 'antd'
import { changePositionManyProducts, changeStatusManyProducts, deleteManyProducts } from '@/services/adminProductService'

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
  const handleApplyAction = () => {
    if (!selectedRowKeys.length) return message.warning('⚠️ Please select products first.')
    if (!value) return message.warning('⚠️ Please choose an action.')

    switch (value) {
      case 'delete':
        Modal.confirm({
          title: <span className="dark:text-gray-300">Confirm Deletion</span>,
          content: <span className="dark:text-gray-300">Are you sure you want to delete {selectedRowKeys.length} selected products?</span>,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await deleteManyProducts(selectedRowKeys)
              message.success(`🗑️ Deleted ${selectedRowKeys.length} products successfully!`)
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
              message.error('❌ Failed to delete selected products.')
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
              Change status of {selectedRowKeys.length} products to "{newStatus}"?
            </span>
          ),
          okText: 'Yes',
          cancelText: 'Cancel',
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
              message.success(`✅ Status updated to "${newStatus}" for ${selectedRowKeys.length} products`)
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
          title: <span className="dark:text-gray-300">Confirm Change Position</span>,
          content: <span className="dark:text-gray-300">Change position of {selectedRowKeys.length} products?</span>,
          okText: 'Yes',
          cancelText: 'Cancel',
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
              message.success(`✅ Changed position for ${selectedRowKeys.length} products`)
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
