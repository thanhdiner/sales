import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import HeroSection from './components/HeroSection'
import BenefitsSection from './components/BenefitsSection'
import FeaturesSection from './components/FeaturesSection'
import AboutOwnerSection from './components/AboutOwnerSection'
import TimelineSection from './components/TimelineSection'
import CTASection from './components/CTASection'
import { useAboutContent } from './hooks/useAboutContent'
import './AboutPage.scss'

const AboutPage = () => {
  const { t } = useTranslation('clientAbout')
  const [isVisible, setIsVisible] = useState(false)
  const { data: content } = useAboutContent()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const viewport = { once: true, amount: 0.2 }

  return (
    <main className="about-page min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <SEO
        title={content?.seo?.title || t('seo.title')}
        description={content?.seo?.description || t('seo.description')}
        url="https://smartmall.site/about"
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="about-page__glow about-page__glow--primary absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl dark:bg-blue-500/10" />
        <div className="about-page__glow about-page__glow--secondary absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="relative z-10">
        <HeroSection content={content?.heroSection} isVisible={isVisible} viewport={viewport} />
        <BenefitsSection content={content?.benefitsSection} viewport={viewport} />
        <FeaturesSection content={content?.featuresSection} viewport={viewport} />
        <AboutOwnerSection content={content?.ownerSection} viewport={viewport} />
        <TimelineSection content={content?.timelineSection} viewport={viewport} />
        <CTASection content={content?.ctaSection} viewport={viewport} />
      </div>
    </main>
  )
}

export default AboutPage
