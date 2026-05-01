import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import PolicyCard from '../components/PolicyCard'
import { privacyPolicySecurityMeasures } from '../data'

const { Title, Paragraph, Text } = Typography

const Security = ({ section = {} }) => {
  const measures = Array.isArray(section.measures) ? section.measures : []

  return (
    <PolicyCard id="bao-mat-thong-tin" title={section.title}>
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">{section.description}</Paragraph>

      <Row gutter={[16, 16]}>
        {measures.map((measure, index) => {
          const iconMeta = privacyPolicySecurityMeasures[index] || {}
          const Icon = iconMeta.icon

          return (
            <Col xs={24} sm={12} key={`${measure.title}_${index}`}>
              <Card
                size="small"
                className="h-full rounded-2xl border border-gray-200 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              >
                <Title level={5} className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
                  {Icon && <Icon className={`mr-2 ${iconMeta.iconClassName}`} />}
                  {measure.title}
                </Title>

                <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{measure.description}</Text>
              </Card>
            </Col>
          )
        })}
      </Row>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{section.commitmentTitle}</h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{section.commitmentDescription}</p>
      </div>
    </PolicyCard>
  )
}

export default Security
