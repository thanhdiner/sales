import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const GuideDetailedStepsSection = ({ content }) => {
  const section = content?.detailedStepsSection || {}
  const detailedSteps = content?.detailedSteps || []

  return (
    <motion.section
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <motion.div
        className="mx-auto mb-10 max-w-7xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        viewport={shoppingGuideViewport}
      >
        <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">
          {section.eyebrow}
        </p>

        <h2 className="guide-title text-3xl font-semibold md:text-4xl">
          {section.title}
        </h2>
      </motion.div>

      <div className="mx-auto max-w-7xl space-y-4">
        {detailedSteps.map((item, index) => {
          return (
            <motion.article
              key={`${item.id || item.title}-${index}`}
              className={`shopping-guide-panel grid items-center gap-8 p-5 md:grid-cols-2 lg:p-6 ${item.reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
              viewport={shoppingGuideViewport}
            >
              <div>
                <p className="guide-subtle mb-2 text-sm font-semibold">{item.id}</p>

                <h3 className="guide-title mb-3 text-2xl font-semibold">{item.title}</h3>

                <p className="guide-muted leading-7">{item.description}</p>

                {item.chips?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.chips.map(chip => (
                      <span
                        key={chip}
                        className="rounded-full border border-[var(--guide-border)] bg-[var(--guide-surface-2)] px-3 py-1.5 text-sm text-[var(--guide-text-muted)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {item.checks?.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {item.checks.map(check => (
                      <li key={check} className="text-sm leading-6 text-[var(--guide-text-muted)]">
                        {check}
                      </li>
                    ))}
                  </ul>
                )}

                {item.note && (
                  <div className="shopping-guide-card mt-5 p-4 text-sm leading-6 text-[var(--guide-text-muted)]">
                    {item.note}
                  </div>
                )}
              </div>

              <div className="shopping-guide-image h-64 w-full overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  )
}

export default GuideDetailedStepsSection
