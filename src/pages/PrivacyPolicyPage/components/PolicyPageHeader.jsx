import React from 'react'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const PolicyPageHeader = () => {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
        Chính sách
      </p>

      <Title level={1} className="!mb-4 !text-4xl !font-semibold !tracking-[-0.03em] !text-gray-900">
        Chính sách bảo mật
      </Title>

      <Paragraph className="mx-auto !mb-0 max-w-3xl !text-base !leading-7 !text-gray-600">
        Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn một cách an toàn và minh bạch.
      </Paragraph>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
          Cập nhật: 01/08/2025
        </span>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
          Tuân thủ GDPR
        </span>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600">
          ISO 27001
        </span>
      </div>
    </div>
  )
}

export default PolicyPageHeader