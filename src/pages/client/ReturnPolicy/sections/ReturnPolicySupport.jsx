import React from 'react'
import { Card, Col, Row, Typography } from 'antd'

const { Text } = Typography

const ReturnPolicySupport = ({ content = {} }) => {
  const contact = content.contact || {}

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {content.tipsTitle}
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-3">
            {(content.tips || []).map((tip, index) => (
              <div
                key={`${tip}-${index}`}
                className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  {index + 1}
                </span>

                <Text className="!text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                  {tip}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {content.supportTitle}
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {content.hotlineLabel}
              </p>
              <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {contact.phone}
              </Text>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {content.emailLabel}
              </p>
              <Text className="block break-all !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {contact.email}
              </Text>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {content.hoursLabel}
              </p>
              <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {contact.hours}
              </Text>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ReturnPolicySupport
