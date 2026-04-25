import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { faqs, viewport } from '../constants'
import FAQHelpCard from './FAQHelpCard'
import FAQItem from './FAQItem'
import SectionHeader from './SectionHeader'

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
        <SectionHeader
          eyebrow="Câu hỏi thường gặp"
          title="Trung tâm trợ giúp"
          description="Một số thắc mắc phổ biến đã được tổng hợp sẵn để bạn tra cứu nhanh trước khi liên hệ trực tiếp."
          eyebrowClassName="text-violet-600"
        />

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="contact-faq-shell rounded-[28px] border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="contact-faq-list space-y-3 rounded-[22px] bg-gradient-to-br from-violet-50/30 via-white to-blue-50/20 p-4 md:p-5 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
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

          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            viewport={viewport}
          >
            <FAQHelpCard />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default FAQSection
