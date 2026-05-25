import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTextValue, navigateToAboutLink } from '../utils'

const CTA = ({ content, viewport = { once: true, amount: 0.25 } }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('clientAbout')
  const replayViewport = { ...viewport, once: false, amount: viewport?.amount ?? 0.25 }

  return (
    <motion.section
      className="px-4 py-12 md:px-6 md:py-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={replayViewport}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="about-page__cta relative overflow-hidden rounded-[22px] border border-[#fed7aa] bg-white shadow-[0_18px_42px_rgba(249,115,22,0.12)]"
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={replayViewport}
        >
          <motion.div
            className="about-page__cta-decor absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#fb923c]/35"
            initial={{ opacity: 0, scale: 0.72 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={replayViewport}
          />
          <motion.div
            className="about-page__cta-decor absolute -left-10 top-10 h-20 w-20 rounded-full bg-[#fed7aa]"
            initial={{ opacity: 0, scale: 0.76, x: -12 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            viewport={replayViewport}
          />
          <motion.div
            className="about-page__cta-decor absolute -bottom-14 left-8 h-28 w-28 rounded-full border-[8px] border-[#fb923c]/45"
            initial={{ opacity: 0, scale: 0.78, y: 18 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={replayViewport}
          />
          <div className="about-page__cta-decor absolute bottom-10 left-12 h-3 w-3 rounded-full bg-[#f59e0b]" />
          <div className="about-page__cta-decor absolute bottom-16 left-20 h-2.5 w-2.5 rounded-full bg-[#f97316]" />
          <div className="about-page__cta-decor absolute bottom-8 left-24 h-2.5 w-2.5 rounded-full bg-[#c2410c]" />
          <div className="about-page__cta-decor absolute bottom-7 left-36 h-16 w-px rotate-45 bg-[#c2410c]" />
          <div className="about-page__cta-decor absolute bottom-6 left-44 h-16 w-px rotate-45 bg-[#c2410c]" />

          <div className="relative z-10 flex min-h-[230px] flex-col items-center justify-center px-6 py-10 text-center md:px-12">
            <motion.h2
              className="mb-3 text-[24px] font-extrabold leading-tight text-[#431407] md:text-[40px]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              viewport={replayViewport}
            >
              {getTextValue(content?.title, t('ctaSection.title'))}
            </motion.h2>

            <motion.p
              className="about-page__muted mb-5 max-w-[620px] text-[13px] font-medium text-[#7c2d12] md:text-[20px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              viewport={replayViewport}
            >
              {getTextValue(content?.description, t('ctaSection.description'))}
            </motion.p>

            <motion.button
              type="button"
              onClick={() => navigateToAboutLink(navigate, content?.buttonLink, '/products')}
              className="about-page__primary-button about-page__cta-button rounded-[4px] bg-[#f97316] px-6 py-2 text-[11px] font-bold text-white shadow-[0_10px_24px_rgba(249,115,22,0.28)] transition hover:bg-[#ea580c] md:text-[14px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              viewport={replayViewport}
            >
              {getTextValue(content?.button, t('ctaSection.button'))}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default CTA
