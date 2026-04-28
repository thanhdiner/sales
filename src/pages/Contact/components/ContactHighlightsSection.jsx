import React from 'react'
import { motion } from 'framer-motion'
import HeroHighlightCard from './HeroHighlightCard'
import SectionHeader from './SectionHeader'
import { viewport } from '../constants'

const ContactHighlightsSection = ({ section = {} }) => {
  return (
    <motion.section
      className="px-4 pb-6 md:pb-10"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-panel rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:p-7 dark:border-gray-700 dark:bg-gray-900/80">
          <SectionHeader
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            eyebrowClassName="text-blue-600"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(section.items || []).map((item, index) => (
              <HeroHighlightCard key={`${item.label}-${index}`} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactHighlightsSection
