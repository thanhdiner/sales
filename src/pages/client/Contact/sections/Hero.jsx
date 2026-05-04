import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'
import HeroContentBlock from '../components/HeroContentBlock'
import HeroVisualCard from '../components/HeroVisualCard'

const Hero = ({ isVisible, content, links }) => {
  return (
    <motion.section
      className={`relative px-4 pt-4 pb-10 md:pt-5 md:pb-16 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-panel grid gap-6 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10 dark:border-gray-700 dark:bg-gray-900/80">
          <HeroContentBlock content={content} links={links} />
          <HeroVisualCard content={content} links={links} />
        </div>
      </div>
    </motion.section>
  )
}

export default Hero