import React from 'react'
import { Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'
import { privacyPolicyUsageTimeline } from '../data'

const { Text } = Typography

const InformationUsageSection = () => {
  return (
    <PolicySectionCard
      id="su-dung-thong-tin"
      title="2. Sử dụng thông tin"
    >
      <div className="space-y-3">
        {privacyPolicyUsageTimeline.map(item => (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <Text className="block !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
              {item.title}
            </Text>

            <Text className="mt-2 block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {item.description}
            </Text>
          </div>
        ))}
      </div>
    </PolicySectionCard>
  )
}

export default InformationUsageSection