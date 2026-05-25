import React, { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getArrayValue, getTextValue } from '../utils'

const itemIcons = [ShieldCheck, Truck, MessageCircle]

const sectionVariants = {
  hidden: {},
  visible: {}
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.045
    }
  }
}

const headingVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
  }
}

const ornamentVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
  }
}

const iconVariants = {
  hidden: { opacity: 0, scale: 0.82, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.24, ease: 'backOut' }
  }
}

const Benefits = ({ content }) => {
  const { t } = useTranslation('clientAbout')
  const sectionRef = useRef(null)
  const [isInView, setIsInView] = React.useState(true)
  const prefersReducedMotion = useReducedMotion()
  const animationState = prefersReducedMotion || isInView ? 'visible' : 'hidden'
  const items = getArrayValue(content?.items, t('benefitsSection.items', { returnObjects: true }))

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const node = sectionRef.current

    if (!node || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '-6% 0px -6% 0px',
        threshold: 0.12
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <motion.section
      id="benefits"
      ref={sectionRef}
      className="px-4 py-8 md:py-10"
      initial="hidden"
      animate={animationState}
      variants={sectionVariants}
    >
      <motion.div
        className="about-page__benefits-card mx-auto max-w-6xl overflow-hidden rounded-[8px] border border-[#ff8a2a] bg-[#fffdfa] px-6 pb-7 pt-3 shadow-[0_8px_24px_rgba(255,126,26,0.08)] md:px-12 md:pb-6"
        variants={cardVariants}
      >
        <motion.span
          className="about-page__benefits-dots about-page__benefits-dots--left"
          aria-hidden="true"
          variants={ornamentVariants}
        />
        <motion.span
          className="about-page__benefits-dots about-page__benefits-dots--right"
          aria-hidden="true"
          variants={ornamentVariants}
        />
        <motion.span
          className="about-page__benefits-wave about-page__benefits-wave--left"
          aria-hidden="true"
          variants={ornamentVariants}
        />
        <motion.span
          className="about-page__benefits-wave about-page__benefits-wave--right"
          aria-hidden="true"
          variants={ornamentVariants}
        />

        <motion.div className="about-page__benefits-heading mx-auto flex max-w-[620px] items-center justify-center gap-4" variants={headingVariants}>
          <span className="about-page__benefits-rule" aria-hidden="true" />
          <h2 className="about-page__section-title shrink-0 text-center text-[18px] font-extrabold uppercase leading-none tracking-normal text-[#ff650f] md:text-[22px]">
            {getTextValue(content?.title, t('benefitsSection.title'))}
          </h2>
          <span className="about-page__benefits-rule" aria-hidden="true" />
        </motion.div>

        <motion.div className="relative z-[1] mt-6 grid gap-6 md:mt-5 md:grid-cols-3 md:gap-0">
          {Array.isArray(items) &&
            items.map((item, index) => {
              const Icon = itemIcons[index] || ShieldCheck

              return (
                <motion.article
                  key={`${item.title}-${index}`}
                  className="about-page__benefit-item relative flex items-start gap-4 md:px-9"
                  variants={itemVariants}
                >
                  <motion.div
                    className="about-page__icon-pill flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#ff9c1f] to-[#ff5f0b] text-white shadow-[0_10px_18px_rgba(255,108,12,0.22)]"
                    variants={iconVariants}
                  >
                    <Icon className="h-[27px] w-[27px]" strokeWidth={2.1} />
                  </motion.div>

                  <div className="min-w-0">
                    <h3 className="about-page__item-title text-[13px] font-extrabold uppercase leading-tight tracking-normal text-[#111] md:text-[14px]">
                      {item.title}
                    </h3>

                    <p className="about-page__muted mt-2 max-w-[260px] text-[12px] leading-[1.75] text-[#555] md:text-[12px]">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              )
            })}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default Benefits
