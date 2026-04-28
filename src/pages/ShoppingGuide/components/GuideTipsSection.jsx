import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideTipsImage, shoppingGuideViewport } from '../data'

const GuideTipsSection = ({ content }) => {
  const section = content?.tipsSection || {}
  const smartTips = content?.smartTips || []

  return (
    <motion.section
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
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
          <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">
            {section.eyebrow}
          </p>

          <h2 className="guide-title text-3xl font-semibold md:text-4xl">{section.title}</h2>

          <p className="guide-muted mt-3 max-w-xl text-base leading-7">{section.description}</p>

          <ul className="mt-7 space-y-3">
            {smartTips.map((tip, index) => (
              <li
                key={`${tip}-${index}`}
                className="shopping-guide-card flex gap-3 p-4 text-sm leading-6 text-[var(--guide-text-muted)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--guide-accent-soft)] text-sm font-semibold text-[var(--guide-accent)]">
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
          <div className="shopping-guide-image h-[320px] overflow-hidden md:h-[420px]">
            <img alt={section.imageAlt} src={section.image || shoppingGuideTipsImage} className="h-full w-full object-cover" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideTipsSection
