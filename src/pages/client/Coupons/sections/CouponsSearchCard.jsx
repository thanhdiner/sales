import React from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const toolbarVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      delay: 0.08,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06
    }
  }
}

const toolbarPartVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' }
  }
}

const CouponsSearchCard = ({ searchText, onSearchChange, resultCount }) => {
  const { t } = useTranslation('clientCoupons')
  const resultSuffix = t(resultCount === 1 ? 'search.foundSuffixSingular' : 'search.foundSuffix', {
    defaultValue: t('search.foundSuffix')
  })

  return (
    <motion.section className="coupons-toolbar coupons-toolbar--search" initial="hidden" animate="visible" variants={toolbarVariants}>
      <motion.div className="coupon-search-input-wrap" variants={toolbarPartVariants}>
        <Input
          value={searchText}
          placeholder={t('search.placeholder')}
          allowClear
          prefix={<SearchOutlined />}
          onChange={event => onSearchChange(event.target.value)}
          className="coupon-search-input"
        />
      </motion.div>

      <motion.p className="coupons-toolbar__result" variants={toolbarPartVariants}>
        {t('search.foundPrefix')} <strong>{resultCount}</strong> {resultSuffix}
      </motion.p>
    </motion.section>
  )
}

export default CouponsSearchCard
