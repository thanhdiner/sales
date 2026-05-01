import React from 'react'
import { Button, Card, Divider, Space, Typography } from 'antd'
import { CheckOutlined, ClockCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatCouponCurrency, formatCouponNumber, getCouponCategoryIcon, getCouponDiscountColorClass } from '../utils'

const { Title, Text, Paragraph } = Typography

const CouponCard = ({ coupon, isCopied, remainingTime, onCopyCoupon, onUseCoupon }) => {
  const { t, i18n } = useTranslation('clientCoupons')
  const usageLimit = coupon.usageLimit
    ? formatCouponNumber(coupon.usageLimit, i18n.language)
    : t('card.usageUnlimited')

  return (
    <Card
      className="h-full rounded-xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-700"
      cover={
        <div className="bg-sky-500 p-4 text-center text-white">
          <div className="mb-2 text-4xl">{getCouponCategoryIcon(coupon.category)}</div>

          <div className={`text-3xl font-bold ${getCouponDiscountColorClass(coupon.discountType)}`}>
            {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : formatCouponCurrency(coupon.discountValue, i18n.language)}
          </div>

          {coupon.maxDiscount && (
            <div className="text-sm opacity-90">
              {t('card.maxDiscount', {
                amount: formatCouponCurrency(coupon.maxDiscount, i18n.language)
              })}
            </div>
          )}
        </div>
      }
    >
      <Title level={4} className="!mb-2 !text-gray-800">
        {coupon.title || t('card.fallbackTitle', { code: coupon.code })}
      </Title>

      <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
        {t(`tabs.${coupon.category || 'all'}`)}
      </div>

      <Paragraph className="text-sm text-gray-600">{coupon.description || t('card.fallbackDescription')}</Paragraph>

      <div className="mb-3 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-3 dark:bg-gray-700">
        <div className="flex items-center justify-between dark:bg-gray-700">
          <div>
            <Text type="secondary" className="text-xs">
              {t('card.codeLabel')}
            </Text>
            <br />
            <Text strong className="font-mono text-lg tracking-wider text-blue-600">
              {coupon.code}
            </Text>
          </div>

          <Button
            size="small"
            type="primary"
            icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={() => onCopyCoupon(coupon.code)}
            className={isCopied ? 'border-green-500 bg-green-500' : ''}
          >
            {isCopied ? t('card.copied') : t('card.copy')}
          </Button>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t('card.minOrder', {
            amount: formatCouponCurrency(coupon.minOrder, i18n.language)
          })}
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('card.usage', {
            used: formatCouponNumber(coupon.usedCount, i18n.language),
            limit: usageLimit
          })}
        </div>
      </div>

      {remainingTime && (
        <div className="mb-3 rounded-lg bg-orange-50 p-2 dark:bg-gray-800">
          <Space className="w-full justify-center">
            <ClockCircleOutlined className="text-orange-500" />
            <Text className="text-sm text-orange-600">
              {t('card.remainingTime', {
                days: remainingTime.days,
                hours: remainingTime.hours,
                minutes: remainingTime.minutes
              })}
            </Text>
          </Space>
        </div>
      )}

      <Divider className="!my-3" />

      <div className="mt-2">
        <Button type="primary" block onClick={() => onUseCoupon(coupon.code)}>
          {t('card.useNow')}
        </Button>
      </div>
    </Card>
  )
}

export default CouponCard
