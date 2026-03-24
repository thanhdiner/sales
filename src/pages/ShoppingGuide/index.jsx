import React, { useState } from 'react'
import {
  Search,
  UserPlus,
  CreditCard,
  Truck,
  CheckCircle2,
  ShoppingCart,
  Wallet,
  Landmark,
  ShieldCheck,
  Phone,
  Mail,
  Clock3,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const ShoppingGuide = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const viewport = { once: true, amount: 0.2 }

  const steps = [
    {
      title: 'Chọn sản phẩm',
      content: 'Tìm kiếm và lựa chọn sản phẩm bạn muốn mua',
      icon: Search
    },
    {
      title: 'Đăng nhập/Đăng ký',
      content: 'Tạo tài khoản hoặc đăng nhập để tiếp tục',
      icon: UserPlus
    },
    {
      title: 'Thanh toán',
      content: 'Chọn phương thức thanh toán và hoàn tất đơn hàng',
      icon: CreditCard
    },
    {
      title: 'Giao hàng',
      content: 'Theo dõi đơn hàng và nhận sản phẩm',
      icon: Truck
    }
  ]

  const paymentMethods = [
    {
      name: 'Ví điện tử',
      desc: 'Hỗ trợ các ví điện tử hàng đầu tại Việt Nam.',
      popular: true,
      icon: Wallet,
      badges: ['MoMo', 'ZaloPay', 'ViettelPay']
    },
    {
      name: 'Chuyển khoản',
      desc: 'Internet Banking & Mobile Banking nhanh chóng.',
      popular: true,
      icon: Landmark,
      badges: ['24/7 Instant Transfer']
    }
  ]

  const detailedSteps = [
    {
      id: 'BƯỚC 01',
      title: 'Tìm kiếm sản phẩm',
      description:
        'Sử dụng thanh tìm kiếm thông minh tại đầu trang hoặc duyệt qua các danh mục được phân loại rõ ràng để tìm thấy sản phẩm phù hợp với nhu cầu của bạn.',
      chips: ['Tìm kiếm', 'Danh mục'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDR9c6HMFu3YLiFFZ42A88Q6Fp39ITb_0gKa2NlOjHAQQr_U6SRQcsxuHj9rH4E46tjMC6fh2ToxmN4O486tDtDq5NLD6jCF3sOuGnkZ4iBHCqQ9qVi5K6LO1XZDDqkkcPYWB4DFCZsqWTk1RGqPu_w_Vx4rsyHhXTmY_pB-f5LoRNbmLwohmXoMhiH0_TlaXSWDjS43qrJ-ICCAeQLKBj2w05jxQGwpWOS76bjUl-GQd2Enbek1I3dpb8IZs1LjzlZEwRWMTmMH2E',
      reverse: false
    },
    {
      id: 'BƯỚC 02',
      title: 'Thêm vào giỏ hàng',
      description:
        "Chọn số lượng, màu sắc, kích thước và nhấn nút 'Thêm vào giỏ hàng'. Bạn có thể tiếp tục mua sắm hoặc đi đến giỏ hàng để thanh toán ngay.",
      checks: ['Chọn biến thể sản phẩm', 'Kiểm tra tồn kho thời gian thực'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBnGnoawIhXn07QbPwrRfv7G_E9pJIhaF-9ZPPwqFjcBsxSO88IWxCCMnw6Yt5cHa0rcg8UD6esdyKY4oWWsfjelAo4hIplZwc4fHJ-Ur_BpiUdoyD9vB_mcxLXIuMNy7iop0wa0Qqe9YCp6z11Pt79DMrMi_N7iYhh_sTkNArYIzM7R0omC4Y_BWE4fuFjj3hrGzdXynr6bpQIQ8s9ov25Apr4LEjeXs0Spe6XCTos7-JbmtfRkhrWAIQqYjiIcoFax49ONyhVBZE',
      reverse: true
    },
    {
      id: 'BƯỚC 03 & 04',
      title: 'Kiểm tra & Điền thông tin',
      description:
        'Xem lại sản phẩm trong giỏ hàng. Nhập chính xác địa chỉ giao hàng và số điện thoại để chúng tôi có thể phục vụ bạn tốt nhất.',
      note: 'Mẹo: Lưu địa chỉ trong tài khoản để thanh toán nhanh hơn ở lần sau.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3JJ27QFJCsxmFnsDMBpP4g4MbeimwaTd9I537SxHGxX9PhsMaRYRWf_hUDsVn-mJkaHSFZ4tM_j0NM10-SCs30Mk0iN-O_MGbwveUu5_2UeD9zHhdKgrA5B2Al-rCBcQ24tYAugHV2cFBlEMl12P0tAK6z74CkQSdeXyZAAgbyA1LGoo_XxyTREEBmqhWGzVZrm_Of1cGCGTOrpry3Ee3ln8ECeoj964Kl6R6unTKRxZbShblbQ0EXD9dkESgx8frVn3y7EymDo',
      reverse: false
    }
  ]

  const smartTips = [
    'So sánh giá trước khi mua để luôn có lựa chọn tốt nhất.',
    'Kiểm tra chính sách đổi trả cụ thể của từng loại sản phẩm.',
    'Luôn kiểm tra kỹ thông tin sản phẩm và đánh giá từ người mua trước.',
    'Tận dụng các chương trình flash sale khung giờ vàng.',
    'Sử dụng tối đa các mã giảm giá và voucher tích lũy sẵn có.'
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
    <div className="min-h-screen rounded-xl bg-slate-50 dark:bg-gray-900">
      <SEO title="Hướng dẫn mua hàng" description="Hướng dẫn mua hàng tại SmartMall từ A đến Z: tìm sản phẩm, thanh toán, nhận hàng." />

      <main className="overflow-hidden">
        <motion.section
          className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              viewport={viewport}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100 md:text-5xl lg:text-6xl">
                🛒 Hướng Dẫn Mua Hàng
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-gray-300">
                Hướng dẫn chi tiết từng bước để bạn có thể mua sắm dễ dàng và an toàn trên website của chúng tôi.
              </p>

              <motion.div
                className="mt-8 inline-flex items-center gap-4 rounded-xl bg-slate-100 p-4 dark:bg-gray-800"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
                viewport={viewport}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-gray-100">Mua hàng nhanh chóng</p>
                  <p className="text-sm text-slate-600 dark:text-gray-400">Đăng ký tài khoản để sử dụng đầy đủ tính năng.</p>
                </div>
                <button
                  onClick={() => navigate('/user/register')}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Đăng ký ngay
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />
              <img
                alt="Shopping online concept"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9JhwkqCqqiKnWbxgjgrNufgJ3lG26LGdj30S8l9871ZNqvv-cvUffVCtx__SttaDpNRbsnRtv3UIJy3YvVnKP5bQgmt6UwQRSCDTVkCTC42iS0MtL183okT4QH2GVnmwJk0ptTylvKeJyf4O4cr5a3Nq7NqUn4iY67ZR6Gy_-6w8Fxt-P2CzlFq8Xj0BZ5m6_vHcz6reuzvWg_8KhAHBzfd_bL0V2TYmoFMosoo4Dpw0mqm6WxApuLzbN4qrRebrNgPqc2_zXpnk"
                className="relative z-10 h-[320px] w-full rounded-2xl object-cover shadow-2xl md:h-[400px]"
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="bg-slate-100/80 px-4 py-16 dark:bg-gray-800/60 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="mx-auto max-w-7xl">
            <motion.h2
              className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-gray-100"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              viewport={viewport}
            >
              Quy Trình Mua Sắm
            </motion.h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === index

                return (
                  <motion.div
                    key={step.title}
                    className="group relative"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
                    viewport={viewport}
                  >
                    <div
                      className={`rounded-2xl bg-white p-6 transition-all duration-300 dark:bg-gray-800 ${
                        isActive ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : 'hover:-translate-y-1 hover:shadow-lg'
                      }`}
                    >
                      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">Step {index + 1}: {step.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">{step.content}</p>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-slate-400 md:block">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              className="mt-8 flex justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              viewport={viewport}
            >
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Quay lại
              </button>
              <button
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tiếp theo
              </button>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <motion.h2
            className="mb-14 text-3xl font-extrabold text-slate-900 dark:text-gray-100 md:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            Chi Tiết Từng Bước
          </motion.h2>

          <div className="space-y-14">
            {detailedSteps.map((item, index) => (
              <motion.article
                key={item.id}
                className={`flex flex-col items-start gap-10 ${item.reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
                viewport={viewport}
              >
                <div className="md:w-1/2">
                  <p className="mb-2 text-sm font-bold text-blue-600 dark:text-blue-300">{item.id}</p>
                  <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-gray-100">{item.title}</h3>
                  <p className="mb-6 leading-relaxed text-slate-600 dark:text-gray-300">{item.description}</p>

                  {item.chips && (
                    <div className="flex flex-wrap gap-3">
                      {item.chips.map(chip => (
                        <span key={chip} className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm dark:bg-gray-700 dark:text-gray-100">
                          <Search className="h-3.5 w-3.5" />
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.checks && (
                    <ul className="space-y-3">
                      {item.checks.map(check => (
                        <li key={check} className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-200">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          {check}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.note && (
                    <div className="rounded-xl border-l-4 border-blue-600 bg-slate-100 p-4 text-sm font-medium text-slate-700 dark:bg-gray-800 dark:text-gray-200">
                      {item.note}
                    </div>
                  )}
                </div>

                <div className="h-64 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-sm dark:bg-gray-800 md:w-1/2">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="bg-slate-100 px-4 py-20 dark:bg-gray-800/70 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              viewport={viewport}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-100">Phương Thức Thanh Toán</h2>
              <p className="mt-3 text-slate-600 dark:text-gray-300">Linh hoạt và bảo mật tuyệt đối cho mọi giao dịch.</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <motion.div
                    key={method.name}
                    className="flex items-start gap-5 rounded-2xl bg-white p-7 dark:bg-gray-800"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                    viewport={viewport}
                  >
                    <div className="rounded-xl bg-blue-600/10 p-3 text-blue-600 dark:text-blue-300">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100">{method.name}</h3>
                        {method.popular && (
                          <span className="rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                            Phổ biến
                          </span>
                        )}
                      </div>
                      <p className="mb-4 text-sm text-slate-600 dark:text-gray-300">{method.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {method.badges.map(badge => (
                          <span key={badge} className="rounded bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-gray-700 dark:text-gray-100">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-slate-300/70 bg-white/70 p-5 text-center backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/70"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
              viewport={viewport}
            >
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                Bảo mật thanh toán - Tất cả giao dịch được mã hóa SSL 256-bit đảm bảo an toàn tuyệt đối
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <motion.h2
            className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            Câu Hỏi Thường Gặp
          </motion.h2>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.details
                key={faq.question}
                className="group cursor-pointer rounded-2xl bg-slate-100 p-5 dark:bg-gray-800"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
                viewport={viewport}
              >
                <summary className="flex list-none items-center justify-between font-bold text-slate-900 dark:text-gray-100">
                  {faq.question}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600 dark:text-gray-300">{faq.answer}</p>
              </motion.details>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="bg-slate-900 px-4 py-20 text-white sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              viewport={viewport}
            >
              <h2 className="mb-8 text-3xl font-extrabold md:text-4xl">🎯 Mẹo Mua Hàng Thông Minh</h2>
              <ul className="space-y-5">
                {smartTips.map((tip, index) => (
                  <li key={tip} className="flex gap-4 text-slate-300">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p>{tip}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="grid h-[420px] grid-cols-2 gap-4 md:h-[500px]"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="mt-10 overflow-hidden rounded-2xl">
                <img
                  alt="Smart shopping"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMtKLoEDMf7BJ_X1scBglcB5D2jbLWcZAasPXiRJtqKzLKG1lnnkN_g0pVYISWHxAxQm8TRJrJSrS--btGGVMUDX4OiJqIIoB_4j8zUgOr4RsjUZXfL2feLraZHpBR2j4EVfuDTmQIxIub7ZiaIKf5He_plN5X-fI277ya3YOqm6unv7nKKtNtcK3TbJWTTI114_RYzm4qcXQt4q5VoDBYLSglqhQp1ENhLRNwvz-DlFhAJmqkYGFjhijO5ymIbxtysa-t4I1Uc2s"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="-mt-10 overflow-hidden rounded-2xl">
                <img
                  alt="Smart device"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBveMIAQNmALQLi8aG1-fjN4Oq4Lht-PlH_3AfK5KM96DREweyYuKwFFSzbXBStloeb4ooj3Ap_AkmwdI9hrLNFS4ax5e7pnf8WEmUcrpEpz_ySo_BBHXJM_dgzh4QAKnPwgkOaEwwCdp4Ppv45wKEzE6cBPYg3Z9JyA0lbglR7FjYVbmc5OV4sXK2Er1hsk2m1zjgwVaE3gwEQQyjXoDxYTYc6cg0yUnakIFpbIK33cV1WFVsbQFYJbOb8FWefX3zAuaZAUw8FRA8"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="px-4 py-20 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <motion.div
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-100 p-8 dark:bg-gray-800/70 md:p-12"
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="relative z-10 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
              <motion.div
                className="max-w-lg"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                viewport={viewport}
              >
                <h2 className="mb-5 text-3xl font-bold text-slate-900 dark:text-gray-100">Bạn cần trợ giúp thêm?</h2>
                <div className="space-y-3 text-slate-700 dark:text-gray-200">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{websiteConfig?.contactInfo?.phone || '0823387108'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="break-all">{websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-blue-600" />
                    <span>8:00 - 22:00 (Thứ 2 - Chủ Nhật)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="text-left md:max-w-md md:text-right"
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
                viewport={viewport}
              >
                <p className="mb-6 text-lg text-slate-700 dark:text-gray-200">
                  Sẵn sàng bắt đầu mua sắm? Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất.
                </p>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Bắt đầu mua sắm ngay
                  </button>
                  <button
                    onClick={() => navigate('/coupons')}
                    className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Xem khuyến mãi
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}

export default ShoppingGuide
