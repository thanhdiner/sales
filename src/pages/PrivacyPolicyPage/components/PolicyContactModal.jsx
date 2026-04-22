import React from 'react'
import { Card, Modal, Typography } from 'antd'
import { privacyPolicyModalContact } from '../data'

const { Paragraph, Text } = Typography

const PolicyContactModal = ({ open, onClose }) => {
  return (
    <Modal
      title="Liên hệ về quyền riêng tư"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Chúng tôi sẵn sàng hỗ trợ
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Mọi yêu cầu về quyền riêng tư sẽ được xử lý trong vòng 72 giờ làm việc.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            size="small"
            className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <Text className="block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
              Email hỗ trợ
            </Text>

            <Text className="mt-2 block break-all !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {privacyPolicyModalContact.email}
            </Text>
          </Card>

          <Card
            size="small"
            className="rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <Text className="block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
              Hotline
            </Text>

            <Text className="mt-2 block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {privacyPolicyModalContact.phone}
            </Text>
          </Card>
        </div>

        <Paragraph className="!mb-0 !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
          Khi liên hệ, vui lòng cung cấp thông tin tài khoản và mô tả rõ yêu cầu của bạn để chúng tôi có thể hỗ trợ
          nhanh chóng và chính xác nhất.
        </Paragraph>
      </div>
    </Modal>
  )
}

export default PolicyContactModal