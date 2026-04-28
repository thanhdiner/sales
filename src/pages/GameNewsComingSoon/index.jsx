import { Newspaper, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import { useGameNewsContent } from './useGameNewsContent'

const getTextValue = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback

  const normalizedValue = value.trim()

  return normalizedValue && normalizedValue !== '[object Object]' ? value : fallback
}

export default function GameNewsComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useGameNewsContent()
  const description = getTextValue(content?.description, t('gameNews.description'))
  const descriptionSecondLine = getTextValue(content?.descriptionSecondLine, t('gameNews.descriptionSecondLine'))

  return (
    <div className="game-news-coming-soon-page flex min-h-[60vh] items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 dark:bg-gray-950 dark:bg-none">
      <SEO
        title={getTextValue(content?.seo?.title, t('gameNews.seo.title'))}
        description={getTextValue(content?.seo?.description, `${description} ${descriptionSecondLine}`.trim())}
        noIndex
      />

      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow dark:border dark:border-solid dark:border-gray-800 dark:bg-gray-900">
        <Newspaper className="mb-3 h-14 w-14 text-indigo-500" aria-hidden="true" />

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getTextValue(content?.title, t('gameNews.title'))}
        </h1>

        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          {description}
          <br />
          {descriptionSecondLine}
        </p>

        <div className="flex items-center gap-2 text-sm text-indigo-600">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {getTextValue(content?.status, t('gameNews.status'))}
        </div>
      </div>
    </div>
  )
}
