import React from 'react'
import {
  ClockCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  StarOutlined,
  PhoneOutlined,
  MessageOutlined,
  MailOutlined,
  FacebookFilled,
  ArrowRightOutlined,
  QuestionCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import ContactForm from '@/components/ContactForm'
import SEO from '@/components/SEO'
import { CardSpotlight } from '@/components/ui/card-spotlight'

const sellers = [
  {
    name: 'Smartmall Gdv 1',
    role: 'Chuyên phần mềm bản quyền',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: MessageOutlined,
        title: 'Zalo',
        value: '0823387108',
        iconClass: 'text-sky-600 bg-sky-50',
        action: 'Nhắn Zalo',
        link: 'https://zalo.me/0823387108'
      },
      {
        icon: FacebookFilled,
        title: 'Facebook',
        value: 'fb.com/lunashop.business.official',
        iconClass: 'text-blue-600 bg-blue-50',
        action: 'Chat FB',
        link: 'https://www.facebook.com/lunashop.business.official'
      },
      {
        icon: MailOutlined,
        title: 'Email',
        value: 'smartmall.business.official@gmail.com',
        iconClass: 'text-violet-600 bg-violet-50',
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
        icon: MessageOutlined,
        title: 'Zalo',
        value: '0822516521',
        iconClass: 'text-sky-600 bg-sky-50',
        action: 'Nhắn Zalo',
        link: 'https://zalo.me/0822516521'
      },
      {
        icon: FacebookFilled,
        title: 'Facebook',
        value: 'fb.com/smartmall.world',
        iconClass: 'text-blue-600 bg-blue-50',
        action: 'Chat FB',
        link: 'https://www.facebook.com/smartmall.world'
      },
      {
        icon: MailOutlined,
        title: 'Email',
        value: 'smartmallhq@gmail.com',
        iconClass: 'text-violet-600 bg-violet-50',
        action: 'Gửi email',
        link: 'mailto:smartmallhq@gmail.com'
      }
    ]
  }
]

const workingHours = [
  { day: 'Thứ 2 - Thứ 6', time: '8:00 - 21:00' },
  { day: 'Thứ 7', time: '9:00 - 21:00' },
  { day: 'Chủ nhật', time: '10:00 - 21:00' }
]

const faqs = [
  {
    question: 'Làm sao để đặt hàng?',
    answer: 'Bạn có thể liên hệ qua Facebook, Zalo hoặc email. Bên mình sẽ tư vấn và hướng dẫn chi tiết.'
  },
  {
    question: 'Thanh toán như thế nào?',
    answer: 'Bên mình hỗ trợ thanh toán qua ngân hàng và một số ví điện tử phổ biến.'
  },
  {
    question: 'Bao lâu nhận được hàng?',
    answer: 'Thông thường trong ngày, tối đa 24 giờ. Với tài khoản phần mềm, thời gian xử lý thường nhanh hơn.'
  },
  {
    question: 'Có bảo hành không?',
    answer:
      'Tùy từng sản phẩm sẽ có hoặc không có bảo hành. Nếu có, thông tin thời gian và điều kiện bảo hành sẽ được ghi rõ ở phần mô tả sản phẩm.'
  }
]

const highlights = [
  {
    icon: ThunderboltOutlined,
    value: '< 3h',
    label: 'Thời gian phản hồi',
    iconClass: 'text-amber-500'
  },
  {
    icon: SafetyCertificateOutlined,
    value: '100%',
    label: 'Bảo mật thông tin',
    iconClass: 'text-emerald-600'
  },
  {
    icon: HeartOutlined,
    value: '24/7',
    label: 'Hỗ trợ tận tâm',
    iconClass: 'text-rose-500'
  }
]

const sectionClass = 'border-t border-gray-100 bg-white px-4 py-14 dark:border-gray-800 dark:bg-gray-900'
const containerClass = 'max-w-6xl mx-auto'
const cardClass = 'rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'

const ContactPage = () => {
  return (
    <div className="contact-page min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Liên hệ"
        description="Liên hệ SmartMall qua Zalo, Facebook hoặc email. Hỗ trợ nhanh chóng, tư vấn tận tâm trong giờ hành chính và cả ngoài giờ."
        url="https://smartmall.site/contact"
      />

      {/* ==================== SECTION 1: Hero / Giới thiệu liên hệ ==================== */}
      <section className="relative overflow-hidden md:py-14 dark:bg-gray-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,_#bfdbfe_1px,_transparent_1px)] [background-size:18px_18px] dark:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-45 [background-image:radial-gradient(circle,_rgba(148,163,184,0.35)_1px,_transparent_1px)] [background-size:18px_18px] dark:block"
        />
        <div className={`${containerClass} relative z-10`}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] px-6 py-10 md:px-10 md:py-12 dark:border-gray-700 dark:bg-gray-800">
            {/* ... nội dung hero ... */}
            <div className="relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <MessageOutlined />
                  Sẵn sàng hỗ trợ bạn
                </span>
                <div className="mt-5 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm dark:bg-gray-800 dark:ring-gray-700">
                    <PhoneOutlined className="text-2xl text-blue-600" />
                  </div>
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                  Liên hệ với chúng tôi
                </h1>
                <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg dark:text-gray-300">
                  Nếu bạn cần tư vấn sản phẩm, hỗ trợ đơn hàng hoặc muốn hỏi thêm thông tin, bên mình luôn sẵn sàng phản hồi nhanh và rõ ràng.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 sm:grid-cols-3 dark:border-gray-700">
                {highlights.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <CardSpotlight
                      key={index}
                      className="text-center !px-5 !py-5 ring-1 ring-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md dark:ring-gray-700"
                      color="rgba(79, 140, 255, 0.16)"
                      radius={250}
                    >
                      <div className="flex justify-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700">
                          <Icon className={`text-2xl ${item.iconClass}`} />
                        </div>
                      </div>
                      <div className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">{item.value}</div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.label}</div>
                    </CardSpotlight>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: Cách liên hệ nhanh nhất (2 nhân viên hỗ trợ) ==================== */}
      <section className={`${sectionClass} relative overflow-hidden`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,_#dbeafe_1px,_transparent_1px)] [background-size:20px_20px] dark:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-20 [background-image:radial-gradient(circle,_rgba(148,163,184,0.3)_1px,_transparent_1px)] [background-size:20px_20px] dark:block"
        />

        <div className={containerClass}>
          <div className="relative z-10 mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              <PhoneOutlined />
              Kết nối trực tiếp
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
              Cách liên hệ nhanh nhất
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
              Chọn đúng người hỗ trợ theo nhu cầu để được phản hồi nhanh, rõ ràng và tiết kiệm thời gian hơn.
            </p>
          </div>

          <div className="relative z-10 grid gap-6 md:grid-cols-2">
            {sellers.map((seller, idx) => (
              <div key={idx} className={`${cardClass} relative overflow-hidden p-6 md:p-7`}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-transparent dark:from-blue-500/10 dark:via-gray-800 dark:to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-100 dark:ring-gray-700"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-lg font-semibold text-gray-900 dark:text-white">{seller.name}</div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-300">{seller.role}</div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Online
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {seller.methods.map((method, i) => {
                      const Icon = method.icon
                      return (
                        <a
                          key={i}
                          href={method.link}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="group/method relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/50"
                        >
                          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 opacity-0 transition-opacity duration-200 group-hover/method:opacity-100" />

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ring-1 ring-inset ring-gray-200 dark:ring-gray-600 ${method.iconClass}`}
                              >
                                <Icon />
                              </span>

                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-white">{method.title}</div>
                                <div className="truncate text-sm text-gray-500 dark:text-gray-300" title={method.value}>
                                  {method.value}
                                </div>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover/method:bg-blue-700 sm:self-center">
                              {method.action}
                              <ArrowRightOutlined className="transition-transform duration-200 group-hover/method:translate-x-0.5" />
                            </span>
                          </div>
                        </a>
                      )
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                    Ưu tiên liên hệ qua Zalo/Facebook để nhận phản hồi nhanh hơn.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: Form liên hệ + Giờ làm việc ==================== */}
      <section className={`${sectionClass} relative overflow-hidden`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,_#dbeafe_1px,_transparent_1px)] [background-size:24px_24px] dark:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-15 [background-image:radial-gradient(circle,_rgba(148,163,184,0.28)_1px,_transparent_1px)] [background-size:24px_24px] dark:block"
        />

        <div className={containerClass}>
          <div className="relative z-10 mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-500/10 dark:text-green-300">
              <ClockCircleOutlined />
              Lịch hỗ trợ & biểu mẫu liên hệ
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
              Gửi thông tin nhanh, nhận hỗ trợ đúng lúc
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
              Bạn có thể gửi yêu cầu trực tiếp qua biểu mẫu hoặc xem khung giờ hoạt động để nhận phản hồi nhanh hơn.
            </p>
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
                <div className="rounded-3xl bg-white/80 p-2 backdrop-blur-sm dark:bg-gray-900/70">
                  <ContactForm />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={`${cardClass} relative overflow-hidden p-7 md:p-8`}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-transparent dark:from-emerald-500/10 dark:via-gray-800 dark:to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <ClockCircleOutlined />
                      </span>
                      Thời gian hoạt động
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Cập nhật hằng ngày
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {workingHours.map((schedule, index) => {
                      const isWeekend = schedule.day.toLowerCase().includes('chủ nhật')
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                          <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                            <span className={`h-2.5 w-2.5 rounded-full ${isWeekend ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                            {schedule.day}
                          </span>
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                            {schedule.time}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                    <div className="flex items-center gap-2 font-semibold">
                      <InfoCircleOutlined />
                      Lưu ý phản hồi
                    </div>
                    <p className="mt-2 leading-6">
                      Ngoài giờ hành chính, bên mình vẫn kiểm tra tin nhắn định kỳ và ưu tiên phản hồi các yêu cầu khẩn.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a
                      href="https://zalo.me/0823387108"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                    >
                      <MessageOutlined />
                      Nhắn Zalo ngay
                    </a>
                    <a
                      href="mailto:smartmallhq@gmail.com"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-violet-300 hover:text-violet-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
                    >
                      <MailOutlined />
                      Gửi email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: FAQ - Câu hỏi thường gặp ==================== */}
      <section className={`${sectionClass} relative overflow-hidden`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,_#dbeafe_1px,_transparent_1px)] [background-size:22px_22px] dark:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-15 [background-image:radial-gradient(circle,_rgba(148,163,184,0.28)_1px,_transparent_1px)] [background-size:22px_22px] dark:block"
        />

        <div className={containerClass}>
          <div className="relative z-10 mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <QuestionCircleOutlined />
              Trung tâm trợ giúp
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">Câu hỏi thường gặp</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
              Một số thắc mắc phổ biến đã được tổng hợp sẵn để bạn tra cứu nhanh trước khi liên hệ trực tiếp.
            </p>
          </div>

          <div className="relative z-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className={`${cardClass} p-4 md:p-5`}>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group rounded-2xl border border-gray-200 bg-white transition-all duration-200 open:border-blue-200 open:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:open:border-blue-500/50"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 md:px-5">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-blue-50 px-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="font-semibold leading-6 text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                            {faq.question}
                          </span>
                        </div>

                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors dark:bg-gray-700 dark:text-gray-300">
                          <PlusOutlined className="text-[11px] transition-transform duration-200 group-open:rotate-45" />
                        </span>
                      </summary>

                      <div className="px-4 pb-4 pl-12 text-sm leading-6 text-gray-600 md:px-5 md:pb-5 md:pl-[3.45rem] dark:text-gray-300">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className={`${cardClass} relative overflow-hidden p-6`}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/70 via-white to-transparent dark:from-violet-500/10 dark:via-gray-800 dark:to-transparent" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vẫn chưa thấy câu trả lời?</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Nếu cần hỗ trợ riêng, bạn có thể chọn kênh liên hệ trực tiếp để được tư vấn nhanh hơn.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <a
                      href="https://zalo.me/0823387108"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <MessageOutlined />
                      Chat qua Zalo
                    </a>
                    <a
                      href="mailto:smartmallhq@gmail.com"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-violet-300 hover:text-violet-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
                    >
                      <MailOutlined />
                      Gửi email
                    </a>
                  </div>

                  <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3 text-xs leading-5 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                    Mẹo: Hãy mô tả rõ nhu cầu và mã đơn (nếu có) để đội ngũ hỗ trợ xử lý nhanh hơn.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: CTA cuối - Chưa tìm thấy thông tin? ==================== */}
      <section className="relative overflow-hidden border-t border-gray-100 bg-white px-4 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,_#dbeafe_1px,_transparent_1px)] [background-size:22px_22px] dark:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-15 [background-image:radial-gradient(circle,_rgba(148,163,184,0.28)_1px,_transparent_1px)] [background-size:22px_22px] dark:block"
        />

        <div className={`${containerClass} relative z-10`}>
          <div className={`${cardClass} relative overflow-hidden p-6 md:p-10`}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/70 via-white to-blue-50/70 dark:from-amber-500/10 dark:via-gray-800 dark:to-blue-500/10" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <StarOutlined />
                  Hỗ trợ 1:1 theo nhu cầu
                </span>

                <h3 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                  Bạn chưa tìm được thông tin cần thiết?
                </h3>

                <p className="mt-4 max-w-2xl leading-7 text-gray-600 dark:text-gray-300">
                  Đừng lo — bạn có thể liên hệ trực tiếp để được tư vấn sản phẩm phù hợp, giải đáp thắc mắc và nhận hướng dẫn nhanh nhất.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Phản hồi nhanh
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/35 dark:bg-blue-500/10 dark:text-blue-300">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Tư vấn rõ ràng
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-500/35 dark:bg-violet-500/10 dark:text-violet-300">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    Hỗ trợ tận tâm
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="grid gap-3">
                  <a
                    href="https://zalo.me/0823387108"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <MessageOutlined />
                    Chat ngay với tư vấn viên
                    <ArrowRightOutlined className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>

                  <a
                    href="/products"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-800 transition hover:border-blue-300 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                  >
                    Xem sản phẩm nổi bật
                    <ArrowRightOutlined className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage