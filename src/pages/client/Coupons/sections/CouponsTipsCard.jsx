import React from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, ClipboardList, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import { couponTips } from '../constants'

const tipIcons = [ClipboardList, CalendarDays, Layers]

const tipsVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08
    }
  }
}

const tipPartVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: 'easeOut' }
  }
}

const CouponsTipsCard = () => {
  const { t } = useTranslation('clientCoupons')

  return (
    <motion.section
      className="coupons-tips"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={tipsVariants}
    >
      <motion.header className="coupons-tips__header" variants={tipPartVariants}>
        <h2>{t('tipsSection.title')}</h2>
        <p>{t('tipsSection.description')}</p>
      </motion.header>

      <div className="coupons-tips__grid">
        {couponTips.map((tip, index) => {
          const TipIcon = tipIcons[index]

          return (
            <motion.article className="coupons-tips__item" key={tip.titleKey} variants={tipPartVariants}>
              <span className="coupons-tips__number">{index + 1}</span>
              <span className="coupons-tips__icon" aria-hidden="true">
                <TipIcon size={28} strokeWidth={2.2} />
              </span>
              <div className="coupons-tips__content">
                <h3>{t(tip.titleKey)}</h3>
                <p>{t(tip.descriptionKey)}</p>
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  )
}

export default CouponsTipsCard
