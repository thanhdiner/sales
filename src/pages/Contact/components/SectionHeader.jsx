import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'

const SectionHeader = ({ eyebrow, title, description, eyebrowClassName = 'text-gray-500' }) => {
  return (
    <motion.div
      className="mb-10 text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      {eyebrow && (
        <p className={`contact-section-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.16em] ${eyebrowClassName}`}>
          {eyebrow}
        </p>
      )}

      <h2 className="contact-title mx-auto max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-gray-900 dark:text-white md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="contact-description mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </motion.div>
  )
}

export default SectionHeader
