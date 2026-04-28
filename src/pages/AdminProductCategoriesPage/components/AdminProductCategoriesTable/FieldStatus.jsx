import { message, Modal, Tag } from 'antd'
import { toggleProductCategoryStatus } from '@/services/adminProductCategoryService'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { getLocalizedProductCategoryTitle } from '../../utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'

const ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function FieldStatus({ status, record, setProductCategories }) {
  const { t, i18n } = useTranslation('adminProductCategories')
  const permissions = useAdminPermissions()
  const language = i18n.resolvedLanguage || i18n.language
  const categoryTitle = getLocalizedProductCategoryTitle(record, language, record.title || '')
  const isActive = status === 'active'
  const currentStatusLabel = t(`status.${status}`, { defaultValue: status })
  const nextStatus = status === 'active' ? 'inactive' : 'active'
  const nextStatusLabel = t(`status.${nextStatus}`)

  const tagClassName = `admin-product-categories-status-tag ${
    isActive ? 'admin-product-categories-status-tag--active' : 'admin-product-categories-status-tag--inactive'
  }`

  if (!permissions.includes('edit_product_category')) {
    return <Tag className={tagClassName}>{currentStatusLabel}</Tag>
  }

  return (
    <Tag
      className={`${tagClassName} admin-product-categories-status-tag--clickable`}
      onClick={() => {
        Modal.confirm({
          title: t('table.changeStatusTitle'),
          content: t('table.changeStatusContent', {
            title: categoryTitle,
            from: currentStatusLabel,
            to: nextStatusLabel
          }),
          className: 'admin-product-categories-confirm-modal',
          maskStyle: ADMIN_PRODUCT_CATEGORIES_CONFIRM_MASK_STYLE,
          okText: t('common.yes'),
          cancelText: t('common.no'),
          onOk: async () => {
            try {
              const updated = await toggleProductCategoryStatus(record._id, status)
              const updatedStatusLabel = t(`status.${updated.status}`, { defaultValue: updated.status })
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
              message.success(t('table.statusUpdated', { status: updatedStatusLabel }))
            } catch (err) {
              message.error(t('table.statusUpdateError'))
            }
          }
        })
      }}
    >
      {currentStatusLabel}
    </Tag>
  )
}

export default FieldStatus
