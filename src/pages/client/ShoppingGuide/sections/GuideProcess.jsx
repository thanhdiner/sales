import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const formatStepAria = (template, step, title) =>
  String(template || '')
    .replace('{{step}}', step)
    .replace('{{title}}', title)

const GuideProcess = ({ content, currentStep, setCurrentStep }) => {
  const section = content?.processSection || {}
  const steps = content?.steps || []

  return (
    <motion.section
      id="shopping-guide-steps"
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
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
          <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">
            {section.eyebrow}
          </p>

          <h2 className="guide-title text-3xl font-semibold">{section.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map((step, index) => {
            const isActive = currentStep === index
            const title = step.title

            return (
              <motion.button
                key={`${title}-${index}`}
                type="button"
                onClick={() => setCurrentStep(index)}
                aria-label={formatStepAria(section.stepAria, index + 1, title)}
                className={`shopping-guide-card p-5 text-left transition-colors ${
                  isActive
                    ? '!border-emerald-500 !bg-emerald-50/70 shadow-[0_0_0_1px_rgba(16,185,129,0.18)] dark:!border-emerald-400/80 dark:!bg-emerald-950/20 dark:shadow-[0_0_0_1px_rgba(52,211,153,0.14)]'
                    : 'hover:!border-[var(--guide-border-strong)] hover:!bg-[var(--guide-surface-3)]'
                }`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
                viewport={shoppingGuideViewport}
              >
                <span
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-gray-950'
                      : 'border-[var(--guide-border)] bg-[var(--guide-surface-3)] text-[var(--guide-text-muted)]'
                  }`}
                >
                  {index + 1}
                </span>

                <h3 className="guide-title text-base font-semibold">{title}</h3>

                <p className="guide-muted mt-2 text-sm leading-6">{step.content}</p>
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
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            className="shopping-guide-secondary-button px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {section.previous}
          </button>

          <button
            type="button"
            disabled={currentStep >= steps.length - 1}
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
            className="shopping-guide-primary-button px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {section.next}
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideProcess
