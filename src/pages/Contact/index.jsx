import React, { useState, useEffect } from 'react'
import { FaFacebook, FaEnvelope } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'
import { Clock, AlertCircle, Zap, Shield, Heart, Star, Phone, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import titles from '@/utils/titles'

const sellers = [
  {
    name: 'Smartmall Gdv 1',
    role: 'Chuyên phần mềm bản quyền',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: SiZalo,
        title: 'Zalo',
        description: 'Nhắn tin qua Zalo',
        value: '0823387108',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'bg-cyan-50',
        action: 'Nhắn Zalo',
        link: 'https://zalo.me/0823387108'
      },
      {
        icon: FaFacebook,
        title: 'Facebook',
        description: 'Chat Facebook',
        value: 'fb.com/lunashop.business.official',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        action: 'Chat FB',
        link: 'https://www.facebook.com/lunashop.business.official'
      },
      {
        icon: FaEnvelope,
        title: 'Email',
        description: 'Gửi email',
        value: 'smartmall.business.official@gmail.com',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        action: 'Gửi email',
        link: 'mailto:smartmall.business.official@gmail.com'
      }
    ]
  },
  {
    name: 'Smartmall Gdv 2',
    role: 'Chuyên tư vấn & hỗ trợ đơn hàng',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: SiZalo,
        title: 'Zalo',
        description: 'Nhắn tin qua Zalo',
        value: '0822516521',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'bg-cyan-50',
        action: 'Nhắn Zalo',
        link: 'https://zalo.me/0822516521'
      },
      {
        icon: FaFacebook,
        title: 'Facebook',
        description: 'Chat Facebook',
        value: 'fb.com/smartmall.world',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        action: 'Chat FB',
        link: 'https://www.facebook.com/smartmall.world'
      },
      {
        icon: FaEnvelope,
        title: 'Email',
        description: 'Gửi email',
        value: 'thib@email.com',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        action: 'Gửi email',
        link: 'mailto:thib@email.com'
      }
    ]
  }
]

