import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getArrayValue, getTextValue, navigateToAboutLink } from '../utils'

const sectionVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.06
    }
  }
}

const copyVariants = {
  hidden: { opacity: 0.18, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: 'easeOut' }
  }
}

const visualVariants = {
  hidden: { opacity: 0.18, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.34,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.08
    }
  }
}

const pathVariants = {
  hidden: { pathLength: 0.12, opacity: 0.18 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.62, ease: 'easeInOut' }
  }
}

const orbitVariants = {
  hidden: { opacity: 0.35, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.34, ease: 'easeOut' }
  }
}

const pathSvgVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08
    }
  }
}

const stepVariants = {
  hidden: { opacity: 0.2, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

const Features = ({ content }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('clientAbout')
  const sectionRef = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(sectionRef, { amount: 0.35, margin: '-8% 0px -8% 0px' })

  const steps = getArrayValue(content?.steps, t('featuresSection.steps', { returnObjects: true }))
  const titleLines = getArrayValue(content?.titleLines, t('featuresSection.titleLines', { returnObjects: true }))

  useEffect(() => {
    controls.stop()

    if (isInView) {
      controls.set('hidden')
      controls.start('visible')
      return
    }

    controls.set('hidden')
  }, [controls, isInView])

  return (
    <motion.section
      ref={sectionRef}
      className="font-['Manrope',_sans-serif] relative overflow-hidden px-3 py-14 md:px-4 md:py-20"
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <div className="about-page__surface relative mx-auto max-w-7xl rounded-[32px] bg-white px-8 py-16 shadow-[0_8px_30px_rgba(0,0,0,0.02)] md:px-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div
            className="relative z-10"
            variants={copyVariants}
          >
            <p className="about-page__eyebrow mb-4 text-[14px] font-bold uppercase text-[#f57059]">
              {getTextValue(content?.eyebrow, t('featuresSection.eyebrow'))}
            </p>

            <h2 className="about-page__section-title max-w-[460px] text-[32px] font-extrabold tracking-[-1.2px] text-black md:text-[40px] md:leading-[48px]">
              {Array.isArray(titleLines) &&
                titleLines.map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </h2>

            <p className="about-page__muted mt-6 max-w-[480px] text-[16px] font-medium leading-[30px] tracking-[-0.32px] text-[#64607d]">
              {getTextValue(content?.description, t('featuresSection.description'))}
            </p>

            <button
              type="button"
              onClick={() => navigateToAboutLink(navigate, content?.buttonLink, '/products')}
              className="about-page__primary-button mt-10 inline-flex h-[47px] items-center justify-center rounded-[47px] bg-[#f57059] px-8 text-[16px] font-semibold tracking-[-0.32px] text-white transition-all hover:bg-[#e65a43] hover:shadow-[0_8px_20px_rgba(245,112,89,0.25)]"
            >
              {getTextValue(content?.button, t('featuresSection.button'))}
            </button>
          </motion.div>

          <motion.div
            variants={visualVariants}
            className="relative min-h-[600px] w-full"
          >
            <motion.div
              className="about-page__soft-orbit absolute -right-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#f8f9fc]"
              variants={orbitVariants}
            />

            <motion.svg
              className="about-page__feature-path absolute inset-0 h-full w-full drop-shadow-[0_16px_16px_rgba(245,112,89,0.15)]"
              viewBox="0 0 1070 448"
              fill="none"
              preserveAspectRatio="none"
              variants={pathSvgVariants}
            >
              <motion.path
                d="M26.5002 310.297C74.5002 345.297 186.3 411.297 249.5 395.297C328.5 375.297 348 272.297 470 248.297C592 224.297 681.5 307.797 776 187.297C870.5 66.7967 916.5 -12.2033 1043.5 4.79669"
                stroke="#f57059"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={pathVariants}
              />
            </motion.svg>

            <motion.div className="absolute left-[16%] top-[87%]" variants={stepVariants}>
              <span className="about-page__ghost-number pointer-events-none absolute left-[100px] -top-[70px] z-0 select-none text-[160px] font-black leading-none tracking-tighter text-black opacity-[0.03]">
                1
              </span>
              <div className="about-page__milestone absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
                <div className="h-[22px] w-[22px] rounded-full bg-[#c4c4c4]" />
              </div>
              <div className="absolute left-[-32px] top-[40px] w-[250px]">
                <h3 className="about-page__item-title text-[17px] font-extrabold text-[#0f1115]">
                  {steps?.[0]?.title}
                </h3>
                <p className="about-page__muted mt-2 text-[15px] font-medium leading-[1.7] text-[#64607d]">
                  {steps?.[0]?.description}
                </p>
              </div>
            </motion.div>

            <motion.div className="absolute left-[58%] top-[56%]" variants={stepVariants}>
              <span className="about-page__ghost-number pointer-events-none absolute left-[100px] -top-[70px] z-0 select-none text-[160px] font-black leading-none tracking-tighter text-black opacity-[0.03]">
                2
              </span>
              <div className="about-page__milestone absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
                <div className="h-[22px] w-[22px] rounded-full bg-[#c4c4c4]" />
              </div>
              <div className="absolute left-[-32px] top-[40px] w-[250px]">
                <h3 className="about-page__item-title text-[17px] font-extrabold text-[#0f1115]">
                  {steps?.[1]?.title}
                </h3>
                <p className="about-page__muted mt-2 text-[15px] font-medium leading-[1.7] text-[#64607d]">
                  {steps?.[1]?.description}
                </p>
              </div>
            </motion.div>

            <motion.div className="absolute left-[88%] top-[4%]" variants={stepVariants}>
              <span className="about-page__ghost-number pointer-events-none absolute right-[100px] -top-[70px] z-0 select-none text-[160px] font-black leading-none tracking-tighter text-black opacity-[0.03]">
                3
              </span>
              <div className="about-page__milestone absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
                <div className="h-[22px] w-[22px] rounded-full bg-[#c4c4c4]" />
              </div>
              <div className="absolute right-[-32px] top-[40px] w-[250px] text-right">
                <h3 className="about-page__item-title text-[17px] font-extrabold text-[#0f1115]">
                  {steps?.[2]?.title}
                </h3>
                <p className="about-page__muted mt-2 text-[15px] font-medium leading-[1.7] text-[#64607d]">
                  {steps?.[2]?.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Features
