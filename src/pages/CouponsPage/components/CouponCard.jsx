import React from 'react'
import { Button, Card, Divider, Space, Typography } from 'antd'
import { CheckOutlined, ClockCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { formatCouponCurrency, getCouponCategoryIcon, getCouponDiscountColorClass } from '../utils'

const { Title, Text, Paragraph } = Typography

const CouponCard = ({ coupon, isCopied, remainingTime, onCopyCoupon, onUseCoupon }) => {
  return (
    <Card
      className="h-full rounded-xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-700"
      cover={
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-center text-white">
          <div className="mb-2 text-4xl">{getCouponCategoryIcon(coupon.category)}</div>
          <div className={`text-3xl font-bold ${getCouponDiscountColorClass(coupon.discountType)}`}>
            {coupon.discountType === 'percent'
              ? `${coupon.discountValue}%`
              : formatCouponCurrency(coupon.discountValue)}
          </div>
          {coupon.maxDiscount && (
            <div className="text-sm opacity-90">Giảm tối đa {formatCouponCurrency(coupon.maxDiscount)}</div>
          )}
        </div>
      }
    >
      <Title level={4} className="!mb-2 !text-gray-800">
        {coupon.title || `Mã: ${coupon.code}`}
      </Title>
      <Paragraph className="text-sm text-gray-600">
        {coupon.description || 'Áp dụng theo điều kiện hệ thống'}
      </Paragraph>

      <div className="mb-3 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-3 dark:bg-gray-700">
        <div className="flex items-center justify-between dark:bg-gray-700">
          <div>
            <Text type="secondary" className="text-xs">
              Mã giảm giá:
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
            {isCopied ? 'Đã copy' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Đơn tối thiểu: {formatCouponCurrency(coupon.minOrder)}
        </div>
      </div>

      {remainingTime && (
        <div className="mb-3 rounded-lg bg-orange-50 p-2 dark:bg-gray-800">
          <Space className="w-full justify-center">
            <ClockCircleOutlined className="text-orange-500" />
            <Text className="text-sm text-orange-600">
              Còn {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m
            </Text>
          </Space>
        </div>
      )}

      <Divider className="!my-3" />

      <div className="mt-2">
        <Button type="primary" block onClick={() => onUseCoupon(coupon.code)}>
          Dùng ngay
        </Button>
      </div>
    </Card>
  )
}

export default CouponCard
