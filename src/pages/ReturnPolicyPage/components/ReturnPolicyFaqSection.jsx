import React from 'react'
import { Card, Collapse, Typography } from 'antd'

const { Title, Text } = Typography
const { Panel } = Collapse

const ReturnPolicyFaqSection = ({ content = {} }) => {
  return (
    <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <Title
          level={2}
          className="!mb-2 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          {content.title}
        </Title>

        <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {content.description}
        </p>
      </div>

      <Collapse
        bordered={false}
        expandIconPosition="end"
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        {(content.items || []).map((faq, index) => (
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
    </Card>
  )
}

export default ReturnPolicyFaqSection
