import React from 'react'
import { Col, Row } from 'antd'
import CouponCard from './CouponCard'
import CouponsEmptyState from './CouponsEmptyState'

const CouponGrid = ({ coupons, copiedCoupons, timeLeft, onCopyCoupon, onUseCoupon }) => {
  if (coupons.length === 0) {
    return <CouponsEmptyState />
  }

  return (
    <Row gutter={[16, 16]} className="items-stretch">
      {coupons.map(coupon => (
        <Col xs={24} sm={12} lg={8} key={coupon._id} className="flex">
          <CouponCard
            coupon={coupon}
            isCopied={copiedCoupons.has(coupon.code)}
            remainingTime={timeLeft[coupon._id]}
            onCopyCoupon={onCopyCoupon}
            onUseCoupon={onUseCoupon}
          />
        </Col>
      ))}
    </Row>
  )
}

export default CouponGrid