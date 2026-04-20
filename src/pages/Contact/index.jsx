import React, { useState, useEffect } from 'react'
import SEO from '@/components/SEO'
import HeroSection from './components/HeroSection'
import ContactMethodsSection from './components/ContactMethodsSection'
import FormAndScheduleSection from './components/FormAndScheduleSection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <SEO
        title="Liên hệ"
        description="Liên hệ SmartMall qua Zalo, Facebook hoặc email. Hỗ trợ nhanh chóng, tư vấn tận tâm trong giờ hành chính và cả ngoài giờ."
        url="https://smartmall.site/contact"
      />

      {/* Decorative background blurs — same style as About page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-100/20 blur-3xl dark:bg-cyan-500/5" />
      </div>

      <div className="relative z-10">
        <HeroSection isVisible={isVisible} />
        <ContactMethodsSection />
        <FormAndScheduleSection />
        <FAQSection />
        <CTASection />
      </div>
    </main>
  )
}

export default ContactPage
