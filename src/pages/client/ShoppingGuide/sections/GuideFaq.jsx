import React from 'react'
import { motion } from 'framer-motion'
import { Calculator, CircleHelp, PackageSearch, RefreshCw, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { shoppingGuideViewport } from '../data'

const faqIcons = [PackageSearch, Truck, RefreshCw, Calculator]

const GuideFaq = ({ content }) => {
  const section = content?.faqSection || {}
  const faqData = content?.faq || []
  const securityNote = content?.paymentSection?.securityNote || ''

  return (
    <motion.section
      id="shopping-guide-faq"
      className="shopping-guide-section shopping-guide-faq-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <div className="shopping-guide-faq-shell">
        <span className="shopping-guide-faq-decoration shopping-guide-faq-decoration--dots" aria-hidden="true" />
        <Sparkles className="shopping-guide-faq-decoration shopping-guide-faq-decoration--spark-one" aria-hidden="true" />
        <Sparkles className="shopping-guide-faq-decoration shopping-guide-faq-decoration--spark-two" aria-hidden="true" />

        <motion.div
          className="shopping-guide-faq-heading"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <span className="shopping-guide-faq-heading__icon" aria-hidden="true">
            <CircleHelp className="h-9 w-9" />
          </span>

          <p className="shopping-guide-faq-heading__eyebrow">{section.eyebrow}</p>

          <h2>{section.title}</h2>
        </motion.div>

        <div className="shopping-guide-faq-list">
          {faqData.map((faq, index) => {
            const Icon = faqIcons[index % faqIcons.length]

            return (
              <motion.details
                key={`${faq.question}-${index}`}
                className="shopping-guide-faq-item group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
                viewport={shoppingGuideViewport}
              >
                <summary aria-label={section.toggle} className="shopping-guide-faq-summary">
                  <span className="shopping-guide-faq-summary__icon" aria-hidden="true">
                    <Icon className="h-7 w-7" />
                  </span>

                  <span className="shopping-guide-faq-summary__question">
                    {faq.question}
                  </span>

                  <span className="shopping-guide-faq-summary__inline-plus" aria-hidden="true">+</span>
                </summary>

                <p className="shopping-guide-faq-answer">{faq.answer}</p>
              </motion.details>
            )
          })}
        </div>

        {securityNote ? (
          <motion.div
            className="shopping-guide-faq-security"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <span className="shopping-guide-faq-security__icon" aria-hidden="true">
              <ShieldCheck className="h-7 w-7" />
            </span>

            <span>{securityNote}</span>
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  )
}

export default GuideFaq
