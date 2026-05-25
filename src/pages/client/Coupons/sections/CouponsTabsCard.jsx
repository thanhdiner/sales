import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SimpleSelect from '@/components/shared/SimpleSelect'
import { couponTabs } from '../constants'

const tabsVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, delay: 0.14, ease: [0.22, 1, 0.36, 1] }
  }
}

const CouponsTabsCard = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('clientCoupons')
  const options = couponTabs.map(item => ({
    value: item.key,
    label: t(item.labelKey)
  }))

  return (
    <motion.section className="coupons-toolbar coupons-toolbar--tabs" initial="hidden" animate="visible" variants={tabsVariants}>
      <SimpleSelect
        label=""
        value={activeTab}
        onChange={onTabChange}
        options={options}
        className="coupons-filter-select"
        buttonClassName="coupons-filter-select__button"
      />
    </motion.section>
  )
}

export default CouponsTabsCard
