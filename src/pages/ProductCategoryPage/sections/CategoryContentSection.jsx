import React from 'react'
import { useTranslation } from 'react-i18next'
import { ContentSection } from '@/components/PageLayout'

function CategoryContentSection({ category }) {
  const { t } = useTranslation('clientProducts')
  const content = category?.content?.trim()

  if (!content) return null

  return (
    <ContentSection title={t('categoryPage.content.title')}>
      <div
        className="content-section__rich-text"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </ContentSection>
  )
}

export default CategoryContentSection
