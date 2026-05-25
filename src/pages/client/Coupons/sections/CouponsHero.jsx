import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const heroVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07
    }
  }
}

const heroPartVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: 'easeOut' }
  }
}

const CouponsHero = () => {
  const { t } = useTranslation('clientCoupons')

  return (
    <motion.header className="coupons-hero" initial="hidden" animate="visible" variants={heroVariants}>
      <motion.p className="coupons-hero__eyebrow" variants={heroPartVariants}>{t('hero.eyebrow')}</motion.p>

      <motion.h1 className="coupons-hero__title" variants={heroPartVariants}>
        {t('hero.title')}
      </motion.h1>

      <motion.p className="coupons-hero__description" variants={heroPartVariants}>
        {t('hero.description')}
      </motion.p>
    </motion.header>
  )
}

export default CouponsHero
