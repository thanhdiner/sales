import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'
import { privacyPolicyDataTypes } from '../data'

const { Title, Paragraph } = Typography

const DataCollectionSection = () => {
  return (
    <PolicySectionCard
      id="thu-thap-thong-tin"
      title="1. Thu thập thông tin"
    >
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        Chúng tôi thu thập các loại thông tin sau để cung cấp dịch vụ tốt nhất cho bạn:
      </Paragraph>

      <Row gutter={[16, 16]}>
        {privacyPolicyDataTypes.map(type => (
          <Col xs={24} sm={12} lg={6} key={type.title}>
            <Card
              size="small"
              className="h-full rounded-2xl border border-gray-200 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <Title
                level={5}
                className="!mb-3 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                {type.title}
              </Title>

              <ul className="space-y-2">
                {type.items.map(item => (
                  <li
                    key={item}
                    className="text-sm leading-6 text-gray-600 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Lưu ý quan trọng
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Chúng tôi chỉ thu thập thông tin cần thiết và với sự đồng ý của bạn. Bạn có thể từ chối cung cấp một số
          thông tin nhưng điều này có thể ảnh hưởng đến chất lượng dịch vụ.
        </p>
      </div>
    </PolicySectionCard>
  )
}

export default DataCollectionSection