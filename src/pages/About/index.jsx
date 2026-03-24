import React, { useState, useEffect } from 'react'
import { Shield, Zap, Headphones, Store, Clock, Users, Heart, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import SkewCards from '@/components/ui/gradient-card-showcase'

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Shield,
      title: 'Bảo mật đơn giản',
      description: 'Mọi giao dịch đều qua hệ thống ngân hàng và ví điện tử phổ biến.',
      gradientFrom: '#ffbc00',
      gradientTo: '#ff0058',
      href: '/contact',
      ctaLabel: 'Tìm hiểu thêm'
    },
    {
      icon: Zap,
      title: 'Giao hàng nhanh',
      description: 'Gửi thông tin tài khoản, phần mềm nhanh nhất có thể, đa phần trong ngày.',
      gradientFrom: '#03a9f4',
      gradientTo: '#ff0058',
      href: '/products',
      ctaLabel: 'Xem sản phẩm'
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ tận tâm',
      description: 'Có thắc mắc gì, mình trả lời sớm nhất có thể (thường trong giờ hành chính).',
      gradientFrom: '#4dff03',
      gradientTo: '#00d0ff',
      href: '/contact',
      ctaLabel: 'Liên hệ ngay'
    }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Khởi đầu nhỏ',
      description: 'Bắt đầu bán vài tài khoản game và phần mềm bản quyền cho bạn bè và người quen.',
      icon: Star
    },
    {
      year: '2025',
      title: 'Làm website riêng',
      description: 'Lập trang web để bán hàng cho khách lạ. Số lượng đơn chưa nhiều, vẫn chủ yếu là cá nhân tự làm.',
      icon: Sparkles
    }
  ]

  const stats = [
    { number: '100+', label: 'Khách hàng hài lòng' },
    { number: '24/7', label: 'Hỗ trợ nhanh chóng' },
    { number: '100+', label: 'Giao dịch hoàn tất' },
    { number: '1 năm', label: 'Kinh nghiệm' }
  ]

  const viewport = { once: true, amount: 0.2 }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden dark:from-gray-800 dark:to-gray-900">
      <SEO
        title="Về SmartMall"
        description="SmartMall – Shop nhỏ chuyên bán tài khoản game và phần mềm bản quyền. Uy tín, rõ ràng, giá hợp lý, hỗ trợ tận tâm."
        url="https://smartmall.site/about"
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className={`relative px-4 pb-12 pt-14 transition-all duration-1000 md:pb-16 md:pt-20 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <BackgroundPaths className="opacity-80 [mask-image:radial-gradient(95%_74%_at_50%_42%,black,transparent_100%)] dark:opacity-72" />
          <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,_rgba(239,68,68,0.14)_1px,_transparent_1px)] [background-size:24px_24px] opacity-24 dark:[background-image:radial-gradient(circle,_rgba(252,165,165,0.12)_1px,_transparent_1px)]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <motion.div
                className="lg:col-span-7"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                viewport={viewport}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  Chào mừng đến với SmartMall
                </span>

                <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl xl:text-6xl dark:text-white">
                  Về shop nhỏ này
                  <span className="mt-2 block bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Uy tín, rõ ràng, tận tâm
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-gray-700 md:text-lg dark:text-gray-300">
                  Xin chào! Mình là một cá nhân bắt đầu bán tài khoản game và phần mềm bản quyền từ năm 2025. Shop còn nhỏ, mọi thứ đều tự
                  làm, tự support. Mình luôn cố gắng mang lại trải nghiệm tốt, uy tín và rõ ràng cho khách hàng.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Hỗ trợ nhanh
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Quy trình minh bạch
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Giá hợp lý
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110"
                  >
                    Xem sản phẩm
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:border-blue-300 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                  >
                    Liên hệ ngay
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
                viewport={viewport}
              >
                <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/85 p-6 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-violet-400/20 blur-2xl" />

                  <div className="relative z-10">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg">
                      <Store className="h-10 w-10 text-white" />
                    </div>

                    <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white">SmartMall</h3>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">Shop nhỏ chuyên tài khoản game & phần mềm bản quyền.</p>

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                      Bắt đầu từ 2025, tụi mình tập trung xây trải nghiệm mua nhanh - hỗ trợ rõ - hậu mãi tử tế.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                  viewport={viewport}
                >
                  <CardSpotlight
                    className="rounded-2xl border-white/60 bg-white/75 !p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    color="rgba(79, 140, 255, 0.16)"
                    radius={250}
                  >
                    <div className="mb-1 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-3xl font-extrabold text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </CardSpotlight>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="relative py-20 px-4 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <AnimatedGridPattern
            numSquares={36}
            maxOpacity={0.12}
            duration={3}
            repeatDelay={1}
            className="text-blue-500/60 dark:text-cyan-300/60 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-25%] h-[170%] skew-y-6"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/35 dark:to-gray-800/35" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.header
              className="text-center mb-16"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              viewport={viewport}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4 dark:text-gray-100">Shop nhỏ nhưng có gì?</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto dark:text-gray-300">
                Dù là shop nhỏ nhưng chúng mình luôn cố gắng mang đến những dịch vụ tốt nhất
              </p>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
              viewport={viewport}
            >
              <SkewCards cards={features} />
            </motion.div>
          </div>
        </motion.section>

        {/* Story & Timeline */}
        <motion.section
          className="py-20 px-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* About Owner */}
              <motion.article
                className="bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                viewport={viewport}
              >
                <header className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Ai đứng sau shop?</h2>
                </header>

                <div className="space-y-4 text-gray-700 leading-relaxed dark:text-gray-300">
                  <p>
                    Mình là coder tự học, yêu thích công nghệ và phần mềm bản quyền. Shop này được lập ra để kiếm thêm thu nhập, đồng thời
                    mang lại những giải pháp phần mềm chính hãng, uy tín cho bạn bè và mọi người xung quanh.
                  </p>
                  <p>
                    Rất mong nhận được góp ý, phản hồi từ các bạn để cải thiện dần. Số đơn chưa nhiều, nên mỗi đơn mình đều cố gắng làm kỹ
                    và support tận tình nhất có thể!
                  </p>

                  <div className="flex items-center pt-4 text-pink-500 font-medium">
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Cảm ơn bạn đã ghé thăm!
                  </div>
                </div>
              </motion.article>

              {/* Timeline */}
              <motion.article
                className="bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
                viewport={viewport}
              >
                <header className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Hành trình ngắn gọn</h2>
                </header>

                <div className="space-y-8">
                  {timeline.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={index}
                        className="relative flex items-start group"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
                        viewport={viewport}
                      >
                        {index < timeline.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-cyan-300" />
                        )}

                        <div className="relative z-10 bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                            {item.year}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 dark:text-gray-100">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed dark:text-gray-300">{item.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.article>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 px-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-white/90 rounded-3xl p-12 shadow-2xl border border-white/50 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full translate-x-20 translate-y-20"></div>

              <div className="relative z-10">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Bạn muốn thử mua?
                </h2>

                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed dark:text-gray-300">
                  Cứ chat hoặc inbox – mình luôn trả lời nhanh nhất có thể. Hy vọng bạn sẽ hài lòng với trải nghiệm mua bán nhỏ này!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    onClick={() => navigate('/products')}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Xem sản phẩm
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <a
                    href="https://docs.google.com/forms/d/1ks3veXy1wEajPUkukR0ovatRGUjcB7O5EkmjXZ3_wE8/edit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 border-2 border-blue-300 text-blue-700 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Góp ý cho shop
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}

export default AboutPage