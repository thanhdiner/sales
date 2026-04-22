import React from 'react'
import { Button, Space, Typography } from 'antd'

const { Title, Paragraph } = Typography

const ReturnPolicyHeader = ({ onOpenRequestModal, onOpenTrackingModal }) => {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
        Chính sách
      </p>

      <Title
        level={1}
        className="!mb-4 !text-4xl !font-semibold !tracking-[-0.03em] !text-gray-900 dark:!text-white"
      >
        Chính sách đổi trả & hoàn tiền
      </Title>

      <Paragraph className="mx-auto !mb-0 max-w-3xl !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        Chúng tôi cam kết mang đến trải nghiệm mua sắm thuận tiện với chính sách đổi trả rõ ràng,
        linh hoạt và dễ thực hiện.
      </Paragraph>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Đổi trả linh hoạt
        </span>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Hoàn tiền minh bạch
        </span>

        <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Hỗ trợ nhanh chóng
        </span>
      </div>

      <div className="mt-7">
        <Space wrap size="middle">
          <Button
            onClick={onOpenRequestModal}
            className="h-auto rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:!bg-gray-800 hover:!text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:!bg-white"
          >
            Yêu cầu đổi trả
          </Button>

          <Button
            onClick={onOpenTrackingModal}
            className="h-auto rounded-lg border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:!border-gray-300 hover:!text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            Tra cứu yêu cầu
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default ReturnPolicyHeader