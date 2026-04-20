import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Zap, Shield, Heart } from 'lucide-react'
import { highlights, viewport } from '../constants'

const iconMap = {
  'from-amber-500 to-orange-500': Zap,
  'from-emerald-500 to-teal-500': Shield,
  'from-rose-500 to-pink-500': Heart
}

const HeroSection = ({ isVisible }) => {
  return (
    <motion.section
      className={`relative px-4 -mt-2 pt-0 pb-12 md:-mt-3 md:pt-0 md:pb-20 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* Left: Text content */}
          <motion.div
            className="lg:pt-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-blue-600">
              Liên hệ
            </p>

            <h1 className="max-w-[560px] text-[42px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#162033] md:text-[64px] dark:text-white">
              Chúng tôi
              <br />
              luôn sẵn
              <br />
              sàng hỗ trợ
            </h1>

            <p className="mt-5 max-w-[550px] text-[17px] font-medium leading-[1.9] text-[#4b5563] dark:text-gray-300">
              Nếu bạn cần tư vấn sản phẩm, hỗ trợ đơn hàng hoặc muốn hỏi thêm thông tin, bên mình luôn sẵn sàng phản hồi nhanh và rõ ràng.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="https://zalo.me/0823387108"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
                Nhắn Zalo ngay
              </a>
              <a
                href="mailto:smartmallhq@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-[16px] font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Gửi email
              </a>
            </div>
          </motion.div>

          {/* Right: Highlight stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="rounded-[36px] bg-[#f8f8f8] p-6 dark:bg-gray-800/50">
              <div className="grid gap-4">
                {highlights.map((item, index) => {
                  const Icon = item.icon
                  const LucideIcon = iconMap[item.gradient]
                  return (
                    <motion.div
                      key={index}
                      className="group relative overflow-hidden rounded-[22px] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
                      viewport={viewport}
                      whileHover={{ y: -2 }}
                    >
                      {/* Gradient accent bar */}
                      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${item.gradient} opacity-80`} />

                      <div className="flex items-center gap-5">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                          {LucideIcon ? <LucideIcon className="h-6 w-6" /> : <Icon className="text-2xl" />}
                        </div>
                        <div>
                          <div className="text-[28px] font-bold tracking-tight text-[#0f172a] dark:text-white">
                            {item.value}
                          </div>
                          <div className="mt-0.5 text-[15px] font-medium text-gray-500 dark:text-gray-400">
                            {item.label}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
