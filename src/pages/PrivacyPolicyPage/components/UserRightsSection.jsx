import React from 'react'
import { Button, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'

const { Title, Paragraph, Text } = Typography

const UserRightsSection = ({ section = {}, onOpenContactModal }) => {
  const rights = Array.isArray(section.rights) ? section.rights : []

  return (
    <PolicySectionCard id="quyen-nguoi-dung" title={section.title}>
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">{section.description}</Paragraph>

      <div className="grid gap-3 md:grid-cols-2">
        {rights.map((right, index) => (
          <div
            key={`${right}_${index}`}
            className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {index + 1}
            </span>

            <Text className="!text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{right}</Text>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
        <Title level={5} className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100">
          {section.howToTitle}
        </Title>

        <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">{section.howToDescription}</Text>

        <Button
          onClick={onOpenContactModal}
          className="mt-4 h-auto rounded-lg border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {section.contactButton}
        </Button>
      </div>
    </PolicySectionCard>
  )
}

export default UserRightsSection
