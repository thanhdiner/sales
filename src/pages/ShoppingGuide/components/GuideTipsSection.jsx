import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideSmartTips, shoppingGuideViewport } from '../data'

const TIPS_IMAGE_LEFT =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMtKLoEDMf7BJ_X1scBglcB5D2jbLWcZAasPXiRJtqKzLKG1lnnkN_g0pVYISWHxAxQm8TRJrJSrS--btGGVMUDX4OiJqIIoB_4j8zUgOr4RsjUZXfL2feLraZHpBR2j4EVfuDTmQIxIub7ZiaIKf5He_plN5X-fI277ya3YOqm6unv7nKKtNtcK3TbJWTTI114_RYzm4qcXQt4q5VoDBYLSglqhQp1ENhLRNwvz-DlFhAJmqkYGFjhijO5ymIbxtysa-t4I1Uc2s'

const GuideTipsSection = () => {
  return (
    <motion.section
      className="border-y border-gray-200 bg-gray-50 px-4 py-14 dark:border-gray-700 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Mẹo mua hàng
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-4xl">
            Mua hàng thông minh hơn
          </h2>

          <p className="mt-3 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">
            Một vài lưu ý nhỏ giúp bạn chọn sản phẩm phù hợp và đặt hàng thuận tiện hơn.
          </p>

          <ul className="mt-7 space-y-3">
            {shoppingGuideSmartTips.map((tip, index) => (
              <li
                key={tip}
                className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <div className="h-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:h-[420px]">
            <img
              alt="Smart shopping"
              src={TIPS_IMAGE_LEFT}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideTipsSection