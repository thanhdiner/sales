import { motion } from 'framer-motion'
import { FLASH_SALE_FADE_UP_VARIANTS, FLASH_SALE_STAGGER_VARIANTS, FLASH_SALE_VIEWPORT } from '../constants'
import SaleHeaderSkeleton from './SaleHeaderSkeleton'

export default function FlashSaleLoadingState() {
  return (
    <motion.section
      className="mt-6 space-y-8 animate-pulse"
      initial="hidden"
      whileInView="visible"
      variants={FLASH_SALE_STAGGER_VARIANTS}
      viewport={FLASH_SALE_VIEWPORT}
    >
      <motion.div variants={FLASH_SALE_FADE_UP_VARIANTS}>
        <SaleHeaderSkeleton />
      </motion.div>
      <motion.div variants={FLASH_SALE_FADE_UP_VARIANTS}>
        <SaleHeaderSkeleton upcoming />
      </motion.div>
    </motion.section>
  )
}
