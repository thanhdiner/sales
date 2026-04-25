import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { viewport } from '../constants'

const HeroVisualCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="contact-media-frame overflow-hidden rounded-[28px] border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="contact-media-inner relative overflow-hidden rounded-[22px] bg-gray-100 dark:bg-gray-900">
          <img
            src="/images/herosection-aboutpage.jpg"
            alt="SmartMall hỗ trợ khách hàng"
            className="h-[330px] w-full object-cover object-[center_34%] md:h-[420px] lg:h-[440px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          <div className="contact-badge absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[12px] font-semibold text-gray-700 shadow-sm backdrop-blur dark:bg-gray-900/85 dark:text-gray-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Hỗ trợ 1:1 từ SmartMall
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="contact-overlay-card rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur-md dark:bg-gray-900/85">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="contact-section-eyebrow--accent text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">
                    Phản hồi minh bạch
                  </p>

                  <p className="contact-card-title mt-2 max-w-[390px] text-[15px] font-semibold leading-6 text-gray-900 dark:text-white">
                    Tư vấn rõ ràng, kiểm tra nhanh và hỗ trợ bạn trước khi mua.
                  </p>
                </div>

                <a
                  href="https://zalo.me/0823387108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-brand-action inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b74e5] px-4 text-[14px] font-semibold text-white transition hover:bg-[#0968cf]"
                >
                  Liên hệ ngay
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroVisualCard
