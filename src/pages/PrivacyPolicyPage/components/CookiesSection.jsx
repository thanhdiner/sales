import React from 'react'
import { Button, Collapse, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'

const { Panel } = Collapse
const { Paragraph, Text } = Typography

const CookiesSection = ({ section = {} }) => {
  const categories = Array.isArray(section.categories) ? section.categories : []

  return (
    <PolicySectionCard id="cookies" title={section.title}>
      <Paragraph className="!mb-5 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">{section.description}</Paragraph>

      <Collapse
        bordered={false}
        expandIconPosition="end"
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        {categories.map((category, index) => (
          <Panel
            key={category.key || index}
            header={<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{category.title}</span>}
            className="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
          >
            <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{category.description}</Text>
          </Panel>
        ))}
      </Collapse>

      <Button
        block
        className="mt-5 h-auto rounded-lg border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {section.manageButton}
      </Button>
    </PolicySectionCard>
  )
}

export default CookiesSection
