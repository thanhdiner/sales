import { Button, Modal } from 'antd'
import { Copy, CopyPlus, Edit3, Power, RotateCcw, Trash2, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  formatPromoCodeDate,
  formatPromoCodeDateTime,
  getConditionItems,
  getDiscountText,
  getDiscountTypeLabel,
  getPromoCodeAudienceText,
  getPromoCodeStatusKey,
  getPromoCodeUsedByCount,
  getUsageText
} from '../utils/promoCodeHelpers'
import {
  getLocalizedPromoCodeDescription,
  getLocalizedPromoCodeTitle
} from '@/utils/promoCodeLocalization'
import PromoCodeStatusBadge from './PromoCodeStatusBadge'

const secondaryButtonClass =
  'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'
const dangerButtonClass =
  'rounded-lg !border-red-200 !bg-red-50 !text-red-600 hover:!border-red-300 hover:!bg-red-100 dark:!border-red-900/50 dark:!bg-red-950/30 dark:!text-red-300'

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3 text-sm">
      <span className="text-[var(--admin-text-subtle)]">{label}</span>
      <span className="min-w-0 text-[var(--admin-text)]">{children}</span>
    </div>
  )
}

export default function PromoCodeMobileCard({
  promoCode,
  language,
  onCopy,
  onShowDetail,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onExtendExpiry,
  onDelete
}) {
  const { t } = useTranslation('adminPromoCodes')
  const statusKey = getPromoCodeStatusKey(promoCode)
  const isExpired = statusKey === 'expired'
  const isDisabled = statusKey === 'disabled'
  const campaignTitle = getLocalizedPromoCodeTitle(
    promoCode,
    language,
    t('table.fallbackCampaignTitle', { code: promoCode.code })
  )
  const campaignDescription = getLocalizedPromoCodeDescription(promoCode, language, '')
  const conditions = getConditionItems(promoCode, language, t)

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

  return (
    <article className="admin-promo-mobile-card rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1">
            <h3 className="truncate font-mono text-lg font-bold text-[var(--admin-accent)]">{promoCode.code}</h3>
            <Button
              type="text"
              size="small"
              icon={<Copy className="h-3.5 w-3.5" />}
              onClick={() => onCopy(promoCode.code)}
              className="admin-promo-mobile-card__copy"
            />
          </div>
          <p className="mt-1 text-sm font-medium text-[var(--admin-text)]">{campaignTitle}</p>
        </div>

        <PromoCodeStatusBadge promoCode={promoCode} />
      </div>

      {campaignDescription ? (
        <p className="mt-3 text-sm leading-6 text-[var(--admin-text-muted)]">{campaignDescription}</p>
      ) : null}

      <div className="mt-4 space-y-2">
        <DetailRow label={t('table.mobile.discount')}>
          {getDiscountText(promoCode, language, t)}
        </DetailRow>
        <DetailRow label={t('table.mobile.type')}>
          {getDiscountTypeLabel(promoCode.discountType, t)}
        </DetailRow>
        <DetailRow label={t('table.mobile.conditions')}>
          {conditions.length ? (
            <span className="block space-y-1">
              {conditions.map(condition => (
                <span className="block" key={condition}>{condition}</span>
              ))}
            </span>
          ) : (
            t('table.noConditions')
          )}
        </DetailRow>
        <DetailRow label={t('table.mobile.usage')}>
          {getUsageText(promoCode, language, t)}
        </DetailRow>
        <DetailRow label={t('table.mobile.audience')}>
          <span className="block">
            {getPromoCodeAudienceText(promoCode, t)}
            <span className="mt-1 block text-xs text-[var(--admin-text-muted)]">
              {t('table.usedByCount', { count: getPromoCodeUsedByCount(promoCode, language) })}
            </span>
          </span>
        </DetailRow>
        <DetailRow label={t('table.mobile.expires')}>
          {promoCode.expiresAt ? formatPromoCodeDate(promoCode.expiresAt, language) : t('common.noLimit')}
        </DetailRow>
        <DetailRow label={t('table.mobile.created')}>
          {promoCode.createdAt ? formatPromoCodeDateTime(promoCode.createdAt, language) : t('common.noLimit')}
        </DetailRow>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--admin-border)] pt-4">
        <Button
          size="small"
          icon={<Edit3 className="h-3.5 w-3.5" />}
          onClick={() => onEdit(promoCode)}
          className={secondaryButtonClass}
        >
          {t('table.actions.edit')}
        </Button>
        <Button
          size="small"
          icon={<CopyPlus className="h-3.5 w-3.5" />}
          onClick={() => onDuplicate(promoCode)}
          className={secondaryButtonClass}
        >
          {t('table.actions.duplicate')}
        </Button>
        <Button
          size="small"
          icon={isExpired ? <RotateCcw className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
          onClick={() => (isExpired ? onExtendExpiry(promoCode) : onToggleStatus(promoCode))}
          className={secondaryButtonClass}
        >
          {isExpired
            ? t('table.actions.extendExpiry')
            : isDisabled
              ? t('table.actions.enable')
              : t('table.actions.disable')}
        </Button>
        <Button
          size="small"
          icon={<UsersRound className="h-3.5 w-3.5" />}
          onClick={() => onShowDetail(promoCode)}
          className={secondaryButtonClass}
        >
          {t('table.actions.viewUsageHistory')}
        </Button>
        <Button
          size="small"
          icon={<Trash2 className="h-3.5 w-3.5" />}
          onClick={confirmDelete}
          className={dangerButtonClass}
        >
          {t('common.delete')}
        </Button>
      </div>
    </article>
  )
}
