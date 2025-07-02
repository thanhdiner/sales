import { message, Modal, Tag } from 'antd'
import { toggleProductCategoryStatus } from '../../services/productCategoryService'

function FieldStatus({ status, record, setProductCategories }) {
  return (
    <Tag
      color={status === 'active' ? 'green' : 'red'}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        Modal.confirm({
          title: 'Change Product Category Status',
          content: `Are you sure you want to change status of "${record.title}" from "${status}" to "${
            status === 'active' ? 'inactive' : 'active'
          }"?`,
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
            try {
              const updated = await toggleProductCategoryStatus(record._id, status)
              setProductCategories(prev => prev.map(p => (p._id === record._id ? { ...p, status: updated.status } : p)))
              message.success(`✅ Status updated to ${updated.status}`)
            } catch (err) {
              message.error('❌ Failed to update status')
            }
          }
        })
      }}
    >
      {status}
    </Tag>
  )
}

export default FieldStatus
