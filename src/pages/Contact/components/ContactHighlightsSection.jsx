import React from 'react'
import { motion } from 'framer-motion'
import HeroHighlightCard from './HeroHighlightCard'
import SectionHeader from './SectionHeader'
import { highlights, viewport } from '../constants'

const ContactHighlightsSection = () => {
  return (
    <motion.section
      className="px-4 pb-6 md:pb-10"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-panel rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:p-7 dark:border-gray-700 dark:bg-gray-900/80">
          <SectionHeader
            eyebrow="Điểm nổi bật"
            title="Lý do khách hàng chọn liên hệ trực tiếp"
            description="Những cam kết hỗ trợ cốt lõi giúp việc tư vấn, xử lý đơn hàng và phản hồi thông tin diễn ra nhanh và rõ ràng hơn."
            eyebrowClassName="text-blue-600"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlights.map((item, index) => (
              <HeroHighlightCard key={item.label} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactHighlightsSection
