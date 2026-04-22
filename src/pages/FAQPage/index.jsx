import React from 'react'
import { Collapse, Typography } from 'antd'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'

const { Title } = Typography
const { Panel } = Collapse

const FAQPage = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const faqData = [
    {
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Chọn sản phẩm, thêm vào giỏ, nhập thông tin và xác nhận thanh toán. Hỗ trợ qua Zalo/Hotline nếu cần.',
    },
    {
      question: 'Tôi có thể đổi trả trong bao lâu?',
      answer:
        'Thời hạn đổi trả tùy từng sản phẩm. Thông thường từ 7–30 ngày kể từ khi nhận hàng. Xem chi tiết tại trang Chính sách đổi trả.',
    },
    {
      question: 'Thời gian nhận hàng là bao lâu?',
      answer: 'Thông thường 1–3 ngày tại nội thành, 3–7 ngày với tỉnh/thành khác. Lễ/tết có thể chậm hơn.',
    },
    {
      question: 'Làm sao kiểm tra tình trạng đơn hàng?',
      answer: 'Vào mục "Đơn hàng của tôi" trên web hoặc liên hệ hotline/Zalo để được hỗ trợ tra cứu.',
    },
    {
      question: 'Nếu sản phẩm bị lỗi tôi phải làm sao?',
      answer: 'Vui lòng liên hệ hỗ trợ trong vòng 24h kể từ khi nhận hàng, gửi hình ảnh/clip để được xử lý đổi/trả nhanh nhất.',
    },
    {
      question: 'Phí giao hàng như thế nào?',
      answer: 'Phí ship được tính tùy khu vực và đơn vị vận chuyển.',
    },
    {
      question: 'Chính sách bảo hành ra sao?',
      answer: 'Tùy từng sản phẩm sẽ có bảo hành 1-12 tháng. Chi tiết xem trên từng sản phẩm hoặc liên hệ shop.',
    },
    {
      question: 'Có chương trình khuyến mãi không?',
      answer: 'Chúng tôi thường xuyên cập nhật ưu đãi trên banner trang chủ, hoặc trong mục "Mã giảm giá".',
    },
    {
      question: 'Có hỗ trợ khách lẻ không?',
      answer: 'Có, chúng tôi bán cả sỉ và lẻ. Khách sỉ vui lòng liên hệ để nhận báo giá tốt nhất.',
    },
    {
      question: 'Thời gian hỗ trợ khách hàng?',
      answer: 'Từ 8h00 đến 21h00 mỗi ngày (cả Thứ 7, CN). Hỗ trợ ngoài giờ qua Zalo/Inbox sẽ phản hồi sớm nhất.',
    },
    {
      question: 'Liên hệ hỗ trợ ở đâu?',
      answer: `Gọi hotline hoặc nhắn Zalo ${
        websiteConfig?.contactInfo?.phone || '0823387108'
      }. Fanpage, email cũng luôn sẵn sàng hỗ trợ bạn.`,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SEO
        title="Câu hỏi thường gặp"
        description="Giải đáp mọi thắc mắc về SmartMall: cách mua hàng, thanh toán, bảo hành, hỗ trợ khách hàng."
      />

      <div className="mb-9 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          FAQ
        </p>

        <Title
          level={2}
          className="!mb-0 !text-3xl !font-semibold !tracking-[-0.03em] !text-gray-900 dark:!text-white"
        >
          Câu hỏi thường gặp
        </Title>

        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Một số câu hỏi phổ biến về mua hàng, giao hàng, đổi trả và hỗ trợ khách hàng.
        </p>
      </div>

      <Collapse
        accordion
        bordered={false}
        expandIconPosition="end"
        className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        {faqData.map((faq, idx) => (
          <Panel
            key={idx}
            header={
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {faq.question}
              </span>
            }
            className="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
          >
            <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {faq.answer}
            </p>
          </Panel>
        ))}
      </Collapse>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Chưa tìm thấy câu trả lời?{' '}
          <Link
            to="/contact"
            className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
          >
            Liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  )
}

export default FAQPage