import SEO from '@/components/shared/SEO'
import { Headphones, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useComingSoonContent } from '@/hooks/content/useComingSoonContent'
import { getTextValue } from '@/utils/contentText'

export default function QuickSupportComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useComingSoonContent('quick-support')

  return (
    <div className="quick-support-coming-soon-page flex min-h-[60vh] items-center justify-center rounded-xl bg-gradient-to-br from-green-50 via-white to-teal-100 px-4 dark:bg-gray-950 dark:bg-none">
      <SEO
        title={getTextValue(content?.seo?.title, t('quickSupport.seo.title'))}
        description={getTextValue(content?.seo?.description, t('quickSupport.description'))}
        noIndex
      />

      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow dark:border dark:border-solid dark:border-gray-800 dark:bg-gray-900">
        <Headphones className="mb-3 h-14 w-14 text-teal-500" aria-hidden="true" />

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getTextValue(content?.title, t('quickSupport.title'))}
        </h1>

        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          {getTextValue(content?.description, t('quickSupport.description'))}
          <br />
          {getTextValue(content?.descriptionSecondLine, t('quickSupport.descriptionSecondLine'))}
        </p>

        <div className="flex items-center gap-2 text-sm text-teal-600">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {getTextValue(content?.status, t('quickSupport.status'))}
        </div>
      </div>
    </div>
  )
}