const ContactPage = () => {
  titles('Contact')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => setIsVisible(true), [])

  const workingHours = [
    { day: 'Thứ 2 - Thứ 6', time: '8:00 - 21:00' },
    { day: 'Thứ 7', time: '9:00 - 21:00' },
    { day: 'Chủ nhật', time: '10:00 - 21:00' }
  ]

  const faqs = [
    {
      question: 'Làm sao để đặt hàng?',
      answer: 'Bạn có thể liên hệ qua Facebook, Zalo hoặc email. Mình sẽ tư vấn và hướng dẫn chi tiết.'
    },
    {
      question: 'Thanh toán như thế nào?',
      answer: 'Chúng mình nhận thanh toán qua ngân hàng, ví điện tử (MoMo, ZaloPay).'
    },
    {
      question: 'Bao lâu nhận được hàng?',
      answer: 'Thông thường trong ngày, tối đa 24h. Với tài khoản phần mềm thì gần như ngay lập tức.'
    },
    {
      question: 'Có bảo hành không?',
      answer:
        'Tùy sản phẩm sẽ có hoặc không có bảo hành. Bạn vui lòng xem thông tin chi tiết ở từng sản phẩm. Nếu sản phẩm có bảo hành, shop sẽ ghi rõ thời gian và điều kiện bảo hành trong phần mô tả.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden dark:from-gray-800 dark:to-gray-800">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div
          className={`text-center py-20 px-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <MessageCircle className="w-4 h-4 mr-2" />
              Sẵn sàng hỗ trợ bạn 24/7
            </div>
            <div className="relative mb-8">
              <div className="inline-block p-8 bg-white/80 rounded-3xl shadow-2xl border border-white/50">
                <div className="relative">
                  <Phone className="w-16 h-16 text-blue-600 mx-auto" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              Liên hệ với chúng mình
            </h1>
            <p className="dark:text-gray-300 text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
              Có thắc mắc gì về sản phẩm? Cần tư vấn? Hay chỉ đơn giản muốn chat? Mình luôn sẵn sàng lắng nghe và hỗ trợ bạn một cách tận
              tình nhất!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/70 rounded-2xl p-4 shadow-lg border border-white/50 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{'< 3h'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Thời gian phản hồi</div>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 shadow-lg border border-white/50 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Bảo mật thông tin</div>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 shadow-lg border border-white/50 md:col-span-1 col-span-2 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Hỗ trợ tận tâm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cách liên hệ nhanh nhất (nhiều người bán) */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="dark:text-gray-100 text-3xl font-bold text-gray-800 mb-4">Cách liên hệ nhanh nhất</h2>
              <p className="dark:text-gray-300 text-gray-600 text-lg">Chọn đúng người, đúng chuyên môn để được hỗ trợ nhanh nhất!</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {sellers.map((seller, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 dark:bg-gray-800 dark:border-gray-600 dark:border-1 dark:border-solid"
                >
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover mb-3"
                  />
                  <div className="text-xl font-bold text-blue-700 mb-1">{seller.name}</div>
                  <div className="text-gray-500 mb-5 dark:text-gray-300">{seller.role}</div>
                  <div className="w-full grid gap-4">
                    {seller.methods.map((method, i) => {
                      const Icon = method.icon
                      return (
                        <a
                          key={i}
                          href={method.link}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border hover:shadow-lg transition-all duration-300 ${method.bgColor} border-blue-100 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1`}
                        >
                          {/* Icon + thông tin */}
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white flex items-center justify-center`}>
                              <Icon className="w-5 h-5" />
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-blue-700 dark:text-gray-100">{method.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{method.description}</div>
                            </div>
                          </div>

                          {/* Value + nút */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-blue-700 dark:text-gray-100 truncate max-w-[140px]" title={method.value}>
                              {method.value}
                            </span>
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs rounded-xl font-medium group-hover:scale-105 transition whitespace-nowrap">
                              {method.action}
                            </span>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ContactForm />
              {/* Working Hours & FAQ */}
              <div className="space-y-8">
                {/* Working Hours */}
                <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 dark:bg-gray-800 dark:border-gray-600 dark:border-1 dark:border-solid">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center dark:text-gray-100">
                    <Clock className="w-6 h-6 mr-3 text-green-600" />
                    Thời gian hoạt động
                  </h3>
                  <div className="space-y-4">
                    {workingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700 font-medium dark:text-gray-300">{schedule.day}</span>
                        <span className="text-blue-600 font-semibold">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                    <div className="flex items-center text-blue-700">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Lưu ý:</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">Ngoài giờ hành chính, mình vẫn check tin nhắn và phản hồi khi có thể!</p>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 dark:bg-gray-800 dark:border-gray-600 dark:border-1 dark:border-solid">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">Câu hỏi thường gặp</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <details key={index} className="group">
                        <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-100 hover:text-blue-600 transition-colors duration-300 dark:text-gray-300">
                          {faq.question}
                        </summary>
                        <p className="dark:text-gray-400 text-gray-600 text-sm mt-3 pb-3 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA giữ nguyên */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/90 rounded-3xl p-12 shadow-2xl border border-white/50 relative overflow-hidden dark:bg-gray-800 dark:border-gray-600 dark:border-1 dark:border-solid">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full translate-x-20 translate-y-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Bạn chưa tìm được thông tin cần thiết?
                </h3>
                <p className="text-gray-700 mb-8 max-w-2xl mx-auto dark:text-gray-300">
                  Đừng ngại liên hệ trực tiếp với mình! Mình luôn sẵn sàng tư vấn và hỗ trợ bạn tìm được sản phẩm phù hợp nhất.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://zalo.me/0823387108"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                  >
                    Chat với mình ngay
                  </a>
                  <a
                    href="/products"
                    className="px-8 py-4 border-2 border-blue-300 text-blue-700 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 text-center dark:bg-gray-800 dark:border-gray-600 dark:border-1 dark:border-solid"
                  >
                    Xem sản phẩm
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
