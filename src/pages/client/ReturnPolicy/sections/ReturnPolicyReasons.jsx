import React from 'react'
import { Card, Col, Row, Typography } from 'antd'

const { Title, Paragraph } = Typography

const ReturnPolicyReasons = ({ content = {}, onOpenRequestModal }) => {
  return (
    <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <Title
          level={2}
          className="!mb-2 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          {content.title}
        </Title>

        <Paragraph className="!mb-0 !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
          {content.description}
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {(content.items || []).map(reason => (
          <Col xs={24} sm={12} lg={8} key={reason.value}>
            <button
              type="button"
              onClick={onOpenRequestModal}
              className="h-full w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {reason.label}
              </h3>

              <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {content.cardDescription}
              </p>
            </button>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default ReturnPolicyReasons
