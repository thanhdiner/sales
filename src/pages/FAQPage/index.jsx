import React from 'react'
import { Collapse, Typography } from 'antd'
import {
  QuestionCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  ContactsOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'

const { Title } = Typography
const { Panel } = Collapseconst FAQPage = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const faqData = [
    {
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Chọn sản phẩm, thêm vào giỏ, nhập thông tin và xác nhận thanh toán. Hỗ trợ qua Zalo/Hotline nếu cần.',
      icon: <CheckCircleOutlined className="text-blue-400" />
    },
    {
      question: 'Tôi có thể đổi trả trong bao lâu?',
      answer:
        'Thời hạn đổi trả tùy từng sản phẩm. Thông thường từ 7–30 ngày kể từ khi nhận hàng. Xem chi tiết tại trang Chính sách đổi trả.',
      icon: <ReloadOutlined className="text-yellow-400" />
    },
    {
      question: 'Thời gian nhận hàng là bao lâu?',
      answer: 'Thông thường 1–3 ngày tại nội thành, 3–7 ngày với tỉnh/thành khác. Lễ/tết có thể chậm hơn.',
      icon: <ClockCircleOutlined className="text-green-500" />
    },
    {
      question: 'Làm sao kiểm tra tình trạng đơn hàng?',
      answer: 'Vào mục "Đơn hàng của tôi" trên web hoặc liên hệ hotline/Zalo để được hỗ trợ tra cứu.',
      icon: <FieldTimeOutlined className="text-pink-400" />
    },
    {
      question: 'Nếu sản phẩm bị lỗi tôi phải làm sao?',
      answer: 'Vui lòng liên hệ hỗ trợ trong vòng 24h kể từ khi nhận hàng, gửi hình ảnh/clip để được xử lý đổi/trả nhanh nhất.',
      icon: <CustomerServiceOutlined className="text-red-400" />
    },
    {
      question: 'Phí giao hàng như thế nào?',
      answer: 'Phí ship được tính tùy khu vực và đơn vị vận chuyển.',
      icon: <DollarOutlined className="text-orange-500" />
    },
    {
      question: 'Chính sách bảo hành ra sao?',
      answer: 'Tùy từng sản phẩm sẽ có bảo hành 1-12 tháng. Chi tiết xem trên từng sản phẩm hoặc liên hệ shop.',
      icon: <ContactsOutlined className="text-green-500" />
    },
    {
      question: 'Có chương trình khuyến mãi không?',
      answer: 'Chúng tôi thường xuyên cập nhật ưu đãi trên banner trang chủ, hoặc trong mục "Mã giảm giá".',
      icon: <GiftOutlined className="text-purple-500" />
    },
    {
      question: 'Có hỗ trợ khách lẻ không?',
      answer: 'Có, chúng tôi bán cả sỉ và lẻ. Khách sỉ vui lòng liên hệ để nhận báo giá tốt nhất.',
      icon: <CheckCircleOutlined className="text-blue-400" />
    },
    {
      question: 'Thời gian hỗ trợ khách hàng?',
      answer: 'Từ 8h00 đến 21h00 mỗi ngày (cả Thứ 7, CN). Hỗ trợ ngoài giờ qua Zalo/Inbox sẽ phản hồi sớm nhất.',
      icon: <CustomerServiceOutlined className="text-red-400" />
    },
    {
      question: 'Liên hệ hỗ trợ ở đâu?',
      answer: `Gọi hotline hoặc nhắn Zalo ${
        websiteConfig?.contactInfo?.phone || '0823387108'
      }. Fanpage, email cũng luôn sẵn sàng hỗ trợ bạn.`,
      icon: <CustomerServiceOutlined className="text-red-400" />
    }
  ]

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-blue-50 rounded-2xl shadow-md dark:bg-gray-800">
      <SEO title="Câu hỏi thường gặp"
        description="Giải đáp mọi thắc mắc về SmartMall: cách mua hàng, thanh toán, bảo hành, hỗ trợ khách hàng." />
            <div className="text-center mb-8">
        <QuestionCircleOutlined className="text-4xl text-blue-500 mb-2 animate-bounce" />
        <Title level={2} className="!text-blue-600 !font-bold">
          Câu hỏi thường gặp
        </Title>
      </div>
      <Collapse
        accordion
        bordered={false}
        className="bg-white rounded-xl shadow dark:bg-gray-800"
        expandIconPosition="left"
        style={{ boxShadow: '0 4px 32px rgba(80, 170, 255, 0.06)' }}
      >
        {faqData.map((faq, idx) => (
          <Panel
            header={
              <div className="flex items-center gap-2 hover:text-blue-600 transition">
                {faq.icon}
                <span className="font-medium dark:text-gray-300">{faq.question}</span>
              </div>
            }
            key={idx}
            className="!rounded-xl !mb-2 !overflow-hidden dark:bg-gray-800"
            style={{
              // background: '#f8fbff',
              border: 'none',
              marginBottom: 12,
              borderRadius: 16,
              overflow: 'hidden'
            }}
          >
            <p className="text-gray-600 text-base leading-relaxed dark:text-gray-400">{faq.answer}</p>
          </Panel>
        ))}
      </Collapse>
      <div className="text-center text-sm text-gray-500 mt-6">
        <span>Chưa tìm thấy câu trả lời? </span>
        <Link to="/contact" className="text-blue-500 hover:underline">
          Liên hệ ngay với chúng tôi
        </Link>
      </div>
    </div>
  )
}

export default FAQPage
