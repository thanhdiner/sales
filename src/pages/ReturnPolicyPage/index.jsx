import React, { useState } from 'react'
import {
  Typography,
  Card,
  Row,
  Col,
  Steps,
  Timeline,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Space,
  Tag,
  Divider,
  Collapse,
  Table
} from 'antd'
import {
  SwapOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  SafetyOutlined,
  FileTextOutlined,
  TruckOutlined,
  SearchOutlined
} from '@ant-design/icons'
import SEO from '@/components/SEO'
import { Grid } from 'antd'
const { useBreakpoint } = Grid

const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { Panel } = Collapse

const ReturnPolicyPage = () => {
  const screens = useBreakpoint()
  const isMobile = !screens.mdconst [requestModalVisible, setRequestModalVisible] = useState(false)
  const [trackingModalVisible, setTrackingModalVisible] = useState(false)
  const [form] = Form.useForm()

  const returnSteps = [
    {
      title: <span className="dark:text-gray-100">Yêu cầu đổi trả</span>,
      description: <span className="dark:text-gray-300">Gửi yêu cầu qua website hoặc hotline</span>,
      icon: <FileTextOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Xác nhận yêu cầu</span>,
      description: <span className="dark:text-gray-300">Chúng tôi sẽ xác nhận trong 24h</span>,
      icon: <CheckCircleOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Gửi sản phẩm</span>,
      description: <span className="dark:text-gray-300">Đóng gói và gửi sản phẩm về</span>,
      icon: <TruckOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Kiểm tra & xử lý</span>,
      description: <span className="dark:text-gray-300">Kiểm tra sản phẩm và xử lý yêu cầu</span>,
      icon: <ExclamationCircleOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Hoàn tất</span>,
      description: <span className="dark:text-gray-300">Đổi sản phẩm mới hoặc hoàn tiền</span>,
      icon: <DollarOutlined />
    }
  ]

  const onlineSteps = [
    {
      title: <span className="dark:text-gray-100">Gửi yêu cầu hỗ trợ</span>,
      description: <span className="dark:text-gray-300">Liên hệ qua website, Zalo hoặc email</span>,
      icon: <FileTextOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Xác minh & kiểm tra</span>,
      description: <span className="dark:text-gray-300">Kiểm tra trạng thái giao dịch & tài khoản</span>,
      icon: <SearchOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Xử lý & phản hồi</span>,
      description: <span className="dark:text-gray-300">Sửa lỗi, kích hoạt lại, cấp lại dịch vụ hoặc hoàn tiền nếu đủ điều kiện</span>,
      icon: <SafetyOutlined />
    },
    {
      title: <span className="dark:text-gray-100">Hoàn tất</span>,
      description: <span className="dark:text-gray-300">Kết thúc yêu cầu, xác nhận với khách hàng</span>,
      icon: <CheckCircleOutlined />
    }
  ]

  const returnReasons = [
    { value: 'defective', label: 'Sản phẩm bị lỗi/hỏng', color: 'red' },
    { value: 'wrong-item', label: 'Giao sai sản phẩm', color: 'orange' },
    { value: 'not-as-described', label: 'Không đúng mô tả', color: 'yellow' },
    { value: 'size-issue', label: 'Không vừa size', color: 'blue' },
    { value: 'change-mind', label: 'Thay đổi ý định', color: 'green' },
    { value: 'damaged-shipping', label: 'Hư hỏng khi vận chuyển', color: 'purple' }
  ]

  const refundMethods = [
    {
      method: 'Chuyển khoản ngân hàng',
      time: '2-3 tiếng làm việc',
      fee: 'Miễn phí',
      icon: '🏦',
      popular: true
    },
    {
      method: 'Ví điện tử (MoMo, ZaloPay)',
      time: '2-3 tiếng làm việc',
      fee: 'Miễn phí',
      icon: '📱',
      popular: true
    },
    {
      method: 'Tiền mặt tại cửa hàng',
      time: 'Ngay lập tức',
      fee: 'Miễn phí',
      icon: '💵',
      popular: false
    }
  ]

  const productCategories = [
    {
      category: 'Điện tử & Công nghệ',
      returnPeriod: '1-15 ngày (tùy loại)',
      conditions: ['Còn nguyên seal', 'Đầy đủ phụ kiện', 'Có hóa đơn'],
      specialNotes: 'Không áp dụng cho phần mềm đã kích hoạt'
    },
    {
      category: 'Thời trang & Phụ kiện',
      returnPeriod: '1-30 ngày (tùy loại)',
      conditions: ['Chưa qua sử dụng', 'Còn nguyên tag', 'Không bị bẩn/hỏng'],
      specialNotes: 'Đồ lót, tất vớ không được đổi trả'
    },
    {
      category: 'Mỹ phẩm & Sức khỏe',
      returnPeriod: '1-7 ngày (tùy loại)',
      conditions: ['Chưa mở nắp', 'Còn nguyên seal', 'Không dị ứng'],
      specialNotes: 'Chỉ đổi trả khi có lỗi từ nhà sản xuất'
    },
    {
      category: 'Đồ gia dụng',
      returnPeriod: '1-20 ngày (tùy loại)',
      conditions: ['Còn nguyên vẹn', 'Đầy đủ phụ kiện', 'Chưa sử dụng'],
      specialNotes: 'Đồ thủy tinh phải đóng gói cẩn thận'
    },
    {
      category: 'Sách & Văn phòng phẩm',
      returnPeriod: '1-14 ngày (tùy loại)',
      conditions: ['Không bị rách/bẩn', 'Chưa viết/đánh dấu', 'Còn nguyên vẹn'],
      specialNotes: 'Sách điện tử không được hoàn trả'
    },
    {
      category: 'Dịch vụ online / Tài khoản / Phần mềm',
      returnPeriod: '1-3 ngày (tùy loại)',
      conditions: ['Chưa kích hoạt hoặc chưa sử dụng', 'Lỗi kỹ thuật không sử dụng được', 'Giao nhầm, mua nhầm gói và chưa dùng'],
      specialNotes:
        'Không hoàn/đổi nếu đã kích hoạt hoặc đã sử dụng thành công. Không áp dụng khi vi phạm điều khoản sử dụng hoặc bị khóa do người dùng.'
    }
  ]

  const faqData = [
    {
      question: 'Tôi có thể đổi trả sản phẩm mua từ chương trình khuyến mãi không?',
      answer:
        'Có, bạn có thể đổi trả sản phẩm khuyến mãi theo chính sách thông thường. Tuy nhiên, số tiền hoàn lại sẽ là giá đã giảm, không phải giá gốc.'
    },
    {
      question: 'Chi phí vận chuyển khi đổi trả do ai chịu?',
      answer:
        'Nếu lỗi từ chúng tôi (giao sai hàng, sản phẩm lỗi), chúng tôi sẽ chịu phí vận chuyển. Nếu do thay đổi ý định của khách hàng, khách hàng sẽ chịu phí vận chuyển.'
    },
    {
      question: 'Tôi có thể đổi sang sản phẩm khác có giá trị cao hơn không?',
      answer:
        'Có, bạn có thể đổi sang sản phẩm có giá cao hơn bằng cách bù thêm phần chênh lệch. Chúng tôi sẽ tính toán và thông báo số tiền cần bù.'
    },
    {
      question: 'Thời gian xử lý đổi trả mất bao lâu?',
      answer:
        'Thông thường 5-7 ngày làm việc kể từ khi chúng tôi nhận được sản phẩm. Trong thời gian cao điểm có thể kéo dài thêm 2-3 ngày.'
    },
    {
      question: 'Tôi có thể hủy yêu cầu đổi trả đã gửi không?',
      answer:
        'Có, bạn có thể hủy yêu cầu trước khi gửi sản phẩm về. Sau khi sản phẩm đã được gửi đi, việc hủy sẽ phụ thuộc vào tình trạng xử lý.'
    }
  ]

  const trackingStatuses = [
    { status: 'Đã tiếp nhận', time: '10:30 - 15/08/2025', icon: '📋' },
    { status: 'Đang xác minh', time: '14:20 - 15/08/2025', icon: '🔍' },
    { status: 'Chờ sản phẩm về kho', time: '09:15 - 16/08/2025', icon: '📦' },
    { status: 'Đang kiểm tra sản phẩm', time: '', icon: '⏳' },
    { status: 'Hoàn tất xử lý', time: '', icon: '✅' }
  ]

  const handleReturnRequest = values => {
    console.log('Return request:', values)
    Modal.success({
      title: 'Yêu cầu đã được gửi!',
      content: 'Mã yêu cầu của bạn là RT2025080001. Chúng tôi sẽ liên hệ trong vòng 24h.'
    })
    setRequestModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: 'Danh mục sản phẩm',
      dataIndex: 'category',
      key: 'category',
      render: text => <Text strong>{text}</Text>
    },
    {
      title: 'Thời hạn đổi trả',
      dataIndex: 'returnPeriod',
      key: 'returnPeriod',
      render: text => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Điều kiện',
      dataIndex: 'conditions',
      key: 'conditions',
      render: conditions => (
        <div>
          {conditions.map((condition, index) => (
            <div key={index} className="text-xs text-gray-600 dark:text-gray-300">
              • {condition}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Lưu ý đặc biệt',
      dataIndex: 'specialNotes',
      key: 'specialNotes',
      render: text => (
        <Text type="secondary" className="text-xs">
          {text}
        </Text>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title="Chính sách đổi trả"
        description="Chính sách đổi trả hàng tại SmartMall – rõ ràng, minh bạch, bảo vệ quyền lợi khách hàng." />
            <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <SwapOutlined className="text-3xl text-white" />
          </div>
          <Title level={1} className="!text-4xl !text-gray-800 !mb-4">
            Chính Sách Đổi Trả & Hoàn Tiền
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với chính sách đổi trả linh hoạt và thuận tiện
          </Paragraph>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Tag color="green" className="px-3 py-1">
              <CheckCircleOutlined className="mr-1" />
              Đổi trả miễn phí
            </Tag>
            <Tag color="blue" className="px-3 py-1">
              <ClockCircleOutlined className="mr-1" />
              Thời hạn tùy loại sản phẩm
            </Tag>
            <Tag color="orange" className="px-3 py-1">
              <DollarOutlined className="mr-1" />
              Hoàn tiền nhanh chóng
            </Tag>
          </div>

          <div className="mt-6 space-x-4">
            <Button type="primary" size="large" icon={<SwapOutlined />} onClick={() => window.open('https://zalo.me/0823387108', '_blank')}>
              Yêu cầu đổi trả
            </Button>
          </div>
        </div>

        {/* Process Steps */}
        <Card className="mb-8 shadow-lg rounded-xl dark:bg-gray-800">
          <Title level={2} className="text-center !text-2xl !mb-8">
            <SwapOutlined className="mr-3 text-green-500" />
            Quy Trình Đổi Trả (Hàng Vật Lý)
          </Title>
          <Steps
            current={-1}
            items={returnSteps}
            direction={isMobile ? 'vertical' : 'horizontal'}
            size={isMobile ? 'small' : 'default'}
            className="mb-6"
          />
          <Alert
            message={<span className="dark:text-gray-100">Lưu ý quan trọng</span>}
            description={
              <span className="dark:text-gray-300">
                Vui lòng giữ nguyên tình trạng sản phẩm và đóng gói cẩn thận khi gửi về để đảm bảo quá trình xử lý nhanh chóng.
              </span>
            }
            type="info"
            showIcon
            className="mt-6 dark:bg-gray-800"
          />
        </Card>

        <Card className="mb-8 shadow-lg rounded-xl dark:bg-gray-800">
          <Title level={2} className="text-center !text-2xl !mb-8">
            <SafetyOutlined className="mr-3 text-blue-500" />
            Quy Trình Xử Lý Dịch Vụ Online / Tài Khoản / Phần Mềm
          </Title>
          <Steps
            current={-1}
            items={onlineSteps}
            direction={isMobile ? 'vertical' : 'horizontal'}
            size={isMobile ? 'small' : 'default'}
            className="mb-6"
          />
          <Alert
            message={<span className="dark:text-gray-100">Lưu ý</span>}
            description={
              <>
                <div className="dark:text-gray-300">
                  <strong>Lưu ý:</strong> Một số sản phẩm số, phần mềm bản quyền, tài khoản số, dịch vụ nâng cấp online…{' '}
                  <b>chỉ hỗ trợ hoàn tiền/đổi mới khi phát sinh lỗi từ hệ thống hoặc không sử dụng được</b>. Vui lòng liên hệ CSKH để được
                  tư vấn cụ thể từng trường hợp.
                </div>
                <div className="mt-2 dark:text-gray-300">
                  Sau khi dịch vụ đã được kích hoạt thành công, một số sản phẩm không áp dụng hoàn tiền theo quy định của nhà phát hành.
                </div>
              </>
            }
            type="warning"
            showIcon
            className="mt-6 dark:bg-gray-800"
          />
        </Card>

        <Row gutter={[24, 24]} className="mb-8">
          {/* Return Conditions */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <CheckCircleOutlined className="text-green-500" />
                  <span className="dark:text-gray-100">Điều Kiện Đổi Trả</span>
                </Space>
              }
              className="h-full shadow-md rounded-lg dark:bg-gray-800"
            >
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-gray-800 dark:outline dark:outline-gray-600 dark:outline-1 dark:outline-solid">
                  <Title level={5} className="!text-green-700 !mb-2">
                    ✅ Được chấp nhận
                  </Title>
                  <div>
                    <Text strong className="block mb-1">
                      Hàng vật lý:
                    </Text>
                    <ul className="space-y-1 text-sm text-green-600">
                      <li>• Sản phẩm còn nguyên vẹn, chưa sử dụng</li>
                      <li>• Đầy đủ bao bì, nhãn mác, phụ kiện</li>
                      <li>• Có hóa đơn mua hàng hợp lệ</li>
                      <li>• Trong thời hạn đổi trả quy định từng loại sản phẩm</li>
                      <li>• Lý do chính đáng (lỗi kỹ thuật, giao sai, hư hỏng vận chuyển)</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <Text strong className="block mb-1">
                      Dịch vụ online, tài khoản, phần mềm:
                    </Text>
                    <ul className="space-y-1 text-sm text-green-600">
                      <li>• Dịch vụ/tài khoản chưa kích hoạt hoặc không sử dụng được do lỗi hệ thống</li>
                      <li>• Tài khoản/bản quyền chưa sử dụng hoặc bị lỗi kỹ thuật khi nhận</li>
                      <li>• Giao nhầm/mua nhầm gói dịch vụ và chưa kích hoạt</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-gray-800 dark:outline dark:outline-gray-600 dark:outline-1 dark:outline-solid">
                  <Title level={5} className="!text-red-700 !mb-2">
                    ❌ Không được chấp nhận
                  </Title>
                  <div>
                    <Text strong className="block mb-1">
                      Hàng vật lý:
                    </Text>
                    <ul className="space-y-1 text-sm text-red-600">
                      <li>• Sản phẩm đã qua sử dụng, bị bẩn/hư hỏng bởi người dùng</li>
                      <li>• Thiếu phụ kiện, bao bì gốc hoặc không còn nhãn mác</li>
                      <li>• Quá thời hạn đổi trả</li>
                      <li>• Sản phẩm theo yêu cầu riêng (đặt làm, cá nhân hóa)</li>
                      <li>• Đồ lót, mỹ phẩm, sản phẩm đã mở seal hoặc đã dùng thử</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <Text strong className="block mb-1">
                      Dịch vụ online, tài khoản, phần mềm:
                    </Text>
                    <ul className="space-y-1 text-sm text-red-600">
                      <li>• Đã kích hoạt/bắt đầu sử dụng dịch vụ thành công</li>
                      <li>• Đã chuyển nhượng/tặng/giao dịch lại cho người khác</li>
                      <li>• Vi phạm điều khoản sử dụng, bị khóa/banned do lỗi người dùng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Refund Methods */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <DollarOutlined className="text-blue-500" />
                  <span className="dark:text-gray-100">Phương Thức Hoàn Tiền</span>
                </Space>
              }
              className="h-full shadow-md rounded-lg dark:bg-gray-800"
            >
              <div className="space-y-3">
                {refundMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      method.popular ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    } dark:bg-gray-800 dark:outline-gray-600 dark:outline-1 dark:outline-solid dark:outline`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Space>
                        <span className="text-xl">{method.icon}</span>
                        <Text strong>{method.method}</Text>
                        {method.popular && (
                          <Tag color="blue" size="small">
                            Phổ biến
                          </Tag>
                        )}
                      </Space>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div>⏱️ Thời gian: {method.time}</div>
                      <div>💰 Phí: {method.fee}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Product Categories Table */}
        <Card className="mb-8 shadow-lg rounded-xl dark:bg-gray-800">
          <Title level={2} className="!text-2xl !mb-6">
            <ShoppingCartOutlined className="mr-3 text-purple-500" />
            Thời Hạn Đổi Trả Theo Danh Mục
          </Title>

          <Table dataSource={productCategories} columns={columns} pagination={false} className="mb-4" scroll={{ x: 800 }} />

          <Alert
            message={<span className="dark:text-gray-100">Thông tin bổ sung</span>}
            description={
              <span className="dark:text-gray-300">
                Thời hạn đổi trả được tính từ ngày nhận hàng. Các sản phẩm trong chương trình clearance sale có thể có thời hạn đổi trả ngắn
                hơn.
              </span>
            }
            type="warning"
            showIcon
            className="mt-4 dark:bg-gray-800"
          />
        </Card>

        {/* Return Reasons */}
        <Card className="mb-8 shadow-lg rounded-xl dark:bg-gray-800">
          <Title level={2} className="!text-2xl !mb-6">
            <ExclamationCircleOutlined className="mr-3 text-orange-500" />
            Lý Do Đổi Trả Phổ Biến
          </Title>

          <Row gutter={[16, 16]}>
            {returnReasons.map((reason, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card size="small" className="text-center hover:shadow-md transition-shadow dark:bg-gray-800">
                  <Tag color={reason.color} className="mb-2">
                    {reason.label}
                  </Tag>
                  <Paragraph className="text-xs text-gray-500 !mb-0">Nhấn để chọn lý do này khi tạo yêu cầu đổi trả</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8 shadow-lg rounded-xl dark:bg-gray-800">
          <Title level={2} className="!text-2xl !mb-6">
            <QuestionCircleOutlined className="mr-3 text-red-500" />
            Câu Hỏi Thường Gặp
          </Title>

          <Collapse ghost>
            {faqData.map((faq, index) => (
              <Panel header={<span className="dark:text-gray-100">{faq.question}</span>} key={index}>
                <Text>{faq.answer}</Text>
              </Panel>
            ))}
          </Collapse>
        </Card>

        {/* Contact & Support */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title={<span className="dark:text-gray-100">💡 Mẹo Đổi Trả Thành Công</span>}
              className="h-full shadow-md rounded-lg dark:bg-gray-800"
            >
              <Timeline
                size="small"
                className="dark:text-gray-300"
                items={[
                  {
                    children: 'Chụp ảnh sản phẩm trước khi đóng gói'
                  },
                  {
                    children: 'Giữ nguyên bao bì và phụ kiện'
                  },
                  {
                    children: 'Đóng gói cẩn thận để tránh hư hỏng'
                  },
                  {
                    children: 'Giữ lại biên lai vận chuyển'
                  },
                  {
                    children: 'Theo dõi trạng thái qua mã yêu cầu'
                  }
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={<span className="dark:text-gray-100">📞 Hỗ Trợ Khách Hàng</span>}
              className="h-full shadow-md rounded-lg dark:bg-gray-800"
            >
              <Space direction="vertical" className="w-full">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-gray-600 dark:outline-1 dark:outline-solid">
                  <Space>
                    <PhoneOutlined className="text-blue-500" />
                    <span className="dark:text-gray-100">Hotline đổi trả</span>
                  </Space>
                  <Text strong>0823387108</Text>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-gray-600 dark:outline-1 dark:outline-solid">
                  <Space>
                    <MailOutlined className="text-green-500" />
                    <span className="dark:text-gray-100">Email hỗ trợ</span>
                  </Space>
                  <Text strong>lunashop.business.official@gmail.com</Text>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg dark:bg-gray-800 dark:outline dark:outline-gray-600 dark:outline-1 dark:outline-solid">
                  <Space>
                    <ClockCircleOutlined className="text-orange-500" />
                    <span className="dark:text-gray-100">Thời gian hỗ trợ</span>
                  </Space>
                  <Text strong>8:00 - 21:00</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Return Request Modal */}
        <Modal
          title="Tạo Yêu Cầu Đổi Trả"
          open={requestModalVisible}
          onCancel={() => setRequestModalVisible(false)}
          footer={null}
          width={700}
        >
          <Form form={form} layout="vertical" onFinish={handleReturnRequest}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="orderNumber" label="Mã đơn hàng" rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}>
                  <Input placeholder="VD: ORD2025080001" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input placeholder="your@email.com" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="reason" label="Lý do đổi trả" rules={[{ required: true, message: 'Vui lòng chọn lý do' }]}>
              <Select placeholder="Chọn lý do đổi trả">
                {returnReasons.map(reason => (
                  <Option key={reason.value} value={reason.value}>
                    {reason.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng mô tả chi tiết' }]}>
              <TextArea rows={4} placeholder="Mô tả tình trạng sản phẩm, lý do cụ thể..." />
            </Form.Item>

            <Form.Item name="images" label="Hình ảnh sản phẩm">
              <Upload listType="picture" multiple beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
              <Text type="secondary" className="text-xs block mt-1">
                Tối đa 5 ảnh, mỗi ảnh không quá 2MB
              </Text>
            </Form.Item>

            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setRequestModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  Gửi yêu cầu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Tracking Modal */}
        <Modal
          title="Tra Cứu Trạng Thái Đổi Trả"
          open={trackingModalVisible}
          onCancel={() => setTrackingModalVisible(false)}
          footer={null}
          width={600}
        >
          <div className="mb-4">
            <Input.Search placeholder="Nhập mã yêu cầu đổi trả (VD: RT2025080001)" enterButton="Tra cứu" size="large" />
          </div>

          <Divider />

          <div className="mb-4">
            <Text strong>Mã yêu cầu: </Text>
            <Text code>RT2025080001</Text>
            <Tag color="processing" className="ml-2">
              Đang xử lý
            </Tag>
          </div>

          <Timeline
            items={trackingStatuses.map((status, index) => ({
              color: status.time ? 'green' : 'gray',
              children: (
                <div>
                  <Text strong>
                    {status.icon} {status.status}
                  </Text>
                  {status.time && (
                    <>
                      <br />
                      <Text type="secondary" className="text-sm">
                        {status.time}
                      </Text>
                    </>
                  )}
                </div>
              )
            }))}
          />

          <Alert
            message="Ước tính hoàn tất"
            description="Yêu cầu của bạn dự kiến được hoàn tất trong 2-3 ngày làm việc tới."
            type="info"
            showIcon
            className="mt-4"
          />
        </Modal>

        {/* Footer CTA */}
        <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
          <Title level={3} className="!mb-4">
            Cần hỗ trợ thêm?
          </Title>
          <Paragraph className="text-gray-600 mb-6">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7</Paragraph>
          <Space size="large">
            <Button type="primary" size="large" icon={<PhoneOutlined />} onClick={() => window.open('tel:0823387108', '_self')}>
              Gọi hotline
            </Button>
            <Button
              size="large"
              icon={<MailOutlined />}
              onClick={() => window.open('mailto:lunashop.business.official@gmail.com', '_blank')}
            >
              Gửi email
            </Button>
            <Button size="large" icon={<QuestionCircleOutlined />} onClick={() => window.open('/faq', '_blank')}>
              FAQ chi tiết
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicyPage
