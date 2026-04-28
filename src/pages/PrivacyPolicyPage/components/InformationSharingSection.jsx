import React from 'react'
import { Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'

const { Title, Paragraph } = Typography

const InformationSharingSection = ({ section = {} }) => {
  const allowedItems = Array.isArray(section.allowed) ? section.allowed : []
  const disallowedItems = Array.isArray(section.disallowed) ? section.disallowed : []

  return (
    <PolicySectionCard id="chia-se-thong-tin" title={section.title}>
      <Paragraph className="!mb-5 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        {section.description}
      </Paragraph>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Title level={5} className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
            {section.allowedTitle}
          </Title>

          <ul className="space-y-2">
            {allowedItems.map(item => (
              <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Title level={5} className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
            {section.disallowedTitle}
          </Title>

          <ul className="space-y-2">
            {disallowedItems.map(item => (
              <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PolicySectionCard>
  )
}

export default InformationSharingSection
