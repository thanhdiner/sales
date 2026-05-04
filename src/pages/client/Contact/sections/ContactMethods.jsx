import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'
import SectionHeader from '../components/SectionHeader'
import SellerCard from '../components/SellerCard'

const ContactMethods = ({ section = {} }) => {
  return (
    <motion.section
      className="contact-band bg-white px-4 py-10 md:py-14 dark:bg-gray-950"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-panel rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:p-7 dark:border-gray-700 dark:bg-gray-900/80">
          <div className="mb-7">
            <SectionHeader
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(section.sellers || []).map((seller, index) => (
              <SellerCard key={`${seller.name}-${index}`} seller={seller} index={index} note={section.note} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactMethods