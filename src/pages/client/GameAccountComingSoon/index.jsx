import React from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import { useGameAccountContent } from './useGameAccountContent'

const getTextValue = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback

  const normalizedValue = value.trim()

  return normalizedValue && normalizedValue !== '[object Object]' ? value : fallback
}

export default function GameAccountComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useGameAccountContent()

  return (
    <div className="min-h-[60vh] bg-white px-4 py-12 dark:bg-gray-900">
      <SEO
        title={getTextValue(content?.seo?.title, t('gameAccount.seo.title'))}
        description={getTextValue(content?.seo?.description, t('gameAccount.description'))}
        noIndex
      />

      <div className="mx-auto flex min-h-[48vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {getTextValue(content?.eyebrow, t('gameAccount.eyebrow'))}
          </p>

          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {getTextValue(content?.title, t('gameAccount.title'))}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-600 dark:text-gray-300">
            {getTextValue(content?.description, t('gameAccount.description'))}
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
            <p className="mb-0 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {getTextValue(content?.note, t('gameAccount.note'))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
