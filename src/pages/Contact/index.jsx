import React, { useState, useEffect } from 'react'
import SEO from '@/components/SEO'
import ContactBackground from './components/ContactBackground'
import ContactHighlightsSection from './components/ContactHighlightsSection'
import HeroSection from './components/HeroSection'
import ContactMethodsSection from './components/ContactMethodsSection'
import FormAndScheduleSection from './components/FormAndScheduleSection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'
import './Contact.scss'

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="contact-themed min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <SEO
        title="Liên hệ"
        description="Liên hệ SmartMall qua Zalo, Facebook hoặc email. Hỗ trợ nhanh chóng, tư vấn tận tâm trong giờ hành chính và cả ngoài giờ."
        url="https://smartmall.site/contact"
      />

      <ContactBackground />

      <div className="relative z-10">
        <HeroSection isVisible={isVisible} />
        <ContactHighlightsSection />
        <ContactMethodsSection />
        <FormAndScheduleSection />
        <FAQSection />
        <CTASection />
      </div>
    </main>
  )
}

export default ContactPage
