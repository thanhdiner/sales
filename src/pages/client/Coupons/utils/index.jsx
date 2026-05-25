import React from 'react'
import {
  CrownOutlined,
  FireOutlined,
  GiftOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'

export const getCouponCategoryIcon = category => {
  switch (category) {
    case 'all':
      return <GiftOutlined className="text-pink-500" />
    case 'new':
      return <StarOutlined className="text-yellow-500" />
    case 'flash':
      return <ThunderboltOutlined className="text-red-500" />
    case 'shipping':
      return <ShoppingCartOutlined className="text-blue-500" />
    case 'vip':
      return <CrownOutlined className="text-purple-500" />
    case 'weekend':
      return <FireOutlined className="text-orange-500" />
    case 'student':
      return <GiftOutlined className="text-green-500" />
    default:
      return <PercentageOutlined />
  }
}

export const getCouponDiscountColorClass = type => {
  switch (type) {
    case 'percent':
      return 'text-red-500'
    case 'amount':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

export const getCouponLocale = language => {
  return language?.startsWith('en') ? 'en-US' : 'vi-VN'
}

export const formatCouponCurrency = (value, language = 'vi') => {
  return Number(value || 0).toLocaleString(getCouponLocale(language), {
    style: 'currency',
    currency: 'VND'
  })
}

export const formatCouponNumber = (value, language = 'vi') => {
  return Number(value || 0).toLocaleString(getCouponLocale(language))
}
