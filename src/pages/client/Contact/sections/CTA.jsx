import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { viewport } from '../constants'

const CTA = ({ section = {}, links = {} }) => {
  const navigate = useNavigate()
  const productsUrl = links.productsUrl || '/products'

  const handleProductsClick = () => {
    if (/^https?:\/\//i.test(productsUrl)) {
      window.open(productsUrl, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(productsUrl)
  }

  return (
    <motion.section
      className="px-4 py-12 md:px-6 md:py-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <div className="contact-cta-card relative overflow-hidden rounded-[28px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:bg-gray-800">
          <div className="contact-decoration contact-decoration--accent absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#dff7ef]" />
          <div className="contact-decoration contact-decoration--accent absolute -left-10 top-10 h-20 w-20 rounded-full bg-[#d9f7f0]" />
          <div className="contact-decoration contact-decoration--border absolute -bottom-14 left-8 h-28 w-28 rounded-full border-[8px] border-[#b9efe3]" />
          <div className="contact-decoration contact-decoration--accent absolute bottom-10 left-12 h-3 w-3 rounded-full bg-[#f1c94c]" />
          <div className="contact-decoration contact-decoration--accent absolute bottom-16 left-20 h-2.5 w-2.5 rounded-full bg-[#f1c94c]" />
          <div className="contact-decoration contact-decoration--accent absolute bottom-8 left-24 h-2.5 w-2.5 rounded-full bg-[#2a3e8f]" />
          <div className="contact-decoration contact-decoration--line absolute bottom-7 left-36 h-16 w-px rotate-45 bg-[#2a3e8f]" />
          <div className="contact-decoration contact-decoration--line absolute bottom-6 left-44 h-16 w-px rotate-45 bg-[#2a3e8f]" />
          <div className="contact-decoration contact-decoration--accent absolute -bottom-8 right-20 h-24 w-24 rounded-full bg-blue-100/50 dark:bg-blue-500/10" />
          <div className="contact-decoration contact-decoration--accent absolute right-8 top-1/2 h-3 w-3 rounded-full bg-[#4f7df0]" />

          <div className="relative z-10 flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              viewport={viewport}
            >
              <p className="contact-section-eyebrow--accent mb-3 text-sm font-bold uppercase tracking-[0.28em] text-emerald-600">
                {section.eyebrow}
              </p>

              <h2 className="contact-title text-[28px] font-extrabold leading-tight tracking-[-0.5px] text-[#1a1a2e] md:text-[42px] dark:text-white">
                {section.title}
              </h2>

              <p className="contact-description mx-auto mt-4 max-w-[620px] text-[15px] font-medium leading-[1.8] text-[#767d87] md:text-[17px] dark:text-gray-400">
                {section.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={links.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-brand-action group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-blue-700/30"
                >
                  <MessageCircle className="h-4 w-4" />
                  {section.chatButton}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>

                <button
                  type="button"
                  onClick={handleProductsClick}
                  className="contact-secondary-action group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  {section.productsButton}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default CTA