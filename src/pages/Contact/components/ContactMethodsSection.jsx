import React from 'react'
import { motion } from 'framer-motion'
import { sellers, viewport } from '../constants'
import SectionHeader from './SectionHeader'
import SellerCard from './SellerCard'

const ContactMethodsSection = () => {
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
            eyebrow="Kết nối trực tiếp"
            title="Liên hệ với SmartMall"
            description="Chọn kênh phù hợp để được tư vấn sản phẩm, hỗ trợ đơn hàng hoặc giải đáp thông tin trước khi mua."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sellers.map((seller, index) => (
            <SellerCard key={seller.name} seller={seller} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default ContactMethodsSection