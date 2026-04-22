import React from 'react'
import { Card, Grid, Steps, Typography } from 'antd'
import { returnPolicyOnlineSteps, returnPolicyPhysicalSteps } from '../data'

const { Title } = Typography
const { useBreakpoint } = Grid

const toStepItems = steps =>
  steps.map(step => ({
    title: (
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {step.title}
      </span>
    ),
    description: (
      <span className="text-sm leading-6 text-gray-600 dark:text-gray-300">
        {step.description}
      </span>
    ),
  }))

const ReturnPolicyProcessSection = () => {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  return (
    <>
      <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Title
          level={2}
          className="!mb-8 text-center !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          Quy trình đổi trả hàng vật lý
        </Title>

        <Steps
          current={-1}
          items={toStepItems(returnPolicyPhysicalSteps)}
          direction={isMobile ? 'vertical' : 'horizontal'}
          size={isMobile ? 'small' : 'default'}
          className="mb-6"
        />

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Lưu ý quan trọng
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Vui lòng giữ nguyên tình trạng sản phẩm và đóng gói cẩn thận khi gửi về để đảm bảo quá trình xử lý nhanh chóng.
          </p>
        </div>
      </Card>

      <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Title
          level={2}
          className="!mb-8 text-center !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          Quy trình xử lý dịch vụ online / tài khoản / phần mềm
        </Title>

        <Steps
          current={-1}
          items={toStepItems(returnPolicyOnlineSteps)}
          direction={isMobile ? 'vertical' : 'horizontal'}
          size={isMobile ? 'small' : 'default'}
          className="mb-6"
        />

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Lưu ý
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Một số sản phẩm số, phần mềm bản quyền, tài khoản số, dịch vụ nâng cấp online chỉ hỗ trợ hoàn tiền hoặc đổi mới khi phát sinh lỗi từ hệ thống hoặc không sử dụng được.
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Sau khi dịch vụ đã được kích hoạt thành công, một số sản phẩm không áp dụng hoàn tiền theo quy định của nhà phát hành.
          </p>
        </div>
      </Card>
    </>
  )
}

export default ReturnPolicyProcessSection