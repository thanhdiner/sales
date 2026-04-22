import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'
import { privacyPolicySecurityMeasures } from '../data'

const { Title, Paragraph, Text } = Typography

const SecuritySection = () => {
  return (
    <PolicySectionCard
      id="bao-mat-thong-tin"
      title="4. Bảo mật thông tin"
    >
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        Chúng tôi áp dụng các biện pháp bảo mật cần thiết để bảo vệ thông tin của bạn trong quá trình sử dụng dịch vụ.
      </Paragraph>

      <Row gutter={[16, 16]}>
        {privacyPolicySecurityMeasures.map(measure => (
          <Col xs={24} sm={12} key={measure.title}>
            <Card
              size="small"
              className="h-full rounded-2xl border border-gray-200 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <Title
                level={5}
                className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                {measure.title}
              </Title>

              <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
                {measure.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Cam kết bảo mật
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế như ISO 27001, GDPR và các quy định bảo mật dữ liệu
          của Việt Nam.
        </p>
      </div>
    </PolicySectionCard>
  )
}

export default SecuritySection