import React from 'react'
import { Collapse, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'
import { privacyPolicyFaqData } from '../data'

const { Panel } = Collapse
const { Text } = Typography

const PolicyFaqSection = () => {
  return (
    <PolicySectionCard title="Câu hỏi thường gặp">
      <Collapse
        bordered={false}
        expandIconPosition="end"
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        {privacyPolicyFaqData.map((faq, index) => (
          <Panel
            key={index}
            header={
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {faq.question}
              </span>
            }
            className="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
          >
            <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {faq.answer}
            </Text>
          </Panel>
        ))}
      </Collapse>
    </PolicySectionCard>
  )
}

export default PolicyFaqSection