import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuidePaymentMethods, shoppingGuideViewport } from '../data'

const GuidePaymentSection = () => {
  return (
    <motion.section
      className="border-y border-gray-200 bg-gray-50 px-4 py-14 dark:border-gray-700 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-9 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Thanh toán
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            Phương thức thanh toán
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
            Chọn phương thức phù hợp để hoàn tất đơn hàng nhanh chóng và an toàn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {shoppingGuidePaymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
              viewport={shoppingGuideViewport}
            >
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {method.name}
                </h3>

                {method.popular && (
                  <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    Phổ biến
                  </span>
                )}
              </div>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {method.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {method.badges.map(badge => (
                  <span
                    key={badge}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 text-center text-sm leading-6 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          Tất cả giao dịch được xử lý qua kết nối bảo mật, giúp thông tin thanh toán của bạn an toàn hơn.
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuidePaymentSection