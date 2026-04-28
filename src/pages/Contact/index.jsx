import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getContactPageContent } from '@/services/contactPageContentService'
import ContactBackground from './components/ContactBackground'
import ContactHighlightsSection from './components/ContactHighlightsSection'
import HeroSection from './components/HeroSection'
import ContactMethodsSection from './components/ContactMethodsSection'
import FormAndScheduleSection from './components/FormAndScheduleSection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'
import { normalizeContactContent } from './contactContent'
import './Contact.scss'

const ContactPage = () => {
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
        <HeroSection isVisible={isVisible} content={content.hero} links={content.links} />
        <ContactHighlightsSection section={content.highlightsSection} />
        <ContactMethodsSection section={content.contactMethodsSection} />
        <FormAndScheduleSection section={content.formScheduleSection} workingHoursCard={content.workingHoursCard} links={content.links} />
        <FAQSection section={content.faqSection} helpCard={content.faqHelpCard} links={content.links} />
        <CTASection section={content.ctaSection} links={content.links} />
      </div>
    </main>
  )
}

export default ContactPage
