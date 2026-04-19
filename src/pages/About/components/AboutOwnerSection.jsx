import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Gift, Users, BadgeDollarSign, MessageCircleMore } from 'lucide-react'

const stats = [
  { icon: Gift, label: 'Giá tốt', offsetX: 0 },
  { icon: Users, label: 'Hỗ trợ', offsetX: -2 },
  { icon: BadgeDollarSign, label: 'Dễ mua', offsetX: -1 },
  { icon: MessageCircleMore, label: 'Tư vấn', offsetX: -2 }
]

const StatCircle = ({ Icon, label, delay, viewport, offsetX = 0 }) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      viewport={viewport}
    >
      <div className="relative mb-4 flex h-[92px] w-[92px] items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="#1f67c7"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="152 56"
            transform="rotate(-140 50 50)"
          />
        </svg>

        <div
          className="relative z-10 flex h-[48px] w-[48px] items-center justify-center text-[#1f67c7]"
          style={{ transform: `translateX(${offsetX}px)` }}
        >
          <Icon className="h-7 w-7" strokeWidth={1.8} />
        </div>
      </div>

      <div className="text-[15px] font-medium text-[#3e68a0]">{label}</div>
    </motion.div>
  )
}

const AboutOwnerSection = ({ viewport = { once: true, amount: 0.2 } }) => {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="overflow-hidden border border-[#eeeeee] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={viewport}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="bg-white px-6 py-8 md:px-10 md:py-12 lg:px-12">
              <h2 className="mb-10 text-[40px] font-light leading-none tracking-[-0.02em] text-[#1f67c7] md:text-[56px]">
                Ai đứng sau shop
              </h2>

              <div className="mb-14 border border-[#efefef] bg-white shadow-[0_3px_14px_rgba(0,0,0,0.04)]">
                <div className="grid min-h-[220px] grid-cols-[8px_150px_1fr] md:grid-cols-[10px_180px_1fr]">
                  <div className="bg-[#1f67c7]" />

                  <div className="flex items-center justify-center px-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full text-[#1f67c7] md:h-24 md:w-24">
                      <Cpu className="h-14 w-14 md:h-16 md:w-16" strokeWidth={1.6} />
                    </div>
                  </div>

                  <div className="flex items-center px-6 py-8 md:px-8">
                    <div className="max-w-[420px] space-y-4 text-[15px] leading-8 text-[#6f6f6f] md:text-[16px]">
                      <p>
                        Mình là người tự học và khá thích công nghệ. Shop này được làm ra như một nguồn thu nhập phụ, đồng thời để bán các
                        tài khoản game và phần mềm bản quyền với mức giá dễ tiếp cận hơn.
                      </p>
                      <p>
                        Vì shop còn nhỏ nên mình tự xử lý gần như mọi thứ. Có gì mình sẽ tư vấn rõ, hỗ trợ trong khả năng và cố gắng làm gọn
                        gàng nhất cho từng đơn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
                {stats.map((item, index) => {
                  const Icon = item.icon

                  return <StatCircle key={item.label} Icon={Icon} label={item.label} delay={index * 0.06} viewport={viewport} />
                })}
              </div>
            </div>

            <div className="relative min-h-[420px] bg-white lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80"
                alt="Owner portrait"
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-14 left-0 right-0 bg-gradient-to-r from-[#1d56a8] to-[#2c86e8] px-8 py-7 text-white md:px-12">
                <div className="text-[17px] md:text-[19px]">
                  <span className="font-bold">Shop</span> <span className="font-normal text-white/92">tự vận hành</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutOwnerSection
