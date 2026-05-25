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
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`contact-faq-item group w-full text-left ${isOpen ? 'contact-faq-item--open' : ''}`}
      >
        <div className="contact-faq-item__row">
          <div className="contact-faq-item__question-wrap">
            <span className="contact-faq-index">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span className="contact-faq-question">
              {faq.question}
            </span>
          </div>

          <span className="contact-faq-chevron">
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
              <p className="contact-faq-answer">
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
