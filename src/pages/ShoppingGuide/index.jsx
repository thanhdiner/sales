import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '@/components/SEO'
import GuideHeroSection from './components/GuideHeroSection'
import GuideProcessSection from './components/GuideProcessSection'
import GuideDetailedStepsSection from './components/GuideDetailedStepsSection'
import GuidePaymentSection from './components/GuidePaymentSection'
import GuideFaqSection from './components/GuideFaqSection'
import GuideTipsSection from './components/GuideTipsSection'
import GuideSupportSection from './components/GuideSupportSection'

const ShoppingGuide = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen rounded-xl bg-slate-50 dark:bg-gray-900">
      <SEO
        title="Hướng dẫn mua hàng"
        description="Hướng dẫn mua hàng tại SmartMall từ A đến Z: tìm sản phẩm, thanh toán, nhận hàng."
      />

      <main className="overflow-hidden">
        <GuideHeroSection onRegister={() => navigate('/user/register')} />
        <GuideProcessSection currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <GuideDetailedStepsSection />
        <GuidePaymentSection />
        <GuideFaqSection />
        <GuideTipsSection />
        <GuideSupportSection
          websiteConfig={websiteConfig}
          onBrowseProducts={() => navigate('/products')}
          onViewCoupons={() => navigate('/coupons')}
        />
      </main>
    </div>
  )
}

export default ShoppingGuide
