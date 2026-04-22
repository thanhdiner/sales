import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideFaqData, shoppingGuideViewport } from '../data'

const GuideFaqSection = () => {
  return (
    <motion.section
      className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <motion.div
        className="mb-9 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        viewport={shoppingGuideViewport}
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          FAQ
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
          Câu hỏi thường gặp
        </h2>
      </motion.div>

      <div className="space-y-3">
        {shoppingGuideFaqData.map((faq, index) => (
          <motion.details
            key={faq.question}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 dark:text-white">
              <span>{faq.question}</span>
              <span className="text-lg leading-none text-gray-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>

            <p className="mt-4 whitespace-pre-line border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {faq.answer}
            </p>
          </motion.details>
        ))}
      </div>
    </motion.section>
  )
}

export default GuideFaqSection