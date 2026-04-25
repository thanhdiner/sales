import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { viewport } from '../constants'

const SellerCard = ({ seller, index }) => {
  return (
    <motion.div
      className="contact-card rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="flex items-center gap-4">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0">
          <h3 className="contact-card-title truncate text-lg font-semibold text-gray-900 dark:text-white">
            {seller.name}
          </h3>
          <p className="contact-muted-text mt-1 text-sm text-gray-500 dark:text-gray-400">
            {seller.role}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {seller.methods.map((method, methodIndex) => {
          const Icon = method.icon

          return (
            <motion.a
              key={`${seller.name}-${method.title}`}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="contact-method-row flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: methodIndex * 0.04,
                ease: 'easeOut',
              }}
              viewport={viewport}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="contact-icon-box flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <div className="contact-card-title text-sm font-semibold text-gray-900 dark:text-white">
                    {method.title}
                  </div>
                  <div
                    className="contact-method-value truncate text-sm text-gray-500 dark:text-gray-400"
                    title={method.value}
                  >
                    {method.value}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="contact-arrow h-4 w-4 shrink-0 text-gray-400" />
            </motion.a>
          )
        })}
      </div>

      <p className="contact-muted-text mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
        Ưu tiên liên hệ qua Zalo hoặc Facebook để được phản hồi nhanh hơn.
      </p>
    </motion.div>
  )
}

export default SellerCard
