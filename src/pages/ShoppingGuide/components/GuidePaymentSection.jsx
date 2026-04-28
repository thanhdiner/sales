import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const GuidePaymentSection = ({ content }) => {
  const section = content?.paymentSection || {}
  const paymentMethods = content?.paymentMethods || []

  return (
    <motion.section
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

          <p className="guide-muted mx-auto mt-3 max-w-2xl text-base leading-7">{section.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon

            return (
              <motion.div
                key={`${method.name}-${index}`}
                className="shopping-guide-card p-5"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
                viewport={shoppingGuideViewport}
              >
                <div className="mb-2 flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-[var(--guide-accent)]" />}

                  <h3 className="guide-title text-lg font-semibold">{method.name}</h3>

                  {method.popular && (
                    <span className="rounded-full border border-[var(--guide-border)] bg-[var(--guide-accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--guide-accent)]">
                      {section.popular}
                    </span>
                  )}
                </div>

                <p className="guide-muted text-sm leading-6">{method.desc}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {method.badges?.map(badge => (
                    <span
                      key={badge}
                      className="rounded-full bg-[var(--guide-surface-3)] px-3 py-1 text-xs font-medium text-[var(--guide-text-muted)]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="shopping-guide-card mx-auto mt-8 max-w-3xl p-4 text-center text-sm leading-6 text-[var(--guide-text-muted)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          {section.securityNote}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuidePaymentSection
