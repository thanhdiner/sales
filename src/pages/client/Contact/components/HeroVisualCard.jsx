import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { viewport } from '../constants'

const HeroVisualCard = ({ content = {}, links = {} }) => {
  const visual = content.visual || {}

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="contact-media-frame overflow-hidden rounded-[26px] border border-[#f9dfcf] bg-white p-3 shadow-[0_18px_44px_rgba(142,77,32,0.12)] dark:border-gray-700 dark:bg-gray-800">
        <div className="contact-media-inner contact-support-visual relative min-h-[360px] overflow-hidden rounded-[20px] bg-[#fff1e4] md:min-h-[430px] dark:bg-gray-900">
          <span className="contact-support-visual__circle" aria-hidden="true" />
          <span className="contact-support-visual__dots contact-support-visual__dots--left" aria-hidden="true" />
          <span className="contact-support-visual__dots contact-support-visual__dots--right" aria-hidden="true" />

          <img
            src={content.imageUrl}
            alt={content.imageAlt}
            className="contact-support-visual__image absolute bottom-0 right-[-6%] z-[1] h-[330px] w-[88%] object-contain object-bottom md:h-[420px] lg:h-[440px]"
          />

          <div className="contact-badge absolute left-4 top-4 z-[2] inline-flex items-center gap-2 rounded-[16px] bg-white/95 px-3.5 py-2 text-[12px] font-extrabold text-[#343946] shadow-[0_12px_26px_rgba(142,77,32,0.12)] backdrop-blur dark:bg-gray-900/85 dark:text-gray-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff641f] text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            {visual.badge}
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-[2]">
            <div className="contact-overlay-card rounded-[18px] bg-white/95 p-4 shadow-[0_16px_36px_rgba(142,77,32,0.14)] backdrop-blur-md dark:bg-gray-900/85">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="contact-section-eyebrow--accent text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#ff641f] dark:text-orange-300">
                    {visual.eyebrow}
                  </p>

                  <p className="contact-card-title mt-2 max-w-[390px] text-[14px] font-bold leading-6 text-[#262b35] dark:text-white">
                    {visual.description}
                  </p>
                </div>

                <a
                  href={links.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-brand-action inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[#ff641f] px-4 text-[13px] font-bold text-white transition hover:bg-[#f25312]"
                >
                  {visual.button}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroVisualCard
