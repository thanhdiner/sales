import { Modal, Tag } from 'antd'
import {
  formatCurrency,
  formatPromoCodeDateTime,
  getDiscountText,
  getDiscountTypeLabel,
  getPromoCodeMaxDiscount,
  getPromoCodeMinimumOrder,
  getPromoCodeAudienceText,
  getPromoCodeStatusMeta,
  getPromoCodeUsedByCount,
  getUsageText
} from '../utils/promoCodeHelpers'
import {
  getLocalizedPromoCodeDescription,
  getLocalizedPromoCodeTitle
} from '@/utils/promoCodeLocalization'

export default function PromoCodeDetailModal({ open, selectedCode, language, t, onCancel }) {
  const statusMeta = selectedCode ? getPromoCodeStatusMeta(selectedCode, t) : null
  const campaignTitle = selectedCode
    ? getLocalizedPromoCodeTitle(selectedCode, language, t('detail.fallbackTitle', { code: selectedCode.code }))
    : ''
  const campaignDescription = selectedCode ? getLocalizedPromoCodeDescription(selectedCode, language, '') : ''
  const usedByUsers = Array.isArray(selectedCode?.usedBy) ? selectedCode.usedBy : []
  const minOrder = selectedCode ? getPromoCodeMinimumOrder(selectedCode) : 0
  const maxDiscount = selectedCode ? getPromoCodeMaxDiscount(selectedCode) : null

  return (
    <Modal
      title={<span className="text-[var(--admin-text)]">{t('detail.title')}</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      className="admin-promo-detail-modal"
    >
      {selectedCode && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
            <div className="text-center">
              <h3 className="font-mono text-xl font-bold text-[var(--admin-accent)]">{selectedCode.code}</h3>
              <h4 className="mt-2 text-lg font-semibold text-[var(--admin-text)]">{campaignTitle}</h4>
              <p className="mt-1 text-[var(--admin-text-muted)]">
                {getDiscountText(selectedCode, language, t)}
              </p>
              {campaignDescription ? (
                <p className="mt-2 text-sm leading-6 text-[var(--admin-text-muted)]">{campaignDescription}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.category')}</label>
              <p className="text-[var(--admin-text)]">{t(`categories.${selectedCode.category || 'all'}`)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.discountType')}</label>
              <p className="text-[var(--admin-text)]">{getDiscountTypeLabel(selectedCode.discountType, t)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.minOrder')}</label>
              <p className="text-[var(--admin-text)]">{formatCurrency(minOrder, language)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.maxDiscount')}</label>
              <p className="text-[var(--admin-text)]">
                {maxDiscount ? formatCurrency(maxDiscount, language) : t('common.noLimit')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.used')}</label>
              <p className="text-[var(--admin-text)]">
                {getUsageText(selectedCode, language, t)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.usedBy')}</label>
              <p className="text-[var(--admin-text)]">{getPromoCodeUsedByCount(selectedCode, language)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.expiresAt')}</label>
              <p className="text-[var(--admin-text)]">
                {selectedCode.expiresAt ? formatPromoCodeDateTime(selectedCode.expiresAt, language) : t('common.noLimit')}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.status')}</label>
            <div className="mt-1">{statusMeta && <Tag color={statusMeta.color}>{statusMeta.label}</Tag>}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.audience')}</label>
            <p className="text-[var(--admin-text)]">{getPromoCodeAudienceText(selectedCode, t)}</p>
          </div>

          {usedByUsers.length ? (
            <div>
              <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.usedByList')}</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {usedByUsers.slice(0, 6).map(user => (
                  <Tag key={user?._id || user} color="blue">
                    {getPromoCodeAudienceText({ userId: user }, t)}
                  </Tag>
                ))}
                {usedByUsers.length > 6 ? <Tag>+{usedByUsers.length - 6}</Tag> : null}
              </div>
            </div>
          ) : null}

          <div>
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">{t('detail.createdAt')}</label>
            <p className="text-[var(--admin-text)]">
              {selectedCode.createdAt ? formatPromoCodeDateTime(selectedCode.createdAt, language) : t('common.noLimit')}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
