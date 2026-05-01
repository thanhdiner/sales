import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import { useTermsContent } from './useTermsContent'

const getTextValue = (value, fallback = '') => {
  return typeof value === 'string' && value.trim() ? value : fallback
}

const getArrayValue = (value, fallback = []) => {
  return Array.isArray(value) && value.length ? value : fallback
}

const interpolateText = (value, replacements) => {
  if (typeof value !== 'string') return value

  return Object.entries(replacements).reduce((result, [key, replacement]) => {
    return result.replaceAll(`{{${key}}}`, replacement)
  }, value)
}

const interpolateSection = (section, replacements) => ({
  ...section,
  title: interpolateText(section.title, replacements),
  paragraphs: Array.isArray(section.paragraphs)
    ? section.paragraphs.map(paragraph => interpolateText(paragraph, replacements))
    : [],
  items: Array.isArray(section.items)
    ? section.items.map(item => interpolateText(item, replacements))
    : [],
  footer: interpolateText(section.footer, replacements)
})

const TermsOfService = () => {
  const { t } = useTranslation('clientTerms')
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const { data: termsContent } = useTermsContent()
  const [expandedSections, setExpandedSections] = useState({})

  const contactEmail = websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'
  const contactPhone = websiteConfig?.contactInfo?.phone || '0823387108'
  const replacements = {
    email: contactEmail,
    phone: contactPhone
  }
  const translatedSections = t('sections', {
    returnObjects: true,
    email: contactEmail,
    phone: contactPhone
  })
  const fallbackSections = Array.isArray(translatedSections) ? translatedSections : []
  const sections = getArrayValue(termsContent?.sections, fallbackSections)
    .map(section => interpolateSection(section, replacements))

  const toggleSection = sectionId => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={getTextValue(termsContent?.seo?.title, t('seo.title'))}
        description={getTextValue(termsContent?.seo?.description, t('seo.description'))}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <header className="mb-9 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {getTextValue(termsContent?.header?.eyebrow, t('header.eyebrow'))}
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-4xl">
            {getTextValue(termsContent?.header?.title, t('header.title'))}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {getTextValue(termsContent?.header?.updatedAt, t('header.updatedAt'))}
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {getTextValue(termsContent?.notice?.title, t('notice.title'))}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {interpolateText(getTextValue(termsContent?.notice?.description, t('notice.description')), replacements)}
          </p>
        </div>

        <div className="space-y-3">
          {sections.map(section => {
            const isExpanded = expandedSections[section.id]

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={Boolean(isExpanded)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>

                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-gray-700">
                    {section.paragraphs?.map((paragraph, index) => (
                      <p
                        key={`${section.id}-paragraph-${index}`}
                        className="mb-3 text-sm leading-6 text-gray-600 last:mb-0 dark:text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {section.items?.length > 0 && (
                      <ul className="mb-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {section.items.map((item, index) => (
                          <li key={`${section.id}-item-${index}`}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {section.footer && (
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {section.footer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
