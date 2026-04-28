import React from 'react'
import { motion } from 'framer-motion'
import { shoppingGuideHeroImage, shoppingGuideViewport } from '../data'

const GuideHeroSection = ({ content, onRegister }) => {
  const hero = content || {}

  return (
    <motion.section
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={shoppingGuideViewport}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <p className="shopping-guide-eyebrow mb-3 text-sm font-semibold uppercase">{hero.eyebrow}</p>

          <h1 className="guide-title max-w-xl text-4xl font-semibold md:text-5xl">
            {hero.title}
          </h1>

          <p className="guide-muted mt-5 max-w-xl text-base leading-7">{hero.description}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRegister}
              className="shopping-guide-primary-button px-5 py-3 text-sm font-semibold"
            >
              {hero.registerButton}
            </button>

            <a
              href="#shopping-guide-steps"
              className="shopping-guide-secondary-button px-5 py-3 text-center text-sm font-semibold"
            >
              {hero.guideButton}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
          viewport={shoppingGuideViewport}
        >
          <img
            alt={hero.imageAlt}
            src={hero.image || shoppingGuideHeroImage}
            className="shopping-guide-image h-[300px] w-full object-cover md:h-[380px]"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideHeroSection
