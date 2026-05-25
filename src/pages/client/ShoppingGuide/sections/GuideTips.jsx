import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgePercent, Gift, ShieldCheck, Star, Zap } from 'lucide-react'
import { shoppingGuideTipsImage, shoppingGuideViewport } from '../data'

const tipIcons = [BadgePercent, Gift, Star, Zap, ShieldCheck]

const GuideTips = ({ content }) => {
  const section = content?.tipsSection || {}
  const smartTips = content?.smartTips || []
  const reduceMotion = useReducedMotion()

  const revealOffset = reduceMotion ? 0 : 26
  const sectionMotion = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: reduceMotion ? 0 : 0.08
      }
    }
  }
  const textMotion = {
    hidden: { opacity: 0, y: revealOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
    }
  }
  const listMotion = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.12
      }
    }
  }
  const tipMotion = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 22,
      scale: reduceMotion ? 1 : 0.92
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
    }
  }
  const mediaMotion = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : 34,
      scale: reduceMotion ? 1 : 0.96
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
    }
  }
  const decorMotion = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <motion.section
      className="shopping-guide-section shopping-guide-tips-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      variants={sectionMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...shoppingGuideViewport, amount: 0.28 }}
    >
      <div className="shopping-guide-tips-shell mx-auto max-w-7xl">
        <motion.div
          className="shopping-guide-tips-content"
          variants={textMotion}
        >
          <motion.p variants={textMotion} className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">
            {section.eyebrow}
          </motion.p>

          <motion.h2 variants={textMotion} className="guide-title text-3xl font-semibold md:text-4xl">
            {section.title}
          </motion.h2>

          <motion.p variants={textMotion} className="guide-muted mt-3 max-w-xl text-base leading-7">
            {section.description}
          </motion.p>

          <motion.ul variants={listMotion} className="shopping-guide-tips-list">
            {smartTips.map((tip, index) => {
              const TipIcon = tipIcons[index % tipIcons.length]
              const step = String(index + 1).padStart(2, '0')

              return (
                <motion.li key={`${tip}-${index}`} variants={tipMotion} className="shopping-guide-tips-item">
                  <motion.span
                    className="shopping-guide-tips-item__number"
                    initial={false}
                    whileHover={reduceMotion ? undefined : { y: -2, scale: 1.06 }}
                  >
                    {step}
                  </motion.span>
                  <motion.span
                    className="shopping-guide-tips-item__icon"
                    initial={false}
                    whileHover={reduceMotion ? undefined : { y: -4, scale: 1.08, rotate: -3 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  >
                    <TipIcon className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                  <span className="shopping-guide-tips-item__text">{tip}</span>
                </motion.li>
              )
            })}
          </motion.ul>
        </motion.div>

        <motion.div
          className="shopping-guide-tips-media"
          variants={mediaMotion}
        >
          <motion.span variants={decorMotion} className="shopping-guide-tips-media__dots" aria-hidden="true" />
          <motion.span variants={decorMotion} className="shopping-guide-tips-media__shape" aria-hidden="true" />

          <motion.div
            className="shopping-guide-tips-image"
            initial={false}
            whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          >
            <img alt={section.imageAlt} src={section.image || shoppingGuideTipsImage} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideTips
