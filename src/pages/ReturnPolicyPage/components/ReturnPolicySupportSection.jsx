import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { returnPolicySupportContact, returnPolicySupportTips } from '../data'

const { Text } = Typography

const ReturnPolicySupportSection = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Mẹo đổi trả thành công
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-3">
            {returnPolicySupportTips.map((tip, index) => (
              <div
                key={tip}
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
              Hỗ trợ khách hàng
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Hotline đổi trả
              </p>
              <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {returnPolicySupportContact.phone}
              </Text>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Email hỗ trợ
              </p>
              <Text className="block break-all !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {returnPolicySupportContact.email}
              </Text>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Thời gian hỗ trợ
              </p>
              <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {returnPolicySupportContact.hours}
              </Text>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ReturnPolicySupportSection