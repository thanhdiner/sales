import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideDetailedSteps, shoppingGuideViewport } from '../data'

const GuideDetailedStepsSection = () => {
  return (
    <motion.section
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        viewport={shoppingGuideViewport}
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          Hướng dẫn chi tiết
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-4xl">
          Chi tiết từng bước
        </h2>
      </motion.div>

      <div className="space-y-12">
        {shoppingGuideDetailedSteps.map((item, index) => (
          <motion.article
            key={item.id}
            className={`grid items-center gap-8 md:grid-cols-2 ${
              item.reverse ? 'md:[&>*:first-child]:order-2' : ''
            }`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                {item.id}
              </p>

              <h3 className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">
                {item.title}
              </h3>

              <p className="leading-7 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>

              {item.chips && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.chips.map(chip => (
                    <span
                      key={chip}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              {item.checks && (
                <ul className="mt-5 space-y-2">
                  {item.checks.map(check => (
                    <li
                      key={check}
                      className="text-sm leading-6 text-gray-700 dark:text-gray-200"
                    >
                      {check}
                    </li>
                  ))}
                </ul>
              )}

              {item.note && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {item.note}
                </div>
              )}
            </div>

            <div className="h-64 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

export default GuideDetailedStepsSection