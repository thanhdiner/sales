import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { viewport } from '../constants'

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      viewport={viewport}
    >
      <button
        onClick={onToggle}
        className={`group w-full rounded-2xl border bg-white px-5 py-5 text-left transition-all duration-200 dark:bg-gray-800 ${
          isOpen
            ? 'border-blue-200 shadow-md dark:border-blue-500/40'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-sm dark:border-gray-700 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-7 min-w-[28px] items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                isOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span
              className={`text-[15px] font-bold leading-relaxed transition-colors ${
                isOpen
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-[#0f172a] group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300'
              }`}
            >
              {faq.question}
            </span>
          </div>

          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
              isOpen
                ? 'bg-blue-100 text-blue-600 rotate-180 dark:bg-blue-500/20 dark:text-blue-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <p className="mt-4 pl-10 text-[14px] leading-[1.8] text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

export default FAQItem
