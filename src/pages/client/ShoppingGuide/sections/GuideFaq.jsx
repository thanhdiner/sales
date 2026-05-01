import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const GuideFaq = ({ content }) => {
  const section = content?.faqSection || {}
  const faqData = content?.faq || []

  return (
    <motion.section
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
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
        <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">{section.eyebrow}</p>

        <h2 className="guide-title text-3xl font-semibold">{section.title}</h2>
      </motion.div>

      <div className="mx-auto max-w-4xl space-y-3">
        {faqData.map((faq, index) => (
          <motion.details
            key={`${faq.question}-${index}`}
            className="shopping-guide-card group p-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <summary
              aria-label={section.toggle}
              className="guide-title flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold"
            >
              <span>{faq.question}</span>

              <span className="text-lg leading-none text-[var(--guide-text-subtle)] transition-transform group-open:rotate-45">+</span>
            </summary>

            <p className="guide-muted mt-4 whitespace-pre-line border-t border-[var(--guide-border)] pt-4 text-sm leading-6">
              {faq.answer}
            </p>
          </motion.details>
        ))}
      </div>
    </motion.section>
  )
}

export default GuideFaq
