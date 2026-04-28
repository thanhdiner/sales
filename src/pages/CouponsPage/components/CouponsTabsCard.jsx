import React from 'react'
import { Card, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { couponTabs } from '../constants'

const CouponsTabsCard = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('clientCoupons')

  return (
    <Card className="coupons-card coupons-tabs-card mb-6 rounded-xl border border-gray-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        size="large"
        tabBarStyle={{ marginBottom: 0 }}
        items={couponTabs.map(item => ({
          key: item.key,
          label: <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t(item.labelKey)}</span>
        }))}
      />
    </Card>
  )
}

export default CouponsTabsCard
