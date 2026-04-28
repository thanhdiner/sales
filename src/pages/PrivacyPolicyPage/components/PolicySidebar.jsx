import React from 'react'
import { Anchor, Card, Typography } from 'antd'

const { Title } = Typography

const PolicySidebar = ({ title, sections = [] }) => {
  const items = Array.isArray(sections) ? sections : []

  return (
    <Card className="sticky top-4 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Title level={4} className="!mb-4 !text-lg !font-semibold !text-gray-900 dark:!text-gray-100">
        {title}
      </Title>

      <Anchor
        items={items.map(section => ({
          key: section.id,
          href: `#${section.id}`,
          title: <span className="text-sm text-gray-600 dark:text-gray-300">{section.title}</span>
        }))}
        className="privacy-anchor"
      />
    </Card>
  )
}

export default PolicySidebar
