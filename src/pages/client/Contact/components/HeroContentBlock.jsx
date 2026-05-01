import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle } from 'lucide-react'
import { viewport } from '../constants'
import HeroTopicTags from './HeroTopicTags'

const HeroContentBlock = ({ content = {}, links = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={viewport}
    >
      <p className="contact-eyebrow mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        {content.eyebrow}
      </p>

      <h1 className="contact-heading max-w-[560px] text-[34px] font-bold leading-[1.15] tracking-[-0.025em] text-gray-950 md:text-[50px] lg:text-[58px] dark:text-white">
        {content.titleLine1}
        <br />
        {content.titleLine2}
      </h1>

      <p className="contact-copy mt-5 max-w-[560px] text-[15.5px] font-medium leading-[1.8] text-gray-600 md:text-[16px] dark:text-gray-300">
        {content.description}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href={links.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-brand-action inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0b74e5] px-5 text-[15px] font-semibold text-white transition hover:bg-[#0968cf]"
        >
          <MessageCircle className="h-4 w-4" />
          {content.zaloButton}
        </a>

        <a
          href={links.emailUrl}
          className="contact-secondary-action inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-[15px] font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
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
