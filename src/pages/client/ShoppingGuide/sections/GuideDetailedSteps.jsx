import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideViewport } from '../data'

const detailsMotionViewport = { once: false, amount: 0.34 }

const timelineVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
}

const stepVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06
    }
  }
}

const stepHoverMotion = {
  y: -6,
  scale: 1.012,
  transition: { type: 'spring', stiffness: 260, damping: 22 }
}

const stepImageVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const stepCopyVariants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
  }
}

const GuideDetailedSteps = ({ content }) => {
  const section = content?.detailedStepsSection || {}
  const detailedSteps = content?.detailedSteps || []

  return (
    <motion.section
      className="shopping-guide-section shopping-guide-details-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <motion.div
        className="shopping-guide-details-heading mx-auto mb-5 max-w-7xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        viewport={shoppingGuideViewport}
      >
        <p className="shopping-guide-eyebrow mb-1 text-xs font-semibold uppercase">
          {section.eyebrow}
        </p>

        <h2 className="guide-title text-xl font-semibold md:text-2xl">
          {section.title}
        </h2>
      </motion.div>

      <motion.div
        className="shopping-guide-details-timeline mx-auto max-w-7xl"
        variants={timelineVariants}
        initial="hidden"
        whileInView="show"
        viewport={detailsMotionViewport}
      >
        {detailedSteps.map((item, index) => {
          const stepNumber = String(index + 1).padStart(2, '0')

          return (
            <motion.article
              key={`${item.id || item.title}-${index}`}
              className="shopping-guide-details-step"
              variants={stepVariants}
              whileHover={stepHoverMotion}
              whileFocus={stepHoverMotion}
              whileTap={{ scale: 0.996 }}
              tabIndex={0}
            >
              <motion.div className="shopping-guide-details-step__image" variants={stepImageVariants}>
                <img src={item.image} alt={item.title} />
              </motion.div>

              <motion.div className="shopping-guide-details-step__copy" variants={stepCopyVariants}>
                <span className="shopping-guide-details-step__badge" aria-hidden="true">
                  {stepNumber}
                </span>

                <div className="shopping-guide-details-step__body">
                  <p className="shopping-guide-details-step__kicker">{item.id || `Step ${stepNumber}`}</p>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  {item.chips?.length > 0 && (
                    <div className="shopping-guide-details-step__chips">
                      {item.chips.map(chip => (
                        <span key={chip}>{chip}</span>
                      ))}
                    </div>
                  )}

                  {item.checks?.length > 0 && (
                    <ul className="shopping-guide-details-step__checks">
                      {item.checks.map(check => (
                        <li key={check}>{check}</li>
                      ))}
                    </ul>
                  )}

                  {item.note && (
                    <div className="shopping-guide-details-step__note">
                      {item.note}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.article>
          )
        })}
      </motion.div>
    </motion.section>
  )
}

export default GuideDetailedSteps
