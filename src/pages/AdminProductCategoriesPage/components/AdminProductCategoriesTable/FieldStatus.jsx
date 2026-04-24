import { message, Modal, Tag } from 'antd'
import { toggleProductCategoryStatus } from '@/services/adminProductCategoryService'
import useAdminPermissions from '@/hooks/useAdminPermissions'

function FieldStatus({ status, record, setProductCategories }) {
  const permissions = useAdminPermissions()

  if (!permissions.includes('edit_product_category')) {
    return <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
  }

  return (
    <Tag
      color={status === 'active' ? 'green' : 'red'}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        Modal.confirm({
          title: <span className="dark:text-gray-300">Change Product Category Status</span>,
          content: (
            <span className="dark:text-gray-200">
              Are you sure you want to change status of "{record.title}" from "{status}" to " {status === 'active' ? 'inactive' : 'active'}
              "?
            </span>
          ),
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
            try {
              const updated = await toggleProductCategoryStatus(record._id, status)
              setProductCategories(prev =>
                prev.map(p =>
                  p._id === record._id
                    ? {
                        ...p,
                        status: updated.status,
                        updateBy: updated.productCategory.updateBy,
                        updateAt: updated.productCategory.updateAt
                      }
                    : p
                )
              )
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
