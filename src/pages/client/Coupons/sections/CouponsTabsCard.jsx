import { useTranslation } from 'react-i18next'
import SimpleSelect from '@/components/shared/SimpleSelect'
import { couponTabs } from '../constants'

const CouponsTabsCard = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('clientCoupons')
  const options = couponTabs.map(item => ({
    value: item.key,
    label: t(item.labelKey)
  }))

  return (
    <div className="coupons-search-card coupons-tabs-card mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <SimpleSelect
        label={t('tabs.all')}
        value={activeTab}
        onChange={onTabChange}
        options={options}
        buttonClassName="dark:border-slate-700 dark:bg-slate-950/70 dark:hover:border-slate-600"
      />
    </div>
  )
}

export default CouponsTabsCard
