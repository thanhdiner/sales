import React from 'react'
import { motion } from 'framer-motion'
import { Clock3, Headphones, ShieldCheck } from 'lucide-react'
import { viewport } from '../constants'

const highlightIcons = [Clock3, ShieldCheck, Headphones]

const ContactHighlights = ({ section = {} }) => {
  return (
    <motion.section
      className="contact-band bg-white px-4 py-8 md:py-12 dark:bg-gray-950"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-highlight-shell contact-panel relative overflow-hidden rounded-[8px] border border-[#ff641f] bg-white px-4 py-5 shadow-[0_14px_38px_rgba(255,100,31,0.08)] sm:px-8 md:px-11 md:py-6">
          <div className="contact-highlight-dots contact-highlight-dots--left" aria-hidden="true" />
          <div className="contact-highlight-dots contact-highlight-dots--right" aria-hidden="true" />

          <div className="relative z-10">
            {section.eyebrow && (
              <div className="contact-highlight-eyebrow mx-auto mb-1 flex w-full max-w-[280px] items-center justify-center gap-3 text-[12px] font-bold uppercase leading-none tracking-[0.18em] text-[#ff641f]">
                <span className="h-px min-w-0 flex-1 bg-[#ffb08a]" aria-hidden="true" />
                <span>{section.eyebrow}</span>
                <span className="h-px min-w-0 flex-1 bg-[#ffb08a]" aria-hidden="true" />
              </div>
            )}

            <h2 className="contact-title mx-auto max-w-[300px] break-words text-center text-[20px] font-extrabold leading-[1.16] tracking-normal text-[#1e1e1e] sm:max-w-3xl sm:text-[22px] md:text-[30px]">
              {section.title}
            </h2>

            {section.description && (
              <p className="contact-description mx-auto mt-2 max-w-[310px] text-center text-[12px] font-semibold leading-5 text-[#696969] sm:max-w-2xl md:text-[13px]">
                {section.description}
              </p>
            )}

            <div className="contact-highlight-metrics mt-7 grid gap-5 md:grid-cols-3 md:gap-0">
              {(section.items || []).map((item, index) => {
                const Icon = highlightIcons[index] || Clock3

                return (
                  <motion.div
                    key={`${item.label}-${index}`}
                    className="contact-highlight-item relative flex items-center justify-center gap-4 text-left md:text-center"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.06,
                      ease: 'easeOut'
                    }}
                    viewport={viewport}
                  >
                    <span className="contact-highlight-icon relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ff641f] bg-white text-[#ff641f] md:h-[64px] md:w-[64px]">
                      <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
                    </span>

                    <span className="contact-highlight-copy relative z-10">
                      <span className="contact-metric-value block text-[23px] font-extrabold leading-none tracking-normal text-[#ff641f] md:text-[28px]">
                        {item.value}
                      </span>
                      <span className="contact-metric-label mt-2 block text-[13px] font-semibold leading-4 text-[#666666] md:text-[14px]">
                        {item.label}
                      </span>
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactHighlights
