import React from 'react'
import { Card, Tabs } from 'antd'
import { couponTabs } from '../constants'

const CouponsTabsCard = ({ activeTab, onTabChange }) => {
  return (
    <Card className="coupons-card mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        size="large"
        items={couponTabs.map(item => ({
          ...item,
          label: (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          ),
        }))}
      />
    </Card>
  )
}

export default CouponsTabsCard