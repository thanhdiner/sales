import React from 'react'
import { Typography } from 'antd'
import PolicyCard from '../components/PolicyCard'

const { Text } = Typography

const InformationUsage = ({ section = {} }) => {
  const items = Array.isArray(section.items) ? section.items : []

  return (
    <PolicyCard id="su-dung-thong-tin" title={section.title}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.title}_${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <Text className="block !text-base !font-semibold !text-gray-900 dark:!text-gray-100">{item.title}</Text>

            <Text className="mt-2 block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{item.description}</Text>
          </div>
        ))}
      </div>
    </PolicyCard>
  )
}

export default InformationUsage
