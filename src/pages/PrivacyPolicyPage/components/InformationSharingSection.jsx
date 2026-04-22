import React from 'react'
import { Typography } from 'antd'
import PolicySectionCard from './PolicySectionCard'
import { privacyPolicySharingData } from '../data'

const { Title, Paragraph } = Typography

const InformationSharingSection = () => {
  return (
    <PolicySectionCard
      id="chia-se-thong-tin"
      title="3. Chia sẻ thông tin"
    >
      <Paragraph className="!mb-5 !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        Chúng tôi có thể chia sẻ thông tin của bạn trong một số trường hợp cần thiết để vận hành dịch vụ,
        nhưng luôn giới hạn trong phạm vi phù hợp và minh bạch.
      </Paragraph>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Title
            level={5}
            className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
          >
            Được phép chia sẻ
          </Title>

          <ul className="space-y-2">
            {privacyPolicySharingData.allowed.map(item => (
              <li
                key={item}
                className="text-sm leading-6 text-gray-600 dark:text-gray-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Title
            level={5}
            className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
          >
            Không được chia sẻ
          </Title>

          <ul className="space-y-2">
            {privacyPolicySharingData.disallowed.map(item => (
              <li
                key={item}
                className="text-sm leading-6 text-gray-600 dark:text-gray-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PolicySectionCard>
  )
}

export default InformationSharingSection