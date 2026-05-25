import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ShieldCheck, ShoppingCart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getArrayValue, getTextValue, navigateToAboutLink } from '../utils'

const copyVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
}

const cardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const Hero = ({ content, isVisible, viewport }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('clientAbout')
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const titleLines = getArrayValue(content?.titleLines, t('heroSection.titleLines', { returnObjects: true }))
  const heroImageUrl = getTextValue(content?.imageUrl, '/images/herosection-aboutpage.jpg')
  const replayViewport = { once: false, amount: 0.35 }

  return (
    <motion.section
      className={`relative px-4 pt-3 pb-10 sm:px-6 md:pt-4 md:pb-14 lg:px-10 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="about-page__hero-shell grid overflow-hidden rounded-[10px] lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <motion.div
            className="relative z-10 min-w-0 px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9 lg:px-8 lg:py-10 xl:px-10"
            variants={copyVariants}
            initial="hidden"
            whileInView="visible"
            viewport={replayViewport}
          >
            <motion.p
              className="about-page__hero-eyebrow mb-3 text-[13px] font-extrabold uppercase leading-none text-[#f97316]"
              variants={fadeUpVariant}
            >
              {getTextValue(content?.eyebrow, t('heroSection.eyebrow'))}
            </motion.p>

            <motion.h1
              className="about-page__hero-title max-w-[430px] break-words text-[34px] font-extrabold leading-[1.02] text-[#2b1307] sm:text-[42px] md:text-[48px] lg:text-[48px] xl:text-[52px]"
              variants={fadeUpVariant}
            >
              {Array.isArray(titleLines) &&
                titleLines.map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </motion.h1>

            <motion.p
              className="about-page__lead mt-4 max-w-[505px] break-words text-[14px] font-medium leading-[1.75] text-[#5a3928] sm:text-[15px]"
              variants={fadeUpVariant}
            >
              {getTextValue(content?.description, t('heroSection.description'))}
            </motion.p>

            <motion.div className="mt-6 flex flex-wrap items-center gap-3" variants={fadeUpVariant}>
              <button
                type="button"
                onClick={() => navigateToAboutLink(navigate, content?.primaryButtonLink, '/products')}
                className="about-page__primary-button inline-flex h-11 items-center justify-center rounded-[11px] bg-[#f97316] px-6 text-[13px] font-bold text-white shadow-[0_12px_26px_rgba(249,115,22,0.28)] transition hover:bg-[#ea580c]"
              >
                {getTextValue(content?.primaryButton, t('heroSection.primaryButton'))}
              </button>

              <button
                type="button"
                onClick={() => navigateToAboutLink(navigate, content?.secondaryButtonLink, '/contact')}
                className="about-page__secondary-button inline-flex h-11 items-center justify-center gap-2 rounded-[11px] border border-[#fed7aa] bg-white px-6 text-[13px] font-bold text-[#c2410c] transition hover:bg-[#fff7ed]"
              >
                {getTextValue(content?.secondaryButton, t('heroSection.secondaryButton'))}
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.6} />
              </button>
            </motion.div>

            <motion.div className="mt-5 grid max-w-[520px] gap-4 sm:grid-cols-2" variants={copyVariants}>
              <motion.div
                className="about-page__mini-card rounded-[10px] border border-[#ffead5] bg-white px-6 py-4 shadow-[0_18px_34px_rgba(154,75,18,0.1)]"
                variants={cardVariant}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                <div className="mb-3 flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.58 + i * 0.04, duration: 0.28, ease: 'backOut' }}
                    >
                      <Star className="h-3.5 w-3.5 fill-[#10b981] text-[#10b981]" />
                    </motion.span>
                  ))}
                </div>

                <p className="about-page__rating-value text-[17px] font-extrabold leading-none text-[#2b1307]">
                  4.2/5{' '}
                  <span className="about-page__subtle text-[12px] font-semibold text-[#605f78]">
                    (45k {getTextValue(content?.reviews, t('heroSection.reviews'))})
                  </span>
                </p>

                <p className="about-page__subtle mt-4 text-[11px] font-semibold text-[#a36a45]">SmartMall</p>
              </motion.div>

              <motion.div
                className="about-page__mini-card rounded-[10px] border border-[#ffead5] bg-white px-6 py-4 shadow-[0_18px_34px_rgba(154,75,18,0.1)]"
                variants={cardVariant}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                <div className="mb-3 flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.68 + i * 0.04, duration: 0.28, ease: 'backOut' }}
                    >
                      <Star className="h-3.5 w-3.5 fill-[#ff8615] text-[#ff8615]" />
                    </motion.span>
                  ))}
                </div>

                <p className="about-page__rating-value text-[17px] font-extrabold leading-none text-[#2b1307]">
                  4.1/5{' '}
                  <span className="about-page__subtle text-[12px] font-semibold text-[#605f78]">
                    (18k {getTextValue(content?.reviews, t('heroSection.reviews'))})
                  </span>
                </p>

                <p className="about-page__subtle mt-4 text-[11px] font-semibold text-[#a36a45]">SmartMall</p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={replayViewport}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about-page__image-frame h-full bg-transparent p-0">
              <div className="about-page__image-canvas relative flex min-h-[390px] h-full items-end justify-center overflow-hidden bg-transparent sm:min-h-[420px] lg:min-h-[418px]">
                <motion.div
                  className="about-page__hero-orbit about-page__hero-orbit--primary"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 360 }}
                  viewport={replayViewport}
                  transition={{
                    opacity: { duration: 0.45 },
                    scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    rotate: { duration: 24, repeat: Infinity, ease: 'linear' }
                  }}
                />
                <motion.div
                  className="about-page__hero-orbit about-page__hero-orbit--secondary"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -360 }}
                  viewport={replayViewport}
                  transition={{
                    opacity: { duration: 0.45 },
                    scale: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                    rotate: { duration: 32, repeat: Infinity, ease: 'linear' }
                  }}
                />
                <motion.div
                  className="about-page__hero-dot-grid"
                  aria-hidden="true"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 0.58, x: 0 }}
                  viewport={replayViewport}
                  transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
                />

                <motion.div
                  className="about-page__floating-icon about-page__floating-icon--shield"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.72, y: -10 }}
                  whileInView={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
                  viewport={replayViewport}
                  transition={{
                    opacity: { duration: 0.35, delay: 0.28 },
                    scale: { duration: 0.5, delay: 0.28, ease: 'backOut' },
                    y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.85 }
                  }}
                >
                  <ShieldCheck className="h-8 w-8" strokeWidth={2.4} />
                </motion.div>

                <motion.div
                  className="about-page__floating-icon about-page__floating-icon--cart"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.72, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: [0, 7, 0] }}
                  viewport={replayViewport}
                  transition={{
                    opacity: { duration: 0.35, delay: 0.38 },
                    scale: { duration: 0.5, delay: 0.38, ease: 'backOut' },
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }
                  }}
                >
                  <ShoppingCart className="h-8 w-8" strokeWidth={2.4} />
                </motion.div>

                {!isImageLoaded ? (
                  <div className="about-page__skeleton relative z-[3] h-[410px] w-full max-w-[340px] animate-pulse rounded-[24px] bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800" />
                ) : null}

                <motion.img
                  src={heroImageUrl}
                  alt={getTextValue(content?.imageAlt, t('heroSection.imageAlt'))}
                  onLoad={() => setIsImageLoaded(true)}
                  initial={{ opacity: 0, y: 26, scale: 0.97 }}
                  whileInView={{ opacity: isImageLoaded ? 1 : 0, y: 0, scale: 1 }}
                  viewport={replayViewport}
                  transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className={`about-page__hero-person relative z-[3] h-[410px] w-auto max-w-full object-contain transition-opacity duration-300 sm:h-[455px] lg:h-[455px] lg:max-w-none xl:h-[485px] ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Hero
