import { message, Modal, Tag } from 'antd'
import { toggleProductStatus } from '@/services/adminProductService'
import useAdminPermissions from '@/hooks/useAdminPermissions'

const ADMIN_PRODUCTS_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function FieldStatus({ status, record, setProducts }) {
  const permission = useAdminPermissions()
  const statusClassName = status === 'active' ? 'admin-products-status-tag admin-products-status-tag--active' : 'admin-products-status-tag admin-products-status-tag--inactive'

  if (!permission.includes('edit_product')) {
    return <Tag className={statusClassName}>{status}</Tag>
  }

  return (
    <Tag
      className={`${statusClassName} admin-products-status-tag--clickable`}
      onClick={() => {
        Modal.confirm({
          className: 'admin-products-confirm-modal',
          maskStyle: ADMIN_PRODUCTS_CONFIRM_MASK_STYLE,
          title: <span>Change Product Status</span>,
          content: (
            <span>
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
