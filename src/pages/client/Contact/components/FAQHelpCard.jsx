import React from 'react'
import { Mail, MessageCircle } from 'lucide-react'

const FAQHelpCard = ({ content = {}, links = {} }) => {
  return (
    <div className="contact-card rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="contact-eyebrow text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
        {content.eyebrow}
      </p>

      <h3 className="contact-card-title mt-2 text-xl font-semibold text-gray-950 dark:text-white">
        {content.title}
      </h3>

      <p className="contact-muted-text mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {content.description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <a
          href={links.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-brand-action inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <MessageCircle className="h-4 w-4" />
          {content.zaloButton}
        </a>

        <a
          href={links.emailUrl}
          className="contact-secondary-action inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Mail className="h-4 w-4" />
          {content.emailButton}
        </a>
      </div>

      <p className="contact-tip mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        {content.tip}
      </p>
    </div>
  )
}

export default FAQHelpCard
