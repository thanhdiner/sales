import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { returnPolicyReturnReasons } from '../data'

const { Title, Paragraph } = Typography

const ReturnPolicyReasonsSection = () => {
  return (
    <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <Title
          level={2}
          className="!mb-2 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          Lý do đổi trả phổ biến
        </Title>

        <Paragraph className="!mb-0 !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
          Một số lý do thường gặp khi khách hàng tạo yêu cầu đổi trả sản phẩm.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {returnPolicyReturnReasons.map(reason => (
          <Col xs={24} sm={12} lg={8} key={reason.value}>
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {reason.label}
              </h3>

              <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                Nhấn để chọn lý do này khi tạo yêu cầu đổi trả.
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default ReturnPolicyReasonsSection