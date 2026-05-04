import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import SEO from '@/components/shared/SEO'
import Hero from './sections/Hero'
import Benefits from './sections/Benefits'
import Features from './sections/Features'
import AboutOwner from './sections/AboutOwner'
import Timeline from './sections/Timeline'
import CTA from './sections/CTA'
import { useAboutContent } from './hooks/useAboutContent'
import './index.scss'

const About = () => {
  const { t } = useTranslation('clientAbout')
  const [isVisible, setIsVisible] = useState(false)
  const { data: content } = useAboutContent()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const viewport = { once: true, amount: 0.2 }

  return (
    <main className="about-page min-h-screen overflow-hidden rounded-tl-[8px] rounded-tr-[8px] bg-white shadow dark:bg-gray-800">
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
        <div className="mx-auto max-w-7xl px-6 pt-5 sm:px-8 lg:px-10">
          <ClientBreadcrumb
            label={t('breadcrumb.label')}
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('breadcrumb.about') }
            ]}
          />
        </div>

        <Hero content={content?.heroSection} isVisible={isVisible} viewport={viewport} />
        <Benefits content={content?.benefitsSection} viewport={viewport} />
        <Features content={content?.featuresSection} viewport={viewport} />
        <AboutOwner content={content?.ownerSection} viewport={viewport} />
        <Timeline content={content?.timelineSection} viewport={viewport} />
        <CTA content={content?.ctaSection} viewport={viewport} />
      </div>
    </main>
  )
}

export default About
