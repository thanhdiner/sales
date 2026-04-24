import { message, Modal, Tag } from 'antd'
import { toggleProductStatus } from '@/services/adminProductService'
import useAdminPermissions from '@/hooks/useAdminPermissions'

function FieldStatus({ status, record, setProducts }) {
  const permission = useAdminPermissions()

  if (!permission.includes('edit_product')) {
    return <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
  }

  return (
    <Tag
      color={status === 'active' ? 'green' : 'red'}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        Modal.confirm({
          title: <span className="dark:text-gray-300">Change Product Status</span>,
          content: (
            <span className="dark:text-gray-300">
              Are you sure you want to change status of {record.title} from {status} to
              {status === 'active' ? ' inactive' : ' active'}?
            </span>
          ),
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
            try {
              const updated = await toggleProductStatus(record._id, status)
              setProducts(prev =>
                prev.map(p =>
                  p._id === updated.product._id
                    ? {
                        ...p,
                        status: updated.status,
                        updateBy: updated.product.updateBy,
                        updatedAt: updated.product.updatedAt
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
