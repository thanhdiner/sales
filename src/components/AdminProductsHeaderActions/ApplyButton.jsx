import { Button, message, Modal } from 'antd'
import { changePositionManyProducts, changeStatusManyProducts, deleteManyProducts } from '../../services/productService'

function ApplyButton({ value, setValue, selectedRowKeys, products, setProducts, setTotalProducts, setSelectedRowKeys, editedPositions }) {
  const handleApplyAction = () => {
    if (!selectedRowKeys.length) return message.warning('⚠️ Please select products first.')
    if (!value) return message.warning('⚠️ Please choose an action.')

    switch (value) {
      case 'delete':
        Modal.confirm({
          title: 'Confirm Delete',
          content: `Are you sure you want to delete ${selectedRowKeys.length} selected products?`,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await deleteManyProducts(selectedRowKeys)
              message.success(`🗑️ Deleted ${selectedRowKeys.length} products successfully!`)
              setProducts(prev => prev.filter(p => !selectedRowKeys.includes(p._id)))
              setTotalProducts(prev => prev - selectedRowKeys.length)
              setSelectedRowKeys([])
              setValue(undefined)
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
          title: 'Confirm Status Change',
          content: `Change status of ${selectedRowKeys.length} products to "${newStatus}"?`,
          okText: 'Yes',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await changeStatusManyProducts(selectedRowKeys, newStatus)
              setProducts(prev => prev.map(p => (selectedRowKeys.includes(p._id) ? { ...p, status: newStatus } : p)))
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
          title: 'Confirm Position Change',
          content: `Change position of ${selectedRowKeys.length} products?`,
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
              await changePositionManyProducts(data)
              setProducts(prev =>
                prev.map(p => {
                  const edited = data.find(d => d._id === p._id)
                  return edited ? { ...p, position: edited.position } : p
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
