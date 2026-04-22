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
        className="text-center uppercase"
        style={{
          color: '#1E1E1E',
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
        className="mt-5 max-w-[280px] text-center"
        style={{
          color: '#757575',
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