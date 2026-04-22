import React from 'react'
import { Button, Space, Typography } from 'antd'

const { Title, Paragraph } = Typography

const ReturnPolicyFooterCta = () => {
  return (
    <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
      <Title
        level={3}
        className="!mb-3 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
      >
        Cần hỗ trợ thêm?
      </Title>

      <Paragraph className="mx-auto !mb-6 max-w-xl !text-sm !leading-6 !text-gray-600 dark:!text-gray-300">
        Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn trong quá trình đổi trả và hoàn tiền.
      </Paragraph>

      <Space size="middle" wrap>
        <Button
          onClick={() => window.open('tel:0823387108', '_self')}
          className="h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
        >
          Gọi hotline
        </Button>

        <Button
          onClick={() => window.open('mailto:lunashop.business.official@gmail.com', '_blank')}
          className="h-auto rounded-lg border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          Gửi email
        </Button>

        <Button
          onClick={() => window.open('/faq', '_blank')}
          className="h-auto rounded-lg border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          FAQ chi tiết
        </Button>
      </Space>
    </div>
  )
}

export default ReturnPolicyFooterCta