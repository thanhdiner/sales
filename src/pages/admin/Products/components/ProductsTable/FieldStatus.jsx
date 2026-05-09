import { message, Modal } from 'antd'
import { AdminStatusTag } from '@/components/admin/ui'
import { toggleProductStatus } from '@/services/admin/commerce/product'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { getLocalizedProductTitle } from '../../utils/productLocalization'
import { useTranslation } from 'react-i18next'

const PRODUCTS_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

function FieldStatus({ status, record, setProducts }) {
  const { t, i18n } = useTranslation('adminProducts')
  const permission = useAdminPermissions()
  const language = i18n.resolvedLanguage || i18n.language
  const statusTone = status === 'active' ? 'active' : 'inactive'
  const nextStatus = status === 'active' ? 'inactive' : 'active'
  const statusLabel = t(`status.${status}`)
  const nextStatusLabel = t(`status.${nextStatus}`)
  const productTitle = getLocalizedProductTitle(record, language, record.title || t('details.untitledProduct'))

  if (!permission.includes('edit_product')) {
    return <AdminStatusTag tone={statusTone}>{statusLabel}</AdminStatusTag>
  }

  return (
    <AdminStatusTag
      tone={statusTone}
      className="admin-status-tag--clickable"
      onClick={() => {
        Modal.confirm({
          className: 'admin-products-confirm-modal',
          maskStyle: PRODUCTS_CONFIRM_MASK_STYLE,
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
    </AdminStatusTag>
  )
}

export default FieldStatus
