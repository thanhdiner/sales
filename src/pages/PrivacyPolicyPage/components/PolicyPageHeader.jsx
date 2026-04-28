import React from 'react'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const PolicyPageHeader = ({ content = {} }) => {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">{content.eyebrow}</p>

      <Title level={1} className="!mb-4 !text-4xl !font-semibold !tracking-[-0.03em] !text-gray-900">
        {content.title}
      </Title>

      <Paragraph className="mx-auto !mb-0 max-w-3xl !text-base !leading-7 !text-gray-600">{content.description}</Paragraph>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
          {content.updatedAt}
        </span>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
          {content.gdpr}
        </span>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
          {content.iso}
        </span>
      </div>
    </div>
  )
}

export default PolicyPageHeader
