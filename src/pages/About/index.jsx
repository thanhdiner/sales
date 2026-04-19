import React, { useState, useEffect } from 'react'
import SEO from '@/components/SEO'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import FeaturesSection from './components/FeaturesSection'
import AboutOwnerSection from './components/AboutOwnerSection'
import TimelineSection from './components/TimelineSection'
import CTASection from './components/CTASection'

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const viewport = { once: true, amount: 0.2 }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <SEO
        title="Về SmartMall"
        description="SmartMall – Shop nhỏ chuyên bán tài khoản game và phần mềm bản quyền. Uy tín, rõ ràng, giá hợp lý, hỗ trợ tận tâm."
        url="https://smartmall.site/about"
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="relative z-10">
        <HeroSection isVisible={isVisible} viewport={viewport} />
        <StatsSection viewport={viewport} />
        <FeaturesSection viewport={viewport} />
        <AboutOwnerSection viewport={viewport} />
        <TimelineSection viewport={viewport} />
        <CTASection viewport={viewport} />
      </div>
    </main>
  )
}

export default AboutPage
