import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { shoppingGuideViewport } from '../data'

const paymentSectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.08
    }
  }
}

const paymentHeadingVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: 'easeOut' }
  }
}

const paymentCardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: index => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

const paymentBadgeVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: index => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      delay: 0.18 + index * 0.05,
      ease: 'easeOut'
    }
  })
}

const GuidePayment = ({ content }) => {
  const section = content?.paymentSection || {}
  const paymentMethods = content?.paymentMethods || []

  return (
    <motion.section
      id="shopping-guide-payment"
      className="shopping-guide-section shopping-guide-payment-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      initial="hidden"
      whileInView="visible"
      variants={paymentSectionVariants}
      viewport={shoppingGuideViewport}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="shopping-guide-payment-heading text-center"
          variants={paymentHeadingVariants}
        >
          <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">
            {section.eyebrow}
          </p>

          <h2 className="guide-title text-3xl font-semibold">{section.title}</h2>

          <p className="guide-muted mx-auto mt-3 max-w-2xl text-base leading-7">{section.description}</p>
        </motion.div>

        <div className="shopping-guide-payment-grid">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon

            return (
              <motion.div
                key={`${method.name}-${index}`}
                className="shopping-guide-payment-card"
                custom={index}
                variants={paymentCardVariants}
                whileHover={{
                  y: -6,
                  borderColor: '#a78bfa',
                  boxShadow: '0 18px 42px rgba(91, 33, 182, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  transition: { duration: 0.22, ease: 'easeOut' }
                }}
              >
                <motion.span
                  className="shopping-guide-payment-card__spark shopping-guide-payment-card__spark--left"
                  animate={{ rotate: [0, 8, -6, 0], y: [0, -2, 0] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: 'easeInOut',
                    delay: index * 0.25
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.span>

                <motion.div
                  className="shopping-guide-payment-card__icon"
                  animate={{ scale: [1, 1.035, 1] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: 'easeInOut',
                    delay: 0.2 + index * 0.2
                  }}
                >
                  {Icon && <Icon className="h-8 w-8" />}
                </motion.div>

                <div className="shopping-guide-payment-card__content">
                  <div className="shopping-guide-payment-card__title-row">
                    <h3>{method.name}</h3>

                    {method.popular && <span>{section.popular}</span>}
                  </div>

                  <p>{method.desc}</p>

                  <div className="shopping-guide-payment-card__badges">
                    {method.badges?.map((badge, badgeIndex) => (
                      <motion.span
                        key={badge}
                        custom={badgeIndex}
                        variants={paymentBadgeVariants}
                      >
                        {badge}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="shopping-guide-payment-security"
          variants={paymentHeadingVariants}
          whileHover={{ scale: 1.01, transition: { duration: 0.18, ease: 'easeOut' } }}
        >
          <Lock className="h-4 w-4" />
          <span>{section.securityNote}</span>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuidePayment
