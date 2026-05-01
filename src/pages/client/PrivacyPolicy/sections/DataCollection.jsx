import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import PolicyCard from '../components/PolicyCard'

const { Title, Paragraph } = Typography

const DataCollection = ({ section = {} }) => {
  const dataTypes = Array.isArray(section.dataTypes) ? section.dataTypes : []

  return (
    <PolicyCard id="thu-thap-thong-tin" title={section.title}>
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        {section.description}
      </Paragraph>

      <Row gutter={[16, 16]}>
        {dataTypes.map((type, index) => (
          <Col xs={24} sm={12} lg={6} key={`${type.title}_${index}`}>
            <Card
              size="small"
              className="h-full rounded-2xl border border-gray-200 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <Title level={5} className="!mb-3 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
                {type.title}
              </Title>

              <ul className="space-y-2">
                {(Array.isArray(type.items) ? type.items : []).map(item => (
                  <li key={item} className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{section.importantNoteTitle}</h3>

        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{section.importantNoteDescription}</p>
      </div>
    </PolicyCard>
  )
}

export default DataCollection
