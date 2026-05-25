import React from 'react'
import { Button } from 'antd'
import { CheckOutlined, ClockCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatCouponCurrency, formatCouponNumber, getCouponCategoryIcon } from '../utils'

const CouponCard = ({ coupon, isCopied, remainingTime, onCopyCoupon, onUseCoupon }) => {
  const { t, i18n } = useTranslation('clientCoupons')
  const usageLimit = coupon.usageLimit
    ? formatCouponNumber(coupon.usageLimit, i18n.language)
    : t('card.usageUnlimited')

  return (
    <article className="coupon-ticket">
      <section className="coupon-ticket__discount" aria-label={coupon.title || t('card.fallbackTitle', { code: coupon.code })}>
        <span className="coupon-ticket__spark coupon-ticket__spark--one" />
        <span className="coupon-ticket__spark coupon-ticket__spark--two" />
        <div className="coupon-ticket__icon">{getCouponCategoryIcon(coupon.category)}</div>
        <strong className="coupon-ticket__value">
          {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : formatCouponCurrency(coupon.discountValue, i18n.language)}
        </strong>
        {coupon.maxDiscount && (
          <span className="coupon-ticket__max">
            {t('card.maxDiscount', {
              amount: formatCouponCurrency(coupon.maxDiscount, i18n.language)
            })}
          </span>
        )}
      </section>

      <section className="coupon-ticket__body">
        <div className="coupon-ticket__main">
          <div className="coupon-ticket__title-row">
            <span className="coupon-ticket__label">{t('card.codeLabel')}</span>
            <strong className="coupon-ticket__title">{coupon.code}</strong>
            <span className="coupon-ticket__category">{t(`tabs.${coupon.category || 'all'}`)}</span>
          </div>

          <p className="coupon-ticket__description">{coupon.description || t('card.fallbackDescription')}</p>

          <div className="coupon-ticket__code-box">
            <span>{t('card.codeLabel')}</span>
            <strong>{coupon.code}</strong>
            <Button
              size="small"
              type="primary"
              icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={() => onCopyCoupon(coupon.code)}
              className={`coupon-ticket__copy ${isCopied ? 'coupon-ticket__copy--copied' : ''}`}
            >
              {isCopied ? t('card.copied') : t('card.copy')}
            </Button>
          </div>
        </div>

        <div className="coupon-ticket__meta">
          <span>
            {t('card.minOrder', {
              amount: formatCouponCurrency(coupon.minOrder, i18n.language)
            })}
          </span>
          <span>
            {t('card.usage', {
              used: formatCouponNumber(coupon.usedCount, i18n.language),
              limit: usageLimit
            })}
          </span>
        </div>

        <div className="coupon-ticket__actions">
          {remainingTime && (
            <span className="coupon-ticket__time">
              <ClockCircleOutlined />
              {t('card.remainingTime', {
                days: remainingTime.days,
                hours: remainingTime.hours,
                minutes: remainingTime.minutes
              })}
            </span>
          )}
          <Button type="primary" onClick={() => onUseCoupon(coupon.code)} className="coupon-ticket__use">
            {t('card.useNow')}
          </Button>
        </div>
      </section>
    </article>
  )
}

export default CouponCard
