import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { returnPolicyRefundMethods } from '../data'

const { Title, Text } = Typography

const ReturnPolicyConditionsSection = () => {
  return (
    <Row gutter={[16, 16]} className="mb-8">
      <Col xs={24} lg={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Điều kiện đổi trả
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <Title
                level={5}
                className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                Được chấp nhận
              </Title>

              <div>
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  Hàng vật lý
                </Text>

                <ul className="space-y-2">
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Sản phẩm còn nguyên vẹn, chưa sử dụng
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Đầy đủ bao bì, nhãn mác, phụ kiện
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Có hóa đơn mua hàng hợp lệ
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Trong thời hạn đổi trả quy định từng loại sản phẩm
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Lý do chính đáng như lỗi kỹ thuật, giao sai hoặc hư hỏng vận chuyển
                  </li>
                </ul>
              </div>

              <div className="mt-5">
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  Dịch vụ online, tài khoản, phần mềm
                </Text>

                <ul className="space-y-2">
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Dịch vụ hoặc tài khoản chưa kích hoạt, hoặc không sử dụng được do lỗi hệ thống
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Tài khoản hoặc bản quyền chưa sử dụng, hoặc bị lỗi kỹ thuật khi nhận
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Giao nhầm hoặc mua nhầm gói dịch vụ và chưa kích hoạt
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
              <Title
                level={5}
                className="!mb-4 !text-base !font-semibold !text-gray-900 dark:!text-gray-100"
              >
                Không được chấp nhận
              </Title>

              <div>
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  Hàng vật lý
                </Text>

                <ul className="space-y-2">
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Sản phẩm đã qua sử dụng, bị bẩn hoặc hư hỏng bởi người dùng
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Thiếu phụ kiện, bao bì gốc hoặc không còn nhãn mác
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Quá thời hạn đổi trả
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Sản phẩm theo yêu cầu riêng như đặt làm hoặc cá nhân hóa
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Đồ lót, mỹ phẩm, sản phẩm đã mở seal hoặc đã dùng thử
                  </li>
                </ul>
              </div>

              <div className="mt-5">
                <Text className="mb-2 block !text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                  Dịch vụ online, tài khoản, phần mềm
                </Text>

                <ul className="space-y-2">
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Đã kích hoạt hoặc bắt đầu sử dụng dịch vụ thành công
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Đã chuyển nhượng, tặng hoặc giao dịch lại cho người khác
                  </li>
                  <li className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Vi phạm điều khoản sử dụng, bị khóa hoặc banned do lỗi người dùng
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Phương thức hoàn tiền
            </span>
          }
          className="h-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-3">
            {returnPolicyRefundMethods.map(method => (
              <div
                key={method.method}
                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Text className="!text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
                    {method.method}
                  </Text>

                  {method.popular && (
                    <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
                      Phổ biến
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Thời gian: {method.time}
                  </p>
                  <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Phí: {method.fee}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ReturnPolicyConditionsSection