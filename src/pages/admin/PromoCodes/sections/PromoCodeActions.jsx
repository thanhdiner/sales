import { Button, Dropdown, Modal, Tooltip } from 'antd'
import { CopyPlus, Edit3, MoreHorizontal, Power, RotateCcw, Trash2, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getPromoCodeStatusKey } from '../utils/promoCodeHelpers'

const textButtonClass =
  '!text-[var(--admin-text-muted)] hover:!bg-[var(--admin-surface-2)] hover:!text-[var(--admin-text)]'

export default function PromoCodeActions({
  promoCode,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onShowUsage,
  onExtendExpiry,
  onDelete
}) {
  const { t } = useTranslation('adminPromoCodes')
  const statusKey = getPromoCodeStatusKey(promoCode)
  const isExpired = statusKey === 'expired'
  const isDisabled = statusKey === 'disabled'

  const confirmDelete = () => {
    Modal.confirm({
      title: t('table.deleteConfirmTitle'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      centered: true,
      className: 'admin-promo-mobile-confirm',
      onOk: () => onDelete(promoCode._id)
    })
  }

  const items = [
    {
      key: 'usage',
      icon: <UsersRound className="h-4 w-4" />,
      label: t('table.actions.viewUsageHistory')
    },
    isExpired
      ? {
          key: 'extend',
          icon: <RotateCcw className="h-4 w-4" />,
          label: t('table.actions.extendExpiry')
        }
      : {
          key: 'toggle',
          icon: <Power className="h-4 w-4" />,
          label: isDisabled ? t('table.actions.enableCode') : t('table.actions.disableCode')
        },
    { type: 'divider' },
    {
      key: 'delete',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      label: t('table.actions.deleteCode')
    }
  ]

  const handleMenuClick = ({ key }) => {
    if (key === 'usage') onShowUsage(promoCode)
    if (key === 'extend') onExtendExpiry(promoCode)
    if (key === 'toggle') onToggleStatus(promoCode)
    if (key === 'delete') confirmDelete()
  }

  return (
    <div className="flex items-center gap-1">
      <Tooltip title={t('table.actions.edit')}>
        <Button
          type="text"
          icon={<Edit3 className="h-4 w-4" />}
          onClick={() => onEdit(promoCode)}
          className={textButtonClass}
        />
      </Tooltip>

      <Tooltip title={t('table.actions.duplicate')}>
        <Button
          type="text"
          icon={<CopyPlus className="h-4 w-4" />}
          onClick={() => onDuplicate(promoCode)}
          className={textButtonClass}
        />
      </Tooltip>

      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="admin-promo-mobile-dropdown"
      >
        <Button
          type="text"
          icon={<MoreHorizontal className="h-4 w-4" />}
          className={textButtonClass}
        />
      </Dropdown>
    </div>
  )
}
