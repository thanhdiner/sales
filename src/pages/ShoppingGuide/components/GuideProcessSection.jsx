import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideSteps, shoppingGuideViewport } from '../data'

const GuideProcessSection = ({ currentStep, setCurrentStep }) => {
  return (
    <motion.section
      id="shopping-guide-steps"
      className="border-y border-gray-200 bg-white px-4 py-14 dark:border-gray-700 dark:bg-gray-900 sm:px-6 lg:px-8"
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
            Các bước thực hiện
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            Quy trình mua sắm
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {shoppingGuideSteps.map((step, index) => {
            const isActive = currentStep === index

            return (
              <motion.button
                key={step.title}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  isActive
                    ? 'border-gray-900 bg-gray-50 dark:border-gray-200 dark:bg-gray-800'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
                viewport={shoppingGuideViewport}
              >
                <span
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold ${
                    isActive
                      ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                      : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {index + 1}
                </span>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {step.content}
                </p>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          className="mt-7 flex justify-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Quay lại
          </button>

          <button
            disabled={currentStep === shoppingGuideSteps.length - 1}
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, shoppingGuideSteps.length - 1))}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            Tiếp theo
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideProcessSection