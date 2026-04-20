import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { sellers, viewport } from '../constants'

const ContactMethodsSection = () => {
  return (
    <motion.section
      className="px-4 py-12 md:py-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={viewport}
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-blue-600">
            Kết nối trực tiếp
          </p>
          <h2 className="text-[32px] font-extrabold tracking-[-1.2px] text-[#111] md:text-[40px] dark:text-white">
            Cách liên hệ nhanh nhất
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[16px] font-medium leading-[1.8] text-[#64607d] dark:text-gray-400">
            Chọn đúng người hỗ trợ theo nhu cầu để được phản hồi nhanh, rõ ràng và tiết kiệm thời gian hơn.
          </p>
        </motion.div>

        {/* Seller cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {sellers.map((seller, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-2 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="rounded-[22px] bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 p-6 md:p-7 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700/50">
                {/* Seller header */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                    />
                    {/* Online indicator */}
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-gray-800">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[20px] font-bold text-[#0f172a] dark:text-white">
                      {seller.name}
                    </h3>
                    <p className="mt-0.5 text-[14px] font-medium text-gray-500 dark:text-gray-400">
                      {seller.role}
                    </p>
                  </div>
                </div>

                {/* Contact methods */}
                <div className="mt-6 space-y-3">
                  {seller.methods.map((method, i) => {
                    const Icon = method.icon
                    return (
                      <motion.a
                        key={i}
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="group/method flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 transition-all duration-200 hover:border-gray-200 hover:shadow-md dark:border-gray-600 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
                        viewport={viewport}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white"
                            style={{ backgroundColor: method.color }}
                          >
                            <Icon />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[15px] font-bold text-[#0f172a] dark:text-white">
                              {method.title}
                            </div>
                            <div className="truncate text-[13px] text-gray-500 dark:text-gray-400" title={method.value}>
                              {method.value}
                            </div>
                          </div>
                        </div>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all duration-200 group-hover/method:bg-blue-600 group-hover/method:text-white dark:bg-gray-600 dark:text-gray-300">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </motion.a>
                    )
                  })}
                </div>

                {/* Tip */}
                <div className="mt-5 rounded-2xl bg-blue-50/80 px-4 py-3 text-[13px] font-medium leading-relaxed text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  💡 Ưu tiên liên hệ qua Zalo/Facebook để nhận phản hồi nhanh hơn.
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default ContactMethodsSection
