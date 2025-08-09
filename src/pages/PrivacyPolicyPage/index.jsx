import React, { useState } from 'react'
import { Typography, Card, Row, Col, Anchor, Space, Alert, Tag, Button, Modal, Timeline, Collapse } from 'antd'
import {
  SafetyOutlined,
  LockOutlined,
  EyeOutlined,
  UserOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import titles from '@/utils/titles'
import { useSelector } from 'react-redux'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const PrivacyPolicyPage = () => {
  titles('Chính sách bảo mật')

  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const [contactModalVisible, setContactModalVisible] = useState(false)

  const sections = [
    {
      id: 'thu-thap-thong-tin',
      title: '1. Thu thập thông tin',
      icon: <DatabaseOutlined />
    },
    {
      id: 'su-dung-thong-tin',
      title: '2. Sử dụng thông tin',
      icon: <EyeOutlined />
    },
    {
      id: 'chia-se-thong-tin',
      title: '3. Chia sẻ thông tin',
      icon: <GlobalOutlined />
    },
    {
      id: 'bao-mat-thong-tin',
      title: '4. Bảo mật thông tin',
      icon: <LockOutlined />
    },
    {
      id: 'quyen-nguoi-dung',
      title: '5. Quyền của người dùng',
      icon: <UserOutlined />
    },
    {
      id: 'cookies',
      title: '6. Cookies và công nghệ theo dõi',
      icon: <FileProtectOutlined />
    },
    {
      id: 'lien-he',
      title: '7. Thông tin liên hệ',
      icon: <PhoneOutlined />
    }
  ]

  const dataTypes = [
    {
      title: 'Thông tin cá nhân',
      items: ['Họ tên', 'Số điện thoại', 'Email', 'Địa chỉ'],
      color: 'blue'
    },
    {
      title: 'Thông tin thanh toán',
      items: ['Lịch sử giao dịch', 'Phương thức thanh toán'],
      color: 'green'
    },
    {
      title: 'Thông tin kỹ thuật',
      items: ['Địa chỉ IP', 'Loại trình duyệt', 'Hệ điều hành', 'Cookies'],
      color: 'orange'
    },
    {
      title: 'Thông tin hành vi',
      items: ['Lịch sử duyệt web', 'Sản phẩm quan tâm', 'Thời gian truy cập'],
      color: 'purple'
    }
  ]

  const securityMeasures = [
    {
      title: 'Mã hóa SSL/TLS',
      description: 'Tất cả dữ liệu được mã hóa trong quá trình truyền tải',
      icon: <LockOutlined className="text-green-500" />
    },
    {
      title: 'Firewall bảo mật',
      description: 'Hệ thống firewall đa lớp bảo vệ máy chủ',
      icon: <SafetyOutlined className="text-blue-500" />
    },
    {
      title: 'Kiểm soát truy cập',
      description: 'Chỉ nhân viên được ủy quyền mới có thể truy cập dữ liệu',
      icon: <UserOutlined className="text-orange-500" />
    },
    {
      title: 'Sao lưu định kỳ',
      description: 'Dữ liệu được sao lưu thường xuyên để đảm bảo an toàn',
      icon: <DatabaseOutlined className="text-purple-500" />
    }
  ]

  const userRights = [
    'Quyền được biết về việc thu thập và sử dụng thông tin',
    'Quyền truy cập và sửa đổi thông tin cá nhân',
    'Quyền xóa tài khoản và dữ liệu cá nhân',
    'Quyền từ chối nhận thông tin quảng cáo',
    'Quyền khiếu nại khi có vi phạm quyền riêng tư',
    'Quyền yêu cầu sao chép dữ liệu cá nhân'
  ]

  const faqData = [
    {
      question: 'Tại sao chúng tôi cần thu thập thông tin cá nhân?',
      answer:
        'Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt nhất, xử lý đơn hàng, hỗ trợ khách hàng và cải thiện trải nghiệm mua sắm của bạn.'
    },
    {
      question: 'Thông tin của tôi có được chia sẻ với bên thứ ba không?',
      answer:
        'Chúng tôi chỉ chia sẻ thông tin với các đối tác tin cậy cần thiết để hoàn thành dịch vụ (như vận chuyển, thanh toán) và luôn yêu cầu họ bảo vệ thông tin theo tiêu chuẩn cao.'
    },
    {
      question: 'Tôi có thể xóa tài khoản và dữ liệu của mình không?',
      answer:
        'Có, bạn có thể yêu cầu xóa tài khoản bất cứ lúc nào. Chúng tôi sẽ xóa toàn bộ dữ liệu cá nhân trong vòng 30 ngày, trừ những thông tin cần thiết theo quy định pháp luật.'
    },
    {
      question: 'Làm thế nào để tôi kiểm soát cookies?',
      answer:
        'Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. Tuy nhiên, việc vô hiệu hóa cookies có thể ảnh hưởng đến một số tính năng của website.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4">
            <SafetyOutlined className="text-3xl text-white" />
          </div>
          <Title level={1} className="!text-4xl !text-gray-800 !mb-4">
            Chính Sách Bảo Mật
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn một cách an toàn và minh bạch
          </Paragraph>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Tag color="blue" className="px-3 py-1">
              <CalendarOutlined className="mr-1" />
              Cập nhật: 01/08/2025
            </Tag>
            <Tag color="green" className="px-3 py-1">
              <SafetyOutlined className="mr-1" />
              Tuân thủ GDPR
            </Tag>
            <Tag color="orange" className="px-3 py-1">
              <FileProtectOutlined className="mr-1" />
              ISO 27001
            </Tag>
          </div>
        </div>

        {/* Quick Summary Alert */}
        <Alert
          message={<span className="dark:text-gray-100">Tóm tắt nhanh</span>}
          description={
            <span className="dark:text-gray-300">
              Chúng tôi thu thập thông tin cần thiết để cung cấp dịch vụ, bảo vệ dữ liệu bằng mã hóa SSL, không bán thông tin cho bên thứ
              ba, và bạn có toàn quyền kiểm soát dữ liệu cá nhân.
            </span>
          }
          type="info"
          showIcon
          className="mb-8 rounded-lg dark:bg-gray-800"
        />

        <Row gutter={[24, 24]}>
          {/* Navigation Sidebar */}
          <Col xs={24} lg={6}>
            <Card className="sticky top-4 shadow-lg rounded-xl dark:bg-gray-800">
              <Title level={4} className="!mb-4">
                <FileProtectOutlined className="mr-2 text-blue-500" />
                Mục lục
              </Title>
              <Anchor
                items={sections.map(section => ({
                  key: section.id,
                  href: `#${section.id}`,
                  title: (
                    <Space>
                      {section.icon}
                      <span className="dark:text-gray-100">{section.title}</span>
                    </Space>
                  )
                }))}
                className="privacy-anchor"
              />
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={18}>
            <div className="space-y-8">
              {/* Thu thập thông tin */}
              <Card id="thu-thap-thong-tin" className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <DatabaseOutlined className="mr-3 text-blue-500" />
                  1. Thu thập thông tin
                </Title>

                <Paragraph className="text-lg mb-6">
                  Chúng tôi thu thập các loại thông tin sau để cung cấp dịch vụ tốt nhất cho bạn:
                </Paragraph>

                <Row gutter={[16, 16]}>
                  {dataTypes.map((type, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                      <Card
                        size="small"
                        className={`h-full border-l-4 border-l-${type.color}-500 hover:shadow-md transition-shadow dark:bg-gray-800`}
                      >
                        <Title level={5} className={`!text-${type.color}-600 !mb-3`}>
                          {type.title}
                        </Title>
                        <ul className="space-y-1">
                          {type.items.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Alert
                  message={<span className="dark:text-gray-100">Lưu ý quan trọng</span>}
                  description={
                    <span className="dark:text-gray-300">
                      Chúng tôi chỉ thu thập thông tin cần thiết và với sự đồng ý của bạn. Bạn có thể từ chối cung cấp một số thông tin
                      nhưng điều này có thể ảnh hưởng đến chất lượng dịch vụ.
                    </span>
                  }
                  type="warning"
                  showIcon
                  className="mt-6 dark:bg-gray-800"
                />
              </Card>

              {/* Sử dụng thông tin */}
              <Card id="su-dung-thong-tin" className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <EyeOutlined className="mr-3 text-green-500" />
                  2. Sử dụng thông tin
                </Title>

                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <Text strong>Cung cấp dịch vụ</Text>
                          <br />
                          <Text type="secondary">Xử lý đơn hàng, giao hàng, thanh toán và hỗ trợ khách hàng</Text>
                        </div>
                      )
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <Text strong>Cải thiện trải nghiệm</Text>
                          <br />
                          <Text type="secondary">Cá nhân hóa nội dung, đưa ra gợi ý sản phẩm phù hợp</Text>
                        </div>
                      )
                    },
                    {
                      color: 'orange',
                      children: (
                        <div>
                          <Text strong>Liên lạc marketing</Text>
                          <br />
                          <Text type="secondary">Gửi thông tin khuyến mãi, sản phẩm mới (chỉ khi bạn đồng ý)</Text>
                        </div>
                      )
                    },
                    {
                      color: 'red',
                      children: (
                        <div>
                          <Text strong>Bảo mật và tuân thủ</Text>
                          <br />
                          <Text type="secondary">Phát hiện gian lận, tuân thủ quy định pháp luật</Text>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>

              {/* Chia sẻ thông tin */}
              <Card id="chia-se-thong-tin" className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <GlobalOutlined className="mr-3 text-orange-500" />
                  3. Chia sẻ thông tin
                </Title>

                <Paragraph>Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:</Paragraph>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-1 dark:outline-gray-600 dark:outline-solid">
                    <Title level={5} className="!text-blue-600">
                      ✅ Được phép chia sẻ
                    </Title>
                    <ul className="space-y-2 text-sm dark:text-gray-300">
                      <li>• Với đối tác vận chuyển để giao hàng</li>
                      <li>• Với ngân hàng/cổng thanh toán để xử lý giao dịch</li>
                      <li>• Với cơ quan pháp luật khi có yêu cầu hợp lệ</li>
                      <li>• Với sự đồng ý rõ ràng của bạn</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-1 dark:outline-gray-600 dark:outline-solid">
                    <Title level={5} className="!text-red-600">
                      ❌ Không được chia sẻ
                    </Title>
                    <ul className="space-y-2 text-sm dark:text-gray-300">
                      <li>• Bán thông tin cho bên thứ ba</li>
                      <li>• Chia sẻ với mục đích thương mại khác</li>
                      <li>• Tiết lộ thông tin nhạy cảm không cần thiết</li>
                      <li>• Chia sẻ không có sự đồng ý</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Bảo mật thông tin */}
              <Card id="bao-mat-thong-tin" className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <LockOutlined className="mr-3 text-purple-500" />
                  4. Bảo mật thông tin
                </Title>

                <Paragraph className="text-lg mb-6">
                  Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
                </Paragraph>

                <Row gutter={[16, 16]}>
                  {securityMeasures.map((measure, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <Card size="small" className="h-full hover:shadow-md transition-shadow dark:bg-gray-800">
                        <Space className="mb-3">
                          {measure.icon}
                          <Title level={5} className="!mb-0">
                            {measure.title}
                          </Title>
                        </Space>
                        <Text type="secondary" className="text-sm">
                          {measure.description}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-600 dark:outline-solid">
                  <Title level={5} className="!text-green-700 !mb-2">
                    <SafetyOutlined className="mr-2" />
                    Cam kết bảo mật
                  </Title>
                  <Text className="text-green-600">
                    Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế như ISO 27001, GDPR và các quy định bảo mật dữ liệu của Việt Nam.
                  </Text>
                </div>
              </Card>

              {/* Quyền của người dùng */}
              <Card id="quyen-nguoi-dung" className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <UserOutlined className="mr-3 text-indigo-500" />
                  5. Quyền của người dùng
                </Title>

                <Paragraph className="text-lg mb-6">Bạn có các quyền sau đối với thông tin cá nhân của mình:</Paragraph>

                <div className="grid md:grid-cols-2 gap-4">
                  {userRights.map((right, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-1 dark:outline-gray-600 dark:outline-solid"
                    >
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Text className="text-white text-xs font-bold">{index + 1}</Text>
                      </div>
                      <Text className="text-sm">{right}</Text>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-1 dark:outline-gray-600 dark:outline-solid">
                  <Title level={5} className="!text-blue-700 !mb-2">
                    Cách thực hiện quyền của bạn
                  </Title>
                  <Text className="text-blue-600">
                    Để thực hiện các quyền trên, vui lòng liên hệ với chúng tôi qua email hoặc hotline. Chúng tôi sẽ phản hồi trong vòng 72
                    giờ.
                  </Text>
                  <div className="mt-3">
                    <Button type="primary" onClick={() => setContactModalVisible(true)} className="mr-2">
                      Liên hệ ngay
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Cookies */}
              <Card id="cookies" className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <FileProtectOutlined className="mr-3 text-yellow-600" />
                  6. Cookies và công nghệ theo dõi
                </Title>

                <Paragraph>Chúng tôi sử dụng cookies và các công nghệ tương tự để:</Paragraph>

                <Collapse ghost>
                  <Panel header={<span className="dark:text-gray-100">Cookies thiết yếu</span>} key="essential">
                    <Text>
                      Cần thiết cho hoạt động cơ bản của website như đăng nhập, giỏ hàng, bảo mật. Không thể tắt loại cookies này.
                    </Text>
                  </Panel>
                  <Panel header={<span className="dark:text-gray-100">Cookies hiệu suất</span>} key="performance">
                    <Text>Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện trải nghiệm. Thông tin được thu thập ẩn danh.</Text>
                  </Panel>
                  <Panel header={<span className="dark:text-gray-100">Cookies tiếp thị</span>} key="marketing">
                    <Text>
                      Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn trên các website khác. Bạn có thể từ chối loại cookies
                      này.
                    </Text>
                  </Panel>
                </Collapse>

                <Button type="dashed" className="mt-4 dark:bg-primary dark:text-white dark:hover:!bg-blue-400 dark:hover:!text-white" block>
                  Quản lý cài đặt Cookies
                </Button>
              </Card>

              {/* FAQ */}
              <Card className="shadow-lg rounded-xl dark:bg-gray-800">
                <Title level={2} className="!text-2xl !mb-6">
                  <QuestionCircleOutlined className="mr-3 text-green-500" />
                  Câu hỏi thường gặp
                </Title>

                <Collapse ghost>
                  {faqData.map((faq, index) => (
                    <Panel header={<span className="dark:text-gray-100">{faq.question}</span>} key={index}>
                      <Text>{faq.answer}</Text>
                    </Panel>
                  ))}
                </Collapse>
              </Card>

              {/* Liên hệ */}
              <Card
                id="lien-he"
                className="shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-800"
              >
                <Title level={2} className="!text-white !text-2xl !mb-6">
                  <PhoneOutlined className="mr-3" />
                  7. Thông tin liên hệ
                </Title>

                <Paragraph className="!text-white text-lg mb-6">
                  Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ:
                </Paragraph>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <MailOutlined className="text-4xl mb-3" />
                      <Title level={5} className="!text-white">
                        Email
                      </Title>
                      <Text className="text-blue-100">{websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}</Text>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <PhoneOutlined className="text-4xl mb-3" />
                      <Title level={5} className="!text-white">
                        Hotline
                      </Title>
                      <Text className="text-blue-100">{websiteConfig?.contactInfo?.phone || '0823387108'}</Text>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <GlobalOutlined className="text-4xl mb-3" />
                      <Title level={5} className="!text-white">
                        Website
                      </Title>
                      <Text className="text-blue-100">{websiteConfig?.contactInfo?.website || 'www.smartmall.site'}</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Contact Modal */}
        <Modal
          title="Liên hệ về quyền riêng tư"
          open={contactModalVisible}
          onCancel={() => setContactModalVisible(false)}
          footer={null}
          width={600}
        >
          <div className="space-y-4">
            <Alert
              message="Chúng tôi sẵn sàng hỗ trợ"
              description="Mọi yêu cầu về quyền riêng tư sẽ được xử lý trong vòng 72 giờ làm việc."
              type="info"
              showIcon
            />

            <div className="grid grid-cols-2 gap-4">
              <Card size="small">
                <Space direction="vertical" className="w-full">
                  <MailOutlined className="text-2xl text-blue-500" />
                  <Text strong>Email hỗ trợ</Text>
                  <Text type="secondary">lunashop.business.official@gmail.com</Text>
                </Space>
              </Card>

              <Card size="small">
                <Space direction="vertical" className="w-full">
                  <PhoneOutlined className="text-2xl text-green-500" />
                  <Text strong>Hotline</Text>
                  <Text type="secondary">0822387108</Text>
                </Space>
              </Card>
            </div>

            <Paragraph type="secondary">
              Khi liên hệ, vui lòng cung cấp thông tin tài khoản và mô tả rõ yêu cầu của bạn để chúng tôi có thể hỗ trợ nhanh chóng và chính
              xác nhất.
            </Paragraph>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
