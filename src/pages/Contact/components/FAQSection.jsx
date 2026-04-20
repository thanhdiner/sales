import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle, Mail, HelpCircle } from 'lucide-react'
import { faqs, viewport } from '../constants'

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
            <span className={`mt-0.5 flex h-7 min-w-[28px] items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              isOpen
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span className={`text-[15px] font-bold leading-relaxed transition-colors ${
              isOpen
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-[#0f172a] group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300'
            }`}>
              {faq.question}
            </span>
          </div>

          <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            isOpen
              ? 'bg-blue-100 text-blue-600 rotate-180 dark:bg-blue-500/20 dark:text-blue-300'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}>
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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

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
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-violet-600">
            Câu hỏi thường gặp
          </p>
          <h2 className="text-[32px] font-extrabold tracking-[-1.2px] text-[#111] md:text-[40px] dark:text-white">
            Trung tâm trợ giúp
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[16px] font-medium leading-[1.8] text-[#64607d] dark:text-gray-400">
            Một số thắc mắc phổ biến đã được tổng hợp sẵn để bạn tra cứu nhanh trước khi liên hệ trực tiếp.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* FAQ list */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="rounded-[28px] border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-3 rounded-[22px] bg-gradient-to-br from-violet-50/30 via-white to-blue-50/20 p-4 md:p-5 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar help */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="rounded-[22px] bg-gradient-to-br from-violet-50/60 via-white to-indigo-50/30 p-6 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg">
                  <HelpCircle className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-[20px] font-bold text-[#0f172a] dark:text-white">
                  Vẫn chưa thấy câu trả lời?
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-gray-600 dark:text-gray-300">
                  Nếu cần hỗ trợ riêng, bạn có thể chọn kênh liên hệ trực tiếp để được tư vấn nhanh hơn.
                </p>

                <div className="mt-6 grid gap-3">
                  <a
                    href="https://zalo.me/0823387108"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-blue-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat qua Zalo
                  </a>
                  <a
                    href="mailto:smartmallhq@gmail.com"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <Mail className="h-4 w-4" />
                    Gửi email
                  </a>
                </div>

                <div className="mt-5 rounded-2xl border border-violet-200/50 bg-violet-50/60 px-4 py-3 text-[12px] leading-relaxed text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                  💡 Mẹo: Hãy mô tả rõ nhu cầu và mã đơn (nếu có) để đội ngũ hỗ trợ xử lý nhanh hơn.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default FAQSection
