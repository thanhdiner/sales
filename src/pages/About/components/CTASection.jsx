import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CTASection = ({ viewport = { once: true, amount: 0.25 } }) => {
  const navigate = useNavigate()

  return (
    <motion.section
      className="px-4 py-12 md:px-6 md:py-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#dff7ef]" />
          <div className="absolute -left-10 top-10 h-20 w-20 rounded-full bg-[#d9f7f0]" />
          <div className="absolute -bottom-14 left-8 h-28 w-28 rounded-full border-[8px] border-[#b9efe3]" />
          <div className="absolute bottom-10 left-12 h-3 w-3 rounded-full bg-[#f1c94c]" />
          <div className="absolute bottom-16 left-20 h-2.5 w-2.5 rounded-full bg-[#f1c94c]" />
          <div className="absolute bottom-8 left-24 h-2.5 w-2.5 rounded-full bg-[#2a3e8f]" />
          <div className="absolute bottom-7 left-36 h-16 w-px rotate-45 bg-[#2a3e8f]" />
          <div className="absolute bottom-6 left-44 h-16 w-px rotate-45 bg-[#2a3e8f]" />

          <div className="relative z-10 flex min-h-[230px] flex-col items-center justify-center px-6 py-10 text-center md:px-12">
            <h2 className="mb-3 text-[24px] font-extrabold leading-tight text-[#3d434d] md:text-[40px]">Bạn muốn thử mua?</h2>

            <p className="mb-5 max-w-[620px] text-[13px] font-medium text-[#767d87] md:text-[20px]">
              Cứ nhắn mình nếu bạn chưa biết chọn gì, mình sẽ cố gắng tư vấn nhanh để bạn tìm được sản phẩm phù hợp.
            </p>

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="rounded-[4px] bg-[#4f7df0] px-6 py-2 text-[11px] font-bold text-white shadow-sm transition hover:brightness-105 md:text-[14px]"
            >
              Xem sản phẩm
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default CTASection
