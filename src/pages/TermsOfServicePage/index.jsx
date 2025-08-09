import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Shield, Users, AlertCircle, Scale, Mail } from 'lucide-react'
import titles from '@/utils/titles'
import { useSelector } from 'react-redux'

const TermsOfServicePage = () => {
  titles('Điều khoản dịch vụ')

  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = sectionId => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const sections = [
    {
      id: 'introduction',
      title: '1. Giới thiệu',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Chào mừng bạn đến với dịch vụ của chúng tôi. Bằng việc truy cập và sử dụng trang web này, 
        bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu bạn không đồng ý 
        với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
        
        Các điều khoản này có thể được cập nhật theo thời gian mà không cần thông báo trước. 
        Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn chấp nhận các điều khoản mới.
      `
    },
    {
      id: 'services',
      title: '2. Dịch vụ của chúng tôi',
      icon: <Users className="w-5 h-5" />,
      content: `
        Chúng tôi cung cấp nền tảng số cho phép người dùng:
        • Truy cập và sử dụng các tính năng của ứng dụng
        • Tạo tài khoản và quản lý thông tin cá nhân
        • Tương tác với người dùng khác trong cộng đồng
        • Sử dụng các công cụ và tính năng được cung cấp
        
        Chúng tôi có quyền thay đổi, tạm ngưng hoặc ngừng cung cấp bất kỳ dịch vụ nào 
        mà không cần thông báo trước.
      `
    },
    {
      id: 'user-responsibilities',
      title: '3. Trách nhiệm của người dùng',
      icon: <Shield className="w-5 h-5" />,
      content: `
        Khi sử dụng dịch vụ, bạn cam kết:
        • Cung cấp thông tin chính xác và cập nhật
        • Không sử dụng dịch vụ cho mục đích bất hợp pháp
        • Không vi phạm quyền của người khác
        • Không tải lên nội dung có hại, spam hoặc vi phạm bản quyền
        • Bảo mật thông tin đăng nhập của mình
        • Tuân thủ các quy định pháp luật hiện hành
        
        Việc vi phạm các quy định này có thể dẫn đến việc tạm khóa hoặc xóa tài khoản.
      `
    },
    {
      id: 'privacy',
      title: '4. Quyền riêng tư và bảo mật',
      icon: <AlertCircle className="w-5 h-5" />,
      content: `
        Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn:
        • Thu thập thông tin cần thiết để cung cấp dịch vụ
        • Sử dụng các biện pháp bảo mật tiên tiến
        • Không chia sẻ thông tin với bên thứ ba không được ủy quyền
        • Tuân thủ các quy định về bảo vệ dữ liệu cá nhân
        
        Để biết thêm chi tiết, vui lòng xem Chính sách bảo mật của chúng tôi.
      `
    },
    {
      id: 'limitations',
      title: '5. Giới hạn trách nhiệm',
      icon: <Scale className="w-5 h-5" />,
      content: `
        Trong phạm vi pháp luật cho phép:
        • Dịch vụ được cung cấp "như hiện có" không có bảo đảm
        • Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp
        • Trách nhiệm của chúng tôi được giới hạn ở mức phí bạn đã thanh toán
        • Chúng tôi không đảm bảo dịch vụ hoạt động liên tục không gián đoạn
        
        Bạn sử dụng dịch vụ với rủi ro của chính mình.
      `
    },
    {
      id: 'contact',
      title: '6. Liên hệ',
      icon: <Mail className="w-5 h-5" />,
      content: `
        Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:

        Email: ${websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}
        Điện thoại: ${websiteConfig?.contactInfo?.phone || '0823387108'}
        
        Chúng tôi sẽ phản hồi trong vòng 24-48 giờ làm việc.
      `
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b dark:bg-gray-800 rounded-tl-xl rounded-tr-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Điều Khoản Sử Dụng</h1>
              <p className="text-gray-600 text-sm dark:text-gray-300">Cập nhật lần cuối: 03/08/2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:outline-gray-600 dark:outline dark:outline-1 dark:outline-solid">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-200">Thông báo quan trọng</h2>
              <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                Vui lòng đọc kỹ các điều khoản sử dụng dưới đây trước khi sử dụng dịch vụ của chúng tôi. Việc tiếp tục sử dụng dịch vụ được
                coi là bạn đã đồng ý với tất cả các điều khoản này.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {sections.map(section => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:outline-gray-600 dark:outline dark:outline-1 dark:outline-solid"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors dark:hover:!bg-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{section.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{section.title}</h3>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections[section.id] && (
                <div className="px-6 pb-6">
                  <div className="pl-11">
                    <div className="prose prose-gray max-w-none">
                      {section.content.split('\n').map(
                        (paragraph, index) =>
                          paragraph.trim() && (
                            <p key={index} className="text-gray-600 leading-relaxed mb-3 whitespace-pre-line dark:text-gray-300">
                              {paragraph.trim()}
                            </p>
                          )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
