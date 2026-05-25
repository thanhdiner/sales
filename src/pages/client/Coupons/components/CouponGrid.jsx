import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CouponCard from './CouponCard'
import CouponsEmptyState from './CouponsEmptyState'
import CouponsLoadingState from './CouponsLoadingState'

const gridVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.18, ease: 'easeOut' }
  }
}

const CouponGrid = ({ coupons, copiedCoupons, loading, timeLeft, onCopyCoupon, onUseCoupon }) => {
  if (loading) {
    return <CouponsLoadingState />
  }

  if (coupons.length === 0) {
    return <CouponsEmptyState />
  }

  return (
    <motion.div className="coupon-list" initial="hidden" animate="visible" variants={gridVariants}>
      <AnimatePresence initial={false}>
        {coupons.map(coupon => (
          <motion.div key={coupon._id} layout variants={itemVariants} exit="exit">
            <CouponCard
              coupon={coupon}
              isCopied={copiedCoupons.has(coupon.code)}
              remainingTime={timeLeft[coupon._id]}
              onCopyCoupon={onCopyCoupon}
              onUseCoupon={onUseCoupon}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default CouponGrid
