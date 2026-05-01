import SEO from '@/components/shared/SEO'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getSpecialPackageContent } from './content'

export default function SpecialPackageComingSoon() {
  const { t, i18n } = useTranslation('clientComingSoon')
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const language = i18n.resolvedLanguage || i18n.language
  const content = useMemo(
    () => getSpecialPackageContent({ websiteConfig, language, t }),
    [websiteConfig, language, t]
  )

  return (
    <div className="min-h-[60vh] bg-white px-4 py-12 dark:bg-gray-900">
      <SEO title={content.seo.title} description={content.seo.description} noIndex={content.noIndex} />

      <div className="mx-auto flex min-h-[48vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {content.eyebrow}
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            {content.title}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-600 dark:text-gray-300">
            {content.description}
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
            <p className="mb-0 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {content.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
