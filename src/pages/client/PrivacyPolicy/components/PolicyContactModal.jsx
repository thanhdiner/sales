import React from 'react'
import { Card, Modal, Typography } from 'antd'

const { Paragraph, Text } = Typography

const PolicyContactModal = ({ content = {}, open, onClose, websiteConfig }) => {
  const email = content.email || websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'
  const phone = content.phone || websiteConfig?.contactInfo?.phone || '0823387108'

  return (
    <Modal
      title={content.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {content.supportTitle}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {content.supportDescription}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            size="small"
            className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <Text className="block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
              {content.supportEmail}
            </Text>

            <Text className="mt-2 block break-all !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {email}
            </Text>
          </Card>

          <Card
            size="small"
            className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <Text className="block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
              {content.hotline}
            </Text>

            <Text className="mt-2 block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {phone}
            </Text>
          </Card>
        </div>

        <Paragraph className="!mb-0 !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
          {content.note}
        </Paragraph>
      </div>
    </Modal>
  )
}

export default PolicyContactModal
