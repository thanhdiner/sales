import React, { useMemo } from 'react'
import { Collapse, Typography } from 'antd'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getFaqContent } from '@/services/faqContentService'
import { normalizeFaqContent } from './faqContent'

const { Title } = Typography
const { Panel } = Collapse

const FAQPage = () => {
  const language = useCurrentLanguage()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const supportPhone = websiteConfig?.contactInfo?.phone || '0823387108'
  const { data: faqPageData } = useQuery({
    queryKey: ['faq-page-content', language],
    queryFn: async () => {
      const response = await getFaqContent()
      return response?.data || null
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  })
  const content = useMemo(
    () => normalizeFaqContent(faqPageData, { language, phone: supportPhone }),
    [faqPageData, language, supportPhone]
  )
  const faqData = Array.isArray(content.items) ? content.items : []

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SEO title={content.seo.title} description={content.seo.description} />

      <div className="mb-9 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          {content.page.eyebrow}
        </p>

        <Title
          level={2}
          className="!mb-0 !text-3xl !font-semibold !tracking-[-0.03em] !text-gray-900 dark:!text-white"
        >
          {content.page.title}
        </Title>

        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
          {content.page.description}
        </p>
      </div>

      <Collapse
        accordion
        bordered={false}
        expandIconPosition="end"
        className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        {faqData.map((faq, idx) => (
          <Panel
            key={faq.id || idx}
            header={
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {faq.question}
              </span>
            }
            className="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
          >
            <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {faq.answer}
            </p>
          </Panel>
        ))}
      </Collapse>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {content.support.text}{' '}
          <Link
            to="/contact"
            className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
          >
            {content.support.link}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default FAQPage
