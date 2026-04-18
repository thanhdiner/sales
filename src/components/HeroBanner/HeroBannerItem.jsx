import React from 'react'
import { motion } from 'framer-motion'

export default function HeroBannerItem({ banner, viewport }) {
  return (
    <div
      className="HeroBanner-banner cursor-pointer"
      onClick={() => {
        if (banner.link) window.open(banner.link, '_blank')
      }}
    >
      <img
        src={banner.img}
        alt={banner.title}
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
        <h3 className="HeroBanner-title" aria-label={banner.title}>
          {banner.title}
        </h3>
      </motion.div>
    </div>
  )
}
