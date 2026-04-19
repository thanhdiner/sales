import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    title: 'Bảo mật đơn giản',
    description: 'Mọi giao dịch đều qua hệ thống ngân hàng và ví điện tử phổ biến.'
  },
  {
    title: 'Giao hàng nhanh',
    description: 'Gửi thông tin tài khoản, phần mềm nhanh nhất có thể, đa phần trong ngày.'
  },
  {
    title: 'Hỗ trợ tận tâm',
    description: 'Có thắc mắc gì, mình trả lời sớm nhất có thể, thường trong giờ hành chính.'
  }
]

const FeaturesSection = ({ viewport }) => {
  const navigate = useNavigate()

  return (
    <motion.section
      className="font-['Manrope',_sans-serif] relative overflow-hidden px-3 py-14 md:px-4 md:py-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="relative mx-auto max-w-7xl rounded-[32px] bg-white px-8 py-16 shadow-[0_8px_30px_rgba(0,0,0,0.02)] md:px-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={viewport}
          >
            <p className="mb-4 text-[14px] font-bold uppercase text-[#f57059]">
              SmartMall operation
            </p>

            <h2 className="max-w-[460px] text-[32px] font-extrabold tracking-[-1.2px] text-black md:text-[40px] md:leading-[48px]">
              Shop nhỏ
              <br />
              nhưng vẫn giữ
              <br />
              trải nghiệm rõ ràng
            </h2>

            <p className="mt-6 max-w-[480px] text-[16px] font-medium leading-[30px] tracking-[-0.32px] text-[#64607d]">
              Dù quy mô còn nhỏ, mình vẫn cố gắng giữ quy trình mua hàng đơn giản, giao nhanh và hỗ trợ dễ hiểu để khách yên tâm hơn khi sử
              dụng.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="mt-10 inline-flex h-[47px] items-center justify-center rounded-[47px] bg-[#f57059] px-8 text-[16px] font-semibold tracking-[-0.32px] text-white transition-all hover:bg-[#e65a43] hover:shadow-[0_8px_20px_rgba(245,112,89,0.25)]"
            >
              Xem sản phẩm
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={viewport}
            className="relative min-h-[600px] w-full"
          >
            {/* Background decorative circle */}
            <div className="absolute -right-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#f8f9fc]" />

            <svg className="absolute inset-0 h-full w-full drop-shadow-[0_16px_16px_rgba(245,112,89,0.15)]" viewBox="0 0 1070 448" fill="none" preserveAspectRatio="none">
              <path
                d="M26.5002 310.297C74.5002 345.297 186.3 411.297 249.5 395.297C328.5 375.297 348 272.297 470 248.297C592 224.297 681.5 307.797 776 187.297C870.5 66.7967 916.5 -12.2033 1043.5 4.79669"
                stroke="#f57059"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Step 1 */}
            <div className="absolute left-[16%] top-[87%]">
              <span className="pointer-events-none absolute left-[100px] -top-[70px] z-0 select-none text-[160px] font-black leading-none tracking-tighter text-black opacity-[0.03]">
                1
              </span>
              <div className="absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
                <div className="h-[22px] w-[22px] rounded-full bg-[#c4c4c4]" />
              </div>
              <div className="absolute left-[-32px] top-[40px] w-[250px]">
                <h3 className="text-[17px] font-extrabold text-[#0f1115]">{steps[0].title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-[1.7] text-[#64607d]">{steps[0].description}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="absolute left-[58%] top-[56%]">
              <span className="pointer-events-none absolute left-[100px] -top-[70px] z-0 select-none text-[160px] font-black leading-none tracking-tighter text-black opacity-[0.03]">
                2
              </span>
              <div className="absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
                <div className="h-[22px] w-[22px] rounded-full bg-[#c4c4c4]" />
              </div>
              <div className="absolute left-[-32px] top-[40px] w-[250px]">
                <h3 className="text-[17px] font-extrabold text-[#0f1115]">{steps[1].title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-[1.7] text-[#64607d]">{steps[1].description}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="absolute left-[88%] top-[4%]">
              <span className="pointer-events-none absolute right-[100px] -top-[70px] z-0 select-none text-[160px] font-black leading-none tracking-tighter text-black opacity-[0.03]">
                3
              </span>
              <div className="absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
                <div className="h-[22px] w-[22px] rounded-full bg-[#c4c4c4]" />
              </div>
              <div className="absolute right-[-32px] top-[40px] w-[250px] text-right">
                <h3 className="text-[17px] font-extrabold text-[#0f1115]">{steps[2].title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-[1.7] text-[#64607d]">{steps[2].description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default FeaturesSection
