import React from 'react'
import { motion } from 'framer-motion'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getLocalizedBannerLink, getLocalizedBannerTitle } from '@/utils/bannerLocalization'

export default function HeroBannerItem({ banner, viewport }) {
  const language = useCurrentLanguage()
  const title = getLocalizedBannerTitle(banner, language, banner.title || '')
  const link = getLocalizedBannerLink(banner, language, banner.link || '')

  return (
    <div
      className="HeroBanner-banner cursor-pointer"
      onClick={() => {
        if (link) window.open(link, '_blank')
      }}
    >
      <img
        src={banner.img}
        alt={title}
        className="HeroBanner-img"
        draggable={false}
        style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
      />
      <div className="HeroBanner-overlay" />
      <motion.div
        className="HeroBanner-title-wrap"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
        viewport={viewport}
      >
        <h3 className="HeroBanner-title" aria-label={title}>
          {title}
        </h3>
      </motion.div>
    </div>
  )
}
