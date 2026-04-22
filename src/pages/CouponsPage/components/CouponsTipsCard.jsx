import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { couponTips } from '../constants'

const { Title, Text } = Typography

const CouponsTipsCard = () => {
  return (
    <Card className="mt-12 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 text-center">
        <Title
          level={3}
          className="!mb-2 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          Mẹo sử dụng mã giảm giá
        </Title>

        <p className="mx-auto mb-0 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          Một vài lưu ý nhỏ giúp bạn chọn và sử dụng mã giảm giá hiệu quả hơn.
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {couponTips.map((tip, index) => (
          <Col xs={24} md={8} key={tip.title}>
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                {index + 1}
              </span>

              <Title
                level={4}
                className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                {tip.title}
              </Title>

              <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {tip.description}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default CouponsTipsCard