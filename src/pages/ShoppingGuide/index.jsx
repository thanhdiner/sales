import React, { useState } from 'react'
import { Steps, Card, Button, Typography, Space, Timeline, Tag, Alert, Divider, Row, Col, Collapse, List } from 'antd'
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  UserOutlined,
  SafetyOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import titles from '@/utils/titles'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const ShoppingGuide = () => {
  titles('Hướng dẫn mua hàng')

  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const steps = [
    {
      title: 'Chọn sản phẩm',
      content: 'Tìm kiếm và lựa chọn sản phẩm bạn muốn mua',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Đăng nhập/Đăng ký',
      content: 'Tạo tài khoản hoặc đăng nhập để tiếp tục',
      icon: <UserOutlined />
    },
    {
      title: 'Thanh toán',
      content: 'Chọn phương thức thanh toán và hoàn tất đơn hàng',
      icon: <CreditCardOutlined />
    },
    {
      title: 'Giao hàng',
      content: 'Theo dõi đơn hàng và nhận sản phẩm',
      icon: <TruckOutlined />
    }
  ]

  const paymentMethods = [
    { name: 'Ví điện tử', desc: 'MoMo, ZaloPay, ViettelPay', popular: true },
    { name: 'Chuyển khoản ngân hàng', desc: 'Internet Banking, Mobile Banking', popular: true }
  ]

  const faqData = [
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer:
        'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi" hoặc sử dụng mã đơn hàng được gửi qua email/SMS.'
    },
    {
      question: 'Thời gian giao hàng mất bao lâu?',
      answer: 'Thời gian giao hàng thông thường là 2-3 tiếng làm việc.'
    },
    {
      question: 'Có thể đổi trả hàng không?',
      answer:
        'Chính sách đổi trả áp dụng tùy theo từng loại sản phẩm. Vui lòng xem chi tiết chính sách đổi trả của từng sản phẩm trên trang thông tin sản phẩm.'
    },
    {
      question: 'Phí giao hàng được tính như thế nào?',
      answer: `- Sản phẩm giao dịch online (phần mềm, mã kích hoạt, tài khoản, v.v.): luôn miễn phí giao hàng. Sản phẩm sẽ được gửi qua email hoặc tin nhắn.
- Sản phẩm vật lý: Phí giao hàng được tính dựa trên khu vực và trọng lượng. Đơn hàng từ 500.000đ trở lên sẽ được miễn phí giao hàng.
`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Title level={1} className="!text-4xl !text-gray-800 !mb-4">
            🛒 Hướng Dẫn Mua Hàng
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hướng dẫn chi tiết từng bước để bạn có thể mua sắm dễ dàng và an toàn trên website của chúng tôi
          </Paragraph>
        </div>

        {/* Quick Start Alert */}
        <Alert
          message="Mua hàng nhanh chóng"
          description="Đăng ký tài khoản để sử dụng đầy đủ tính năng của hệ thống."
          type="success"
          showIcon
          className="mb-8 rounded-lg"
          action={
            <Button type="primary" size="small" onClick={() => navigate('/user/register')}>
              Đăng ký ngay
            </Button>
          }
        />

        {/* Main Steps */}
        <Card className="mb-10 shadow-lg rounded-xl">
          <Title level={2} className="text-center !text-2xl !mb-8">
            Quy Trình Mua Hàng
          </Title>

          <Steps current={currentStep} className="mb-8" responsive={false}>
            {steps.map((step, index) => (
              <Steps.Step key={index} title={step.title} description={step.content} icon={step.icon} />
            ))}
          </Steps>

          <div className="text-center">
            <Space>
              <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
                Quay lại
              </Button>
              <Button type="primary" disabled={currentStep === steps.length - 1} onClick={() => setCurrentStep(currentStep + 1)}>
                Tiếp theo
              </Button>
            </Space>
          </div>
        </Card>

        {/* Detailed Guide */}
        <Row gutter={[24, 24]} className="mb-10">
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined className="text-blue-500" />
                  <span>Chi Tiết Từng Bước</span>
                </Space>
              }
              className="h-full shadow-md rounded-lg"
            >
              <Timeline
                items={[
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <Text strong>Bước 1: Tìm kiếm sản phẩm</Text>
                        <br />
                        <Text type="secondary">Sử dụng thanh tìm kiếm hoặc duyệt theo danh mục để tìm sản phẩm mong muốn</Text>
                      </div>
                    )
                  },
                  {
                    color: 'green',
                    children: (
                      <div>
                        <Text strong>Bước 2: Thêm vào giỏ hàng</Text>
                        <br />
                        <Text type="secondary">Chọn số lượng, màu sắc, kích thước và nhấn "Thêm vào giỏ hàng"</Text>
                      </div>
                    )
                  },
                  {
                    color: 'orange',
                    children: (
                      <div>
                        <Text strong>Bước 3: Kiểm tra giỏ hàng</Text>
                        <br />
                        <Text type="secondary">Xem lại sản phẩm, số lượng và tổng tiền trước khi thanh toán</Text>
                      </div>
                    )
                  },
                  {
                    color: 'purple',
                    children: (
                      <div>
                        <Text strong>Bước 4: Điền thông tin giao hàng</Text>
                        <br />
                        <Text type="secondary">Nhập địa chỉ, số điện thoại và chọn phương thức giao hàng</Text>
                      </div>
                    )
                  },
                  {
                    color: 'red',
                    children: (
                      <div>
                        <Text strong>Bước 5: Hoàn tất thanh toán</Text>
                        <br />
                        <Text type="secondary">Chọn phương thức thanh toán và xác nhận đơn hàng</Text>
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <CreditCardOutlined className="text-green-500" />
                  <span>Phương Thức Thanh Toán</span>
                </Space>
              }
              className="h-full shadow-md rounded-lg"
            >
              <List
                dataSource={paymentMethods}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          {item.name}
                          {item.popular && <Tag color="red">Phổ biến</Tag>}
                        </Space>
                      }
                      description={item.desc}
                    />
                  </List.Item>
                )}
              />

              <Divider />

              <Alert
                message="Bảo mật thanh toán"
                description="Tất cả giao dịch được mã hóa SSL 256-bit đảm bảo an toàn tuyệt đối"
                type="info"
                showIcon
                icon={<SafetyOutlined />}
                className="mt-4"
              />
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Card
          title={
            <Space>
              <QuestionCircleOutlined className="text-orange-500" />
              <span>Câu Hỏi Thường Gặp</span>
            </Space>
          }
          className="mb-10 shadow-md rounded-lg"
        >
          <Collapse ghost>
            {faqData.map((faq, index) => (
              <Panel header={faq.question} key={index}>
                {/* Thêm style whiteSpace: pre-line để xuống dòng */}
                <Paragraph style={{ whiteSpace: 'pre-line' }}>{faq.answer}</Paragraph>
              </Panel>
            ))}
          </Collapse>
        </Card>

        {/* Contact & Support */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="🎯 Mẹo Mua Hàng Thông Minh" className="h-full shadow-md rounded-lg">
              <List
                size="small"
                dataSource={[
                  'So sánh giá trước khi mua',
                  'Kiểm tra chính sách đổi trả của sản phẩm',
                  'Luôn kiểm tra kỹ thông tin sản phẩm trước khi đặt hàng',
                  'Tận dụng các chương trình flash sale để mua được giá tốt',
                  'Sử dụng mã giảm giá và voucher có sẵn'
                ]}
                renderItem={item => (
                  <List.Item>
                    <CheckCircleOutlined className="text-green-500 mr-2" />
                    {item}
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="📞 Hỗ Trợ Khách Hàng" className="h-full shadow-md rounded-lg">
              <Space direction="vertical" className="w-full">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <Space>
                    <PhoneOutlined className="text-blue-500" />
                    <span>Hotline</span>
                  </Space>
                  <Text strong>0823387108</Text>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <Space>
                    <MailOutlined className="text-green-500" />
                    <span>Email</span>
                  </Space>
                  <Text strong>lunashop.business.official@gmail.com</Text>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <Space>
                    <ClockCircleOutlined className="text-orange-500" />
                    <span>Giờ làm việc</span>
                  </Space>
                  <Text strong>8:00 - 22:00</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Footer CTA */}
        <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-lg">
          <Title level={3} className="!mb-4">
            Sẵn sàng bắt đầu mua sắm?
          </Title>
          <Paragraph className="text-gray-600 mb-6">Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất</Paragraph>
          <Button type="primary" size="large" className="mr-4" onClick={() => navigate('/products')}>
            Bắt đầu mua sắm
          </Button>
          <Button size="large" onClick={() => navigate('/coupons')}>
            Xem khuyến mãi
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingGuide
