import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, HelpCircle } from 'lucide-react'
import { viewport } from '../constants'
import FAQHelpCard from '../components/FAQHelpCard'
import FAQItem from '../components/FAQItem'

const FAQ = ({ section = {}, helpCard = {}, links = {} }) => {
  const [openIndex, setOpenIndex] = useState(null)
  const faqs = section.items || []

  return (
    <motion.section
      className="contact-faq-section px-4 py-12 md:py-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-6xl">
        <div className="contact-faq-showcase">
          <div className="contact-faq-hero">
            <div className="contact-faq-hero__bubble contact-faq-hero__bubble--question" aria-hidden="true">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="contact-faq-hero__bubble contact-faq-hero__bubble--chat" aria-hidden="true">
              <MessageCircle className="h-5 w-5" />
              <span />
            </div>
            <div className="contact-faq-hero__dots contact-faq-hero__dots--left" aria-hidden="true" />
            <div className="contact-faq-hero__dots contact-faq-hero__dots--right" aria-hidden="true" />

            <div className="contact-faq-hero__content">
              {section.eyebrow && <p className="contact-faq-hero__eyebrow">{section.eyebrow}</p>}
              <h2 className="contact-faq-hero__title">{section.title}</h2>
              {section.description && <p className="contact-faq-hero__description">{section.description}</p>}
            </div>
          </div>

          <div className="contact-faq-body">
            <div className="grid items-start gap-7 lg:grid-cols-12">
              <motion.div
                className="lg:col-span-8"
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                viewport={viewport}
              >
                <div className="contact-faq-shell">
                  <div className="contact-faq-list">
                    {faqs.map((faq, index) => (
                      <FAQItem
                        key={`${faq.question}-${index}`}
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
                <FAQHelpCard content={helpCard} links={links} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default FAQ
