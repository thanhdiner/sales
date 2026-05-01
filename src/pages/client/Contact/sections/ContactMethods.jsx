import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'
import SectionHeader from '../components/SectionHeader'
import SellerCard from '../components/SellerCard'

const ContactMethods = ({ section = {} }) => {
  return (
    <motion.section
      className="px-4 py-10 md:py-14"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
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
    </motion.section>
  )
}

export default ContactMethods