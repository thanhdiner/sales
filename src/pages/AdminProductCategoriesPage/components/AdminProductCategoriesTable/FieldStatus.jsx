import { message, Modal, Tag } from 'antd'
import { toggleProductCategoryStatus } from '@/services/adminProductCategoryService'
import useAdminPermissions from '@/hooks/useAdminPermissions'

const ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function FieldStatus({ status, record, setProductCategories }) {
  const permissions = useAdminPermissions()
  const isActive = status === 'active'

  if (!permissions.includes('edit_product_category')) {
    return <Tag className={`admin-product-categories-status-tag ${isActive ? 'admin-product-categories-status-tag--active' : 'admin-product-categories-status-tag--inactive'}`}>{status}</Tag>
  }

  return (
    <Tag
      className={`admin-product-categories-status-tag ${
        isActive ? 'admin-product-categories-status-tag--active' : 'admin-product-categories-status-tag--inactive'
      } admin-product-categories-status-tag--clickable`}
      onClick={() => {
        Modal.confirm({
          title: 'Change Product Category Status',
          content: `Are you sure you want to change status of "${record.title}" from "${status}" to "${status === 'active' ? 'inactive' : 'active'}"?`,
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
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
