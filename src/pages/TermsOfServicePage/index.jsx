import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'

const TermsOfServicePage = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = sectionId => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const sections = [
    {
      id: 'introduction',
      title: '1. Giới thiệu',
      content: `
        Chào mừng bạn đến với dịch vụ của chúng tôi. Bằng việc truy cập và sử dụng trang web này, 
        bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu bạn không đồng ý 
        với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
        
        Các điều khoản này có thể được cập nhật theo thời gian mà không cần thông báo trước. 
        Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn chấp nhận các điều khoản mới.
      `,
    },
    {
      id: 'services',
      title: '2. Dịch vụ của chúng tôi',
      content: `
        Chúng tôi cung cấp nền tảng số cho phép người dùng:
        • Truy cập và sử dụng các tính năng của ứng dụng
        • Tạo tài khoản và quản lý thông tin cá nhân
        • Tương tác với người dùng khác trong cộng đồng
        • Sử dụng các công cụ và tính năng được cung cấp
        
        Chúng tôi có quyền thay đổi, tạm ngưng hoặc ngừng cung cấp bất kỳ dịch vụ nào 
        mà không cần thông báo trước.
      `,
    },
    {
      id: 'user-responsibilities',
      title: '3. Trách nhiệm của người dùng',
      content: `
        Khi sử dụng dịch vụ, bạn cam kết:
        • Cung cấp thông tin chính xác và cập nhật
        • Không sử dụng dịch vụ cho mục đích bất hợp pháp
        • Không vi phạm quyền của người khác
        • Không tải lên nội dung có hại, spam hoặc vi phạm bản quyền
        • Bảo mật thông tin đăng nhập của mình
        • Tuân thủ các quy định pháp luật hiện hành
        
        Việc vi phạm các quy định này có thể dẫn đến việc tạm khóa hoặc xóa tài khoản.
      `,
    },
    {
      id: 'privacy',
      title: '4. Quyền riêng tư và bảo mật',
      content: `
        Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn:
        • Thu thập thông tin cần thiết để cung cấp dịch vụ
        • Sử dụng các biện pháp bảo mật tiên tiến
        • Không chia sẻ thông tin với bên thứ ba không được ủy quyền
        • Tuân thủ các quy định về bảo vệ dữ liệu cá nhân
        
        Để biết thêm chi tiết, vui lòng xem Chính sách bảo mật của chúng tôi.
      `,
    },
    {
      id: 'limitations',
      title: '5. Giới hạn trách nhiệm',
      content: `
        Trong phạm vi pháp luật cho phép:
        • Dịch vụ được cung cấp "như hiện có" không có bảo đảm
        • Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp
        • Trách nhiệm của chúng tôi được giới hạn ở mức phí bạn đã thanh toán
        • Chúng tôi không đảm bảo dịch vụ hoạt động liên tục không gián đoạn
        
        Bạn sử dụng dịch vụ với rủi ro của chính mình.
      `,
    },
    {
      id: 'contact',
      title: '6. Liên hệ',
      content: `
        Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:

        Email: ${websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}
        Điện thoại: ${websiteConfig?.contactInfo?.phone || '0823387108'}
        
        Chúng tôi sẽ phản hồi trong vòng 24-48 giờ làm việc.
      `,
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Điều khoản dịch vụ"
        description="Điều khoản sử dụng dịch vụ của SmartMall."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <header className="mb-9 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Điều khoản
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-4xl">
            Điều khoản sử dụng
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Cập nhật lần cuối: 03/08/2025
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Thông báo quan trọng
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Vui lòng đọc kỹ các điều khoản sử dụng dưới đây trước khi sử dụng dịch vụ của chúng tôi.
            Việc tiếp tục sử dụng dịch vụ được coi là bạn đã đồng ý với tất cả các điều khoản này.
          </p>
        </div>

        <div className="space-y-3">
          {sections.map(section => {
            const isExpanded = expandedSections[section.id]

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>

                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-gray-700">
                    {section.content.split('\n').map(
                      (paragraph, index) =>
                        paragraph.trim() && (
                          <p
                            key={index}
                            className="mb-3 whitespace-pre-line text-sm leading-6 text-gray-600 last:mb-0 dark:text-gray-300"
                          >
                            {paragraph.trim()}
                          </p>
                        )
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage