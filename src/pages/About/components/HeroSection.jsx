import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = ({ isVisible, viewport }) => {
  const navigate = useNavigate()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <motion.section
      className={`relative px-4 -mt-2 pt-0 pb-12 md:-mt-3 md:pt-0 md:pb-16 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            className="lg:pt-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-blue-600">Về SmartMall</p>

            <h1 className="about-page__hero-title max-w-[560px] text-[46px] font-semibold leading-[1.06] tracking-[-0.015em] text-[#162033] md:text-[72px]">
              Kho phần
              <br />
              mềm bản
              <br />
              quyền
            </h1>

            <p className="about-page__lead mt-5 max-w-[650px] text-[18px] font-medium leading-[1.9] text-[#1f2937]">
              SmartMall tập trung vào trải nghiệm mua hàng rõ ràng, hỗ trợ nhanh và làm việc minh bạch. Mục tiêu là giúp khách dễ chọn, dễ
              mua và yên tâm hơn trong quá trình sử dụng.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/products')}
                className="about-page__primary-button inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-blue-700"
              >
                Xem sản phẩm
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="about-page__secondary-button inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-[16px] font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Liên hệ ngay
                <Play className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-9 grid max-w-[640px] gap-4 sm:grid-cols-2">
              <div className="about-page__mini-card rounded-[22px] bg-white px-7 py-5 shadow-sm">
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>

                <p className="about-page__rating-value text-[20px] font-semibold leading-none text-[#0f172a]">
                  4.2/5 <span className="about-page__subtle text-[15px] font-medium text-gray-400">(45k Reviews)</span>
                </p>

                <p className="about-page__subtle mt-5 text-[13px] text-gray-400">SmartMall</p>
              </div>

              <div className="about-page__mini-card rounded-[22px] bg-white px-7 py-5 shadow-sm">
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>

                <p className="about-page__rating-value text-[20px] font-semibold leading-none text-[#0f172a]">
                  4.1/5 <span className="about-page__subtle text-[15px] font-medium text-gray-400">(18k Reviews)</span>
                </p>

                <p className="about-page__subtle mt-5 text-[13px] text-gray-400">SmartMall</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="about-page__image-frame rounded-[36px] bg-[#f8f8f8] p-6">
              <div className="about-page__image-canvas relative flex min-h-[620px] items-end justify-center overflow-hidden rounded-[30px] bg-white">
                {!isImageLoaded ? (
                  <div className="about-page__skeleton h-[590px] w-full max-w-[420px] animate-pulse rounded-[24px] bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800" />
                ) : null}
                <img
                  src="/images/herosection-aboutpage.jpg"
                  alt="SmartMall hero"
                  onLoad={() => setIsImageLoaded(true)}
                  className={`h-[590px] w-auto object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
