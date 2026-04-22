import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const GuideSupportSection = ({ websiteConfig, onBrowseProducts, onViewCoupons }) => {
  const phone = websiteConfig?.contactInfo?.phone || '0823387108'
  const email = websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'

  return (
    <motion.section
      className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <motion.div
        className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8"
        initial={{ opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        viewport={shoppingGuideViewport}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              Hỗ trợ
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
              Bạn cần trợ giúp thêm?
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Điện thoại:</span>{' '}
                {phone}
              </p>

              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Email:</span>{' '}
                <span className="break-all">{email}</span>
              </p>

              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Thời gian:</span>{' '}
                8:00 - 22:00 (Thứ 2 - Chủ Nhật)
              </p>
            </div>
          </motion.div>

          <motion.div
            className="md:text-right"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
              Sẵn sàng bắt đầu mua sắm? Khám phá các sản phẩm và ưu đãi hiện có trên website.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 md:justify-end">
              <button
                onClick={onBrowseProducts}
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                Bắt đầu mua sắm
              </button>

              <button
                onClick={onViewCoupons}
                className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Xem khuyến mãi
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default GuideSupportSection