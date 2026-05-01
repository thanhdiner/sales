import React from 'react'
import { Card, Col, Row, Typography } from 'antd'

const { Title, Text } = Typography

const ReturnPolicyConditions = ({ conditions = {}, refund = {} }) => {
  return (
    <Row gutter={[16, 16]} className="mb-8">
      <Col xs={24} lg={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {conditions.title}
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <Title
                level={5}
                className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                {conditions.acceptedTitle}
              </Title>

              <div>
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  {conditions.physicalTitle}
                </Text>

                <ul className="space-y-2">
                  {(conditions.acceptedPhysicalItems || []).map(item => (
                    <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  {conditions.digitalTitle}
                </Text>

                <ul className="space-y-2">
                  {(conditions.acceptedDigitalItems || []).map(item => (
                    <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
              <Title
                level={5}
                className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                {conditions.rejectedTitle}
              </Title>

              <div>
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  {conditions.physicalTitle}
                </Text>

                <ul className="space-y-2">
                  {(conditions.rejectedPhysicalItems || []).map(item => (
                    <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  {conditions.digitalTitle}
                </Text>

                <ul className="space-y-2">
                  {(conditions.rejectedDigitalItems || []).map(item => (
                    <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {refund.title}
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-3">
            {(refund.methods || []).map(method => (
              <div
                key={method.key}
                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Text className="!text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                    {method.method}
                  </Text>

                  {method.popular && (
                    <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
                      {refund.popular}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {refund.timeLabel}: {method.time}
                  </p>
                  <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {refund.feeLabel}: {method.fee}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ReturnPolicyConditions
