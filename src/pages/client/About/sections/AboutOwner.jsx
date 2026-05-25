import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Gift, Users, BadgeDollarSign, MessageCircleMore } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getArrayValue, getTextValue } from '../utils'

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 }
  }
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: custom => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: custom * 0.06, ease: [0.22, 1, 0.36, 1] }
  })
}

const titleLineVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.38, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
  }
}

const statVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.88 },
  visible: custom => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, delay: 0.28 + custom * 0.06, ease: [0.22, 1, 0.36, 1] }
  })
}

const mediaVariants = {
  hidden: { opacity: 0, x: 42, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
  }
}

const opacityVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.36, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
  }
}

const decorVariants = {
  hidden: { opacity: 0, scale: 0.82, rotate: -8 },
  visible: custom => ({
    opacity: custom.opacity,
    scale: 1,
    rotate: custom.rotate || 0,
    transition: { duration: 0.5, delay: custom.delay, ease: [0.22, 1, 0.36, 1] }
  })
}

const ribbonVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, delay: 0.48, ease: [0.22, 1, 0.36, 1] }
  }
}

const StatCircle = ({ Icon, label, controls, index }) => {
  return (
    <motion.div
      className="about-page__owner-stat flex flex-col items-center text-center"
      custom={index}
      initial="hidden"
      animate={controls}
      variants={statVariants}
    >
      <div className="about-page__owner-stat-icon mb-2 flex h-[38px] w-[38px] items-center justify-center rounded-full">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </div>

      <div className="about-page__stat-label text-[11px] font-bold leading-tight text-[#111111]">{label}</div>
    </motion.div>
  )
}

const AboutOwner = ({ content }) => {
  const { t } = useTranslation('clientAbout')
  const [isOwnerImageLoaded, setIsOwnerImageLoaded] = useState(false)
  const sectionRef = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(sectionRef, { amount: 0.38, margin: '-10% 0px -10% 0px' })

  const stats = [
    { icon: Gift, label: getTextValue(content?.stats?.goodPrice, t('ownerSection.stats.goodPrice')) },
    { icon: Users, label: getTextValue(content?.stats?.support, t('ownerSection.stats.support')) },
    { icon: BadgeDollarSign, label: getTextValue(content?.stats?.easyBuy, t('ownerSection.stats.easyBuy')) },
    { icon: MessageCircleMore, label: getTextValue(content?.stats?.consulting, t('ownerSection.stats.consulting')) }
  ]

  const paragraphs = getArrayValue(content?.paragraphs, t('ownerSection.paragraphs', { returnObjects: true }))
  const title = getTextValue(content?.title, t('ownerSection.title'))
  const titleWords = title.split(' ')
  const titleIntro = titleWords.slice(0, 2).join(' ')
  const titleAccent = titleWords.slice(2).join(' ')
  const ownerImageUrl = getTextValue(
    content?.imageUrl,
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80'
  )

  useEffect(() => {
    if (window.location.hash !== '#behind-shop') return

    requestAnimationFrame(() => {
      document.getElementById('behind-shop')?.scrollIntoView({ block: 'start' })
    })
  }, [])

  useEffect(() => {
    controls.start(isInView ? 'visible' : 'hidden')
  }, [controls, isInView])

  return (
    <section ref={sectionRef} id="behind-shop" className="scroll-mt-24 px-4 py-10 md:scroll-mt-28 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="about-page__owner-template relative overflow-hidden rounded-[8px] border border-[#ffe3cf] bg-[#fffaf7]"
          initial="hidden"
          animate={controls}
          variants={cardVariants}
        >
          <motion.span
            className="about-page__owner-dot-grid about-page__owner-dot-grid--center"
            custom={{ opacity: 0.8, delay: 0.34, rotate: 0 }}
            variants={decorVariants}
            aria-hidden="true"
          />

          <div className="relative z-[1] grid min-h-[430px] grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8 md:px-10 lg:py-10">
              <motion.h2
                className="about-page__owner-title max-w-[360px] text-[34px] font-extrabold leading-[0.98] text-[#050505] sm:text-[42px] md:text-[48px]"
                custom={0}
                variants={fadeUpVariants}
              >
                <span className="block">{titleIntro || title}</span>
                {titleAccent ? <span className="block text-[#ff6b00]">{titleAccent}</span> : null}
              </motion.h2>

              <motion.div
                className="about-page__owner-title-line mt-4 h-[3px] w-[70px] origin-left bg-[#ff6b00]"
                variants={titleLineVariants}
              />

              <div className="about-page__owner-copy mt-6 max-w-[460px] space-y-5 text-[13px] font-medium leading-[1.8] text-[#4d4d4d] md:text-[14px]">
                {Array.isArray(paragraphs) &&
                  paragraphs.map((paragraph, index) => (
                    <motion.p key={`${paragraph}-${index}`} custom={index + 2} variants={fadeUpVariants}>
                      {paragraph}
                    </motion.p>
                  ))}
              </div>

              <div className="mt-8 grid max-w-[430px] grid-cols-4 gap-3">
                {stats.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <StatCircle
                      key={item.label}
                      Icon={Icon}
                      label={item.label}
                      controls={controls}
                      index={index}
                    />
                  )
                })}
              </div>
            </div>

            <motion.div className="about-page__owner-media relative min-h-[370px] overflow-hidden lg:min-h-full" variants={mediaVariants}>
              <motion.span
                className="about-page__owner-dot-grid about-page__owner-dot-grid--right"
                custom={{ opacity: 0.36, delay: 0.4, rotate: 0 }}
                variants={decorVariants}
                aria-hidden="true"
              />
              <motion.span
                className="about-page__owner-blob about-page__owner-blob--top"
                custom={{ opacity: 0.9, delay: 0.34, rotate: 10 }}
                variants={decorVariants}
                aria-hidden="true"
              />
              <motion.span
                className="about-page__owner-blob about-page__owner-blob--bottom"
                custom={{ opacity: 0.98, delay: 0.42, rotate: -4 }}
                variants={decorVariants}
                aria-hidden="true"
              />
              <motion.span
                className="about-page__owner-outline about-page__owner-outline--top"
                custom={{ opacity: 1, delay: 0.2, rotate: -2 }}
                variants={decorVariants}
                aria-hidden="true"
              />
              <motion.span
                className="about-page__owner-outline about-page__owner-outline--side"
                custom={{ opacity: 1, delay: 0.26, rotate: -15 }}
                variants={decorVariants}
                aria-hidden="true"
              />

              <motion.div className="about-page__owner-photo-wrap absolute" variants={opacityVariants}>
                {!isOwnerImageLoaded ? (
                  <div className="about-page__skeleton absolute inset-2 animate-pulse bg-gradient-to-br from-orange-100 via-white to-orange-50" />
                ) : null}
                <img
                  src={ownerImageUrl}
                  alt={getTextValue(content?.imageAlt, t('ownerSection.imageAlt'))}
                  onLoad={() => setIsOwnerImageLoaded(true)}
                  className={`about-page__owner-photo h-full w-full object-cover transition-opacity duration-300 ${isOwnerImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </motion.div>

              <div className="about-page__owner-ribbon absolute bottom-8 left-1/2 z-[4] -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0">
                <motion.div
                  className="rounded-[4px] bg-[#ff7a12] px-5 py-3 text-white shadow-[0_12px_24px_rgba(255,106,0,0.24)]"
                  variants={ribbonVariants}
                >
                  <div className="whitespace-nowrap text-[14px] md:text-[16px]">
                  <span className="font-bold">{getTextValue(content?.ribbon?.brand, t('ownerSection.ribbon.brand'))}</span>{' '}
                  <span className="font-normal text-white/92">{getTextValue(content?.ribbon?.text, t('ownerSection.ribbon.text'))}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutOwner
