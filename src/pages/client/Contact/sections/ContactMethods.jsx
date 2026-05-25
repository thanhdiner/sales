import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'
import SellerCard from '../components/SellerCard'

const ContactMethods = ({ section = {} }) => {
  const titleParts = String(section.title || '').split('SmartMall')

  return (
    <motion.section
      id="contact-direct"
      className="contact-band contact-direct-section bg-white px-4 py-10 md:py-14 dark:bg-gray-950"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-panel contact-direct-panel relative overflow-hidden rounded-[18px] border border-[#fff0e6] bg-[#fff8f2] px-5 pb-6 pt-7 shadow-[0_18px_50px_rgba(171,91,36,0.10)] md:px-8 md:pb-8">
          <span className="contact-direct-panel__arc contact-direct-panel__arc--top" aria-hidden="true" />
          <span className="contact-direct-panel__arc contact-direct-panel__arc--bottom" aria-hidden="true" />
          <span className="contact-direct-panel__dots" aria-hidden="true" />

          <div className="contact-direct-heading relative z-10 mx-auto mb-7 max-w-3xl text-center">
            {section.eyebrow && (
              <p className="contact-section-eyebrow contact-direct-heading__eyebrow mb-2 text-[11px] font-bold uppercase tracking-[0.18em]">
                {section.eyebrow}
              </p>
            )}

            <h2 className="contact-title contact-direct-heading__title text-3xl font-extrabold text-[#151821] md:text-[34px]">
              {titleParts.length > 1 ? (
                <>
                  {titleParts[0]}
                  <span>SmartMall</span>
                  {titleParts.slice(1).join('SmartMall')}
                </>
              ) : (
                section.title
              )}
            </h2>

            {section.description && (
              <p className="contact-description mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6b7280]">
                {section.description}
              </p>
            )}
          </div>

          <div className="relative z-10 mx-auto grid max-w-[1120px] gap-5 md:grid-cols-2 md:gap-7">
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
