import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle } from 'lucide-react'
import { viewport } from '../constants'
import HeroTopicTags from './HeroTopicTags'

const HeroContentBlock = ({ content = {}, links = {} }) => {
  const renderSecondLine = line => {
    const text = line || ''
    const readyMatch = text.match(/(sẵn sàng\.?|ready\.?)$/i)

    if (!readyMatch) return text

    const accent = readyMatch[0]
    const before = text.slice(0, text.length - accent.length)

    return (
      <>
        {before}
        <span className="contact-hero-accent">{accent}</span>
      </>
    )
  }

  return (
    <motion.div
      className="contact-hero-copy"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={viewport}
    >
      <p className="contact-eyebrow mb-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5a1f] dark:text-orange-300">
        {content.eyebrow}
      </p>

      <h1 className="contact-heading max-w-[560px] text-[36px] font-black leading-[1.05] text-[#151821] md:text-[56px] lg:text-[64px] dark:text-white">
        {content.titleLine1}
        <br />
        {renderSecondLine(content.titleLine2)}
      </h1>

      <p className="contact-copy mt-5 max-w-[520px] text-[14px] font-medium leading-7 text-[#4b5563] md:text-[15px] dark:text-gray-300">
        {content.description}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href={links.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-brand-action inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#ff641f] px-5 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(255,100,31,0.22)] transition hover:bg-[#f25312]"
        >
          <MessageCircle className="h-4 w-4" />
          {content.zaloButton}
        </a>

        <a
          href={links.emailUrl}
          className="contact-secondary-action inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#f0d7c9] bg-white px-5 text-[14px] font-bold text-[#2d3038] shadow-[0_8px_20px_rgba(40,24,14,0.04)] transition hover:border-[#ffb38f] hover:bg-[#fff7f2] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <Mail className="h-4 w-4" />
          {content.emailButton}
        </a>
      </div>

      <HeroTopicTags topics={content.topics} />
    </motion.div>
  )
}

export default HeroContentBlock
