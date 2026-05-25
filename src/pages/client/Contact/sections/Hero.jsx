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
        <div className="contact-panel contact-support-hero grid gap-7 rounded-[28px] border border-[#f8dfcf] bg-[#fff8f1] p-5 shadow-[0_18px_52px_rgba(142,77,32,0.11)] md:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-9 dark:border-gray-700 dark:bg-gray-900/80">
          <HeroContentBlock content={content} links={links} />
          <HeroVisualCard content={content} links={links} />
        </div>
      </div>
    </motion.section>
  )
}

export default Hero
