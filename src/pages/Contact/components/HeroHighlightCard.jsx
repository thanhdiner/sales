import React from 'react'
import { motion } from 'framer-motion'
import { viewport } from '../constants'

const HeroHighlightCard = ({ item, index }) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      viewport={viewport}
    >
      <h3
        className="contact-metric-value text-center uppercase text-[#1E1E1E]"
        style={{
          fontFamily: '"Sharp Sans No1", Arial, sans-serif',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '100%',
        }}
      >
        {item.value}
      </h3>

      <p
        className="contact-metric-label mt-5 max-w-[280px] text-center text-[#757575]"
        style={{
          fontFamily: '"Sharp Sans No1", Arial, sans-serif',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '28px',
        }}
      >
        {item.label}
      </p>
    </motion.div>
  )
}

export default HeroHighlightCard
