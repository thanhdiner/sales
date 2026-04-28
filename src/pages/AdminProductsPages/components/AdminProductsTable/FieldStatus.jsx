import { message, Modal, Tag } from 'antd'
import { toggleProductStatus } from '@/services/adminProductService'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { getLocalizedProductTitle } from '../../utils/productLocalization'
import { useTranslation } from 'react-i18next'

const ADMIN_PRODUCTS_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function FieldStatus({ status, record, setProducts }) {
  const { t, i18n } = useTranslation('adminProducts')
  const permission = useAdminPermissions()
  const language = i18n.resolvedLanguage || i18n.language
  const statusClassName = status === 'active' ? 'admin-products-status-tag admin-products-status-tag--active' : 'admin-products-status-tag admin-products-status-tag--inactive'
  const nextStatus = status === 'active' ? 'inactive' : 'active'
  const statusLabel = t(`status.${status}`)
  const nextStatusLabel = t(`status.${nextStatus}`)
  const productTitle = getLocalizedProductTitle(record, language, record.title || t('details.untitledProduct'))

  if (!permission.includes('edit_product')) {
    return <Tag className={statusClassName}>{statusLabel}</Tag>
  }

  return (
    <Tag
      className={`${statusClassName} admin-products-status-tag--clickable`}
      onClick={() => {
        Modal.confirm({
          className: 'admin-products-confirm-modal',
          maskStyle: ADMIN_PRODUCTS_CONFIRM_MASK_STYLE,
          title: <span>{t('table.changeStatusTitle')}</span>,
          content: (
            <span>
              {t('table.changeStatusContent', {
                title: productTitle,
                from: statusLabel,
                to: nextStatusLabel
              })}
            </span>
          ),
          okText: t('common.yes'),
          cancelText: t('common.no'),
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
              message.success(t('table.statusUpdated', { status: t(`status.${updated.status}`) }))
            } catch (err) {
              message.error(t('table.statusUpdateError'))
            }
          }
        })
      }}
    >
      {statusLabel}
    </Tag>
  )
}

export default FieldStatus
