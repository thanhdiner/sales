import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'
import HeroContentBlock from './HeroContentBlock'
import HeroVisualCard from './HeroVisualCard'

const HeroSection = ({ isVisible, content, links }) => {
  return (
    <motion.section
      className={`relative px-4 pt-2 pb-10 md:pt-4 md:pb-16 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-panel grid gap-6 rounded-3xl bg-[#f7f8fa] p-5 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10 dark:bg-gray-900">
          <HeroContentBlock content={content} links={links} />
          <HeroVisualCard content={content} links={links} />
        </div>
      </div>
    </motion.section>
  )
}

export default HeroSection
