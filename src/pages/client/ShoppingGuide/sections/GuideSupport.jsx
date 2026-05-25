import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Headphones, Mail, Phone } from 'lucide-react'

const cleanLabel = value => String(value || '').replace(/:\s*$/, '')

const supportViewport = { once: false, amount: 0.18 }

const shellVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.52,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
}

const visualVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
      staggerChildren: 0.09,
      delayChildren: 0.12
    }
  }
}

const orbitVariants = {
  hidden: { opacity: 0, scale: 0.72, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.58, ease: 'easeOut' }
  }
}

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 18 }
  }
}

const contentVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.48,
      ease: 'easeOut',
      staggerChildren: 0.075,
      delayChildren: 0.18
    }
  }
}

const textItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } }
}

const actionVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 240, damping: 20 }
  }
}

const GuideSupport = ({ content, websiteConfig, onBrowseProducts, onViewCoupons }) => {
  const section = content || {}
  const phone = websiteConfig?.contactInfo?.phone || '0823387108'
  const email = websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'
  const contactItems = [
    { icon: Phone, label: cleanLabel(section.phoneLabel), value: phone },
    { icon: Mail, label: cleanLabel(section.emailLabel), value: email },
    { icon: Clock, label: cleanLabel(section.timeLabel), value: section.workingTime }
  ]

  return (
    <motion.section
      className="shopping-guide-section shopping-guide-support-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
    >
      <motion.div
        className="shopping-guide-support-shell mx-auto max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={supportViewport}
        variants={shellVariants}
      >
        <motion.div
          className="shopping-guide-support-visual"
          variants={visualVariants}
          aria-hidden="true"
        >
          <motion.span className="shopping-guide-support-orbit" variants={orbitVariants} />
          <motion.span className="shopping-guide-support-orbit shopping-guide-support-orbit--inner" variants={orbitVariants} />
          <motion.span className="shopping-guide-support-bubble shopping-guide-support-bubble--mail" variants={bubbleVariants}>
            <Mail className="h-5 w-5" />
          </motion.span>
          <motion.span className="shopping-guide-support-bubble shopping-guide-support-bubble--clock" variants={bubbleVariants}>
            <Clock className="h-5 w-5" />
          </motion.span>
          <motion.span className="shopping-guide-support-bubble shopping-guide-support-bubble--small" variants={bubbleVariants} />
          <motion.span className="shopping-guide-support-headset" variants={bubbleVariants}>
            <Headphones className="h-20 w-20" strokeWidth={1.9} />
          </motion.span>
        </motion.div>

        <motion.div
          className="shopping-guide-support-content"
          variants={contentVariants}
        >
          <motion.p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase" variants={textItemVariants}>
            {section.eyebrow}
          </motion.p>

          <motion.h2 className="guide-title text-3xl font-semibold" variants={textItemVariants}>
            {section.title}
          </motion.h2>

          <motion.p className="guide-muted shopping-guide-support-description" variants={textItemVariants}>
            {section.description}
          </motion.p>

          <ul className="shopping-guide-support-contact">
            {contactItems.map(({ icon: Icon, label, value }) => (
              <motion.li key={label} className="shopping-guide-support-contact__item" variants={textItemVariants}>
                <span className="shopping-guide-support-contact__icon">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="shopping-guide-support-contact__copy">
                  <strong>{label}</strong>
                  <span>{value}</span>
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="shopping-guide-support-actions">
            <motion.button
              type="button"
              onClick={onBrowseProducts}
              className="shopping-guide-support-button shopping-guide-support-button--primary"
              variants={actionVariants}
            >
              {section.browseProducts}
            </motion.button>

            <motion.button
              type="button"
              onClick={onViewCoupons}
              className="shopping-guide-support-button shopping-guide-support-button--secondary"
              variants={actionVariants}
            >
              {section.viewCoupons}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default GuideSupport
