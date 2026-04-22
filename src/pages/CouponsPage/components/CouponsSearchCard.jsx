import React from 'react'
import { Card, Col, Input, Row, Typography } from 'antd'

const { Text } = Typography

const CouponsSearchCard = ({ searchText, onSearchChange, resultCount }) => {
  return (
    <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={14}>
          <Input
            value={searchText}
            placeholder="Tìm mã giảm giá..."
            allowClear
            size="large"
            onChange={event => onSearchChange(event.target.value)}
            className="w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </Col>

        <Col xs={24} md={10}>
          <div className="flex justify-start md:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-900/30">
              <Text className="!text-sm !text-gray-600 dark:!text-gray-300">
                Tìm thấy
              </Text>

              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {resultCount}
              </span>

              <Text className="!text-sm !text-gray-600 dark:!text-gray-300">
                mã giảm giá
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default CouponsSearchCard