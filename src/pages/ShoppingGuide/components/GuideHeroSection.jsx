import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9JhwkqCqqiKnWbxgjgrNufgJ3lG26LGdj30S8l9871ZNqvv-cvUffVCtx__SttaDpNRbsnRtv3UIJy3YvVnKP5bQgmt6UwQRSCDTVkCTC42iS0MtL183okT4QH2GVnmwJk0ptTylvKeJyf4O4cr5a3Nq7NqUn4iY67ZR6Gy_-6w8Fxt-P2CzlFq8Xj0BZ5m6_vHcz6reuzvWg_8KhAHBzfd_bL0V2TYmoFMosoo4Dpw0mqm6WxApuLzbN4qrRebrNgPqc2_zXpnk'

const GuideHeroSection = ({ onRegister }) => {
  return (
    <motion.section
      className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Hướng dẫn mua hàng
          </p>

          <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-gray-900 dark:text-white md:text-5xl">
            Mua sắm dễ dàng và an toàn
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">
            Xem các bước đặt hàng, thanh toán và theo dõi đơn hàng để mua sắm thuận tiện hơn trên website.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onRegister}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
            >
              Đăng ký tài khoản
            </button>

            <a
              href="#shopping-guide-steps"
              className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Xem hướng dẫn
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <img
            alt="Shopping online concept"
            src={HERO_IMAGE}
            className="h-[300px] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-700 md:h-[380px]"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideHeroSection