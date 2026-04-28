import React from 'react'
import { useTranslation } from 'react-i18next'

function CategoryContentSection({ category }) {
  const { t } = useTranslation('clientProducts')
  const content = category?.content?.trim()

  if (!content) return null

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900 md:p-6">
      <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('categoryPage.content.title')}</h2>
      <div
        className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-300 [&_a]:text-blue-600 [&_a]:underline [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  )
}

export default CategoryContentSection
