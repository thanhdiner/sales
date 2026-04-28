import React from 'react'
import { Col, Row, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'

const { Title, Paragraph, Text } = Typography

const ContactSection = ({ section = {}, websiteConfig }) => {
  const email = websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'
  const phone = websiteConfig?.contactInfo?.phone || '0823387108'
  const website = websiteConfig?.contactInfo?.website || 'www.smartmall.site'

  return (
    <PolicySectionCard id="lien-he" title={section.title}>
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">{section.description}</Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Title level={5} className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
              {section.email}
            </Title>

            <Text className="block break-all !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{email}</Text>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Title level={5} className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
              {section.hotline}
            </Title>

            <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{phone}</Text>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Title level={5} className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
              {section.website}
            </Title>

            <Text className="block break-all !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{website}</Text>
          </div>
        </Col>
      </Row>
    </PolicySectionCard>
  )
}

export default ContactSection
