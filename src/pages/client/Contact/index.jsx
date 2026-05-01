import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getContactPageContent } from '@/services/client/content/contactPage'
import ContactBackground from './components/ContactBackground'
import ContactHighlights from './sections/ContactHighlights'
import Hero from './sections/Hero'
import ContactMethods from './sections/ContactMethods'
import FormAndSchedule from './sections/FormAndSchedule'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'
import { normalizeContactContent } from './contactContent'
import './index.scss'

const Contact = () => {
  const { t } = useTranslation('clientContact')
  const language = useCurrentLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const { data: contactPageData } = useQuery({
    queryKey: ['contact-page-content', language],
    queryFn: async () => {
      const response = await getContactPageContent()
      return response?.data || null
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  })
  const content = useMemo(() => normalizeContactContent(contactPageData, t), [contactPageData, t])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="contact-themed min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <SEO title={content.seo.title} description={content.seo.description} url="https://smartmall.site/contact" />

      <ContactBackground />

      <div className="relative z-10">
        <Hero isVisible={isVisible} content={content.hero} links={content.links} />
        <ContactHighlights section={content.highlightsSection} />
        <ContactMethods section={content.contactMethodsSection} />
        <FormAndSchedule section={content.formScheduleSection} workingHoursCard={content.workingHoursCard} links={content.links} />
        <FAQ section={content.faqSection} helpCard={content.faqHelpCard} links={content.links} />
        <CTA section={content.ctaSection} links={content.links} />
      </div>
    </main>
  )
}

export default Contact
