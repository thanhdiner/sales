import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const GuideSupport = ({ content, websiteConfig, onBrowseProducts, onViewCoupons }) => {
  const section = content || {}
  const phone = websiteConfig?.contactInfo?.phone || '0823387108'
  const email = websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'

  return (
    <motion.section
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <motion.div
        className="mx-auto max-w-7xl p-2"
        initial={{ opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        viewport={shoppingGuideViewport}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">
              {section.eyebrow}
            </p>

            <h2 className="guide-title text-3xl font-semibold">{section.title}</h2>

            <div className="guide-muted mt-5 space-y-3 text-sm leading-6">
              <p>
                <span className="font-semibold text-[var(--guide-text)]">{section.phoneLabel}</span> {phone}
              </p>

              <p>
                <span className="font-semibold text-[var(--guide-text)]">{section.emailLabel}</span>{' '}
                <span className="break-all">{email}</span>
              </p>

              <p>
                <span className="font-semibold text-[var(--guide-text)]">{section.timeLabel}</span>{' '}
                {section.workingTime}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="md:text-right"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
            viewport={shoppingGuideViewport}
          >
            <p className="guide-muted text-base leading-7">{section.description}</p>

            <div className="mt-6 flex flex-wrap gap-3 md:justify-end">
              <button
                type="button"
                onClick={onBrowseProducts}
                className="shopping-guide-primary-button px-5 py-3 text-sm font-semibold"
              >
                {section.browseProducts}
              </button>

              <button
                type="button"
                onClick={onViewCoupons}
                className="shopping-guide-secondary-button px-5 py-3 text-sm font-semibold"
              >
                {section.viewCoupons}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default GuideSupport
