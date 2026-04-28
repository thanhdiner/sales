import SEO from '@/components/SEO'
import { ShieldCheck, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useComingSoonContent } from '@/hooks/useComingSoonContent'
import { getTextValue } from '@/utils/contentText'

export default function LicenseComingSoon() {
  const { t } = useTranslation('clientComingSoon')
  const { data: content } = useComingSoonContent('license')

  return (
    <div className="license-coming-soon-page flex min-h-[60vh] items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 dark:bg-gray-950 dark:bg-none">
      <SEO
        title={getTextValue(content?.seo?.title, t('license.seo.title'))}
        description={getTextValue(content?.seo?.description, t('license.description'))}
        noIndex
      />

      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow dark:border dark:border-solid dark:border-gray-800 dark:bg-gray-900">
        <ShieldCheck className="mb-3 h-14 w-14 text-blue-500" aria-hidden="true" />

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getTextValue(content?.title, t('license.title'))}
        </h1>

        <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
          {getTextValue(content?.description, t('license.description'))}
          <br />
          {getTextValue(content?.descriptionSecondLine, t('license.descriptionSecondLine'))}
        </p>

        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {getTextValue(content?.status, t('license.status'))}
        </div>
      </div>
    </div>
  )
}
