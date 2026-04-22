import React from 'react'
import { Button, Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'
import { privacyPolicyUserRights } from '../data'

const { Title, Paragraph, Text } = Typography

const UserRightsSection = ({ onOpenContactModal }) => {
  return (
    <PolicySectionCard
      id="quyen-nguoi-dung"
      title="5. Quyền của người dùng"
    >
      <Paragraph className="mb-6 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        Bạn có các quyền sau đối với thông tin cá nhân của mình:
      </Paragraph>

      <div className="grid gap-3 md:grid-cols-2">
        {privacyPolicyUserRights.map((right, index) => (
          <div
            key={right}
            className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {index + 1}
            </span>

            <Text className="!text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
              {right}
            </Text>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
        <Title
          level={5}
          className="!mb-2 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
        >
          Cách thực hiện quyền của bạn
        </Title>

        <Text className="block !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
          Để thực hiện các quyền trên, vui lòng liên hệ với chúng tôi qua email hoặc hotline.
          Chúng tôi sẽ phản hồi trong vòng 72 giờ.
        </Text>

        <Button
          onClick={onOpenContactModal}
          className="mt-4 h-auto rounded-lg border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          Liên hệ ngay
        </Button>
      </div>
    </PolicySectionCard>
  )
}

export default UserRightsSection