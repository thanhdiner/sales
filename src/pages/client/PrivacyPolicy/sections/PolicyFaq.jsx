import React from 'react'
import { Collapse, Typography } from 'antd'
import PolicyCard from '../components/PolicyCard'

const { Panel } = Collapse
const { Text } = Typography

const PolicyFaq = ({ section = {} }) => {
  const items = Array.isArray(section.items) ? section.items : []

  return (
    <PolicyCard title={section.title}>
      <Collapse
        bordered={false}
        expandIconPosition="end"
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        {items.map((faq, index) => (
          <Panel
            key={`${faq.question}_${index}`}
            header={<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{faq.question}</span>}
            className="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
          >
            <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{faq.answer}</Text>
          </Panel>
        ))}
      </Collapse>
    </PolicyCard>
  )
}

export default PolicyFaq
