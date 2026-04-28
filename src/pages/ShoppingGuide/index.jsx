import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import GuideHeroSection from './components/GuideHeroSection'
import GuideProcessSection from './components/GuideProcessSection'
import GuideDetailedStepsSection from './components/GuideDetailedStepsSection'
import GuidePaymentSection from './components/GuidePaymentSection'
import GuideFaqSection from './components/GuideFaqSection'
import GuideTipsSection from './components/GuideTipsSection'
import GuideSupportSection from './components/GuideSupportSection'
import { getShoppingGuideContent } from './content'
import './ShoppingGuide.scss'

const ShoppingGuide = () => {
  const { t, i18n } = useTranslation('clientShoppingGuide')
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const language = i18n.resolvedLanguage || i18n.language
  const guideContent = useMemo(
    () => getShoppingGuideContent({ websiteConfig, language, t }),
    [websiteConfig, language, t]
  )

  return (
    <div className="shopping-guide-page">
      <SEO title={guideContent.seo.title} description={guideContent.seo.description} />

      <main className="shopping-guide-main">
        <GuideHeroSection content={guideContent.hero} onRegister={() => navigate('/user/register')} />
        <GuideProcessSection content={guideContent} currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <GuideDetailedStepsSection content={guideContent} />
        <GuidePaymentSection content={guideContent} />
        <GuideFaqSection content={guideContent} />
        <GuideTipsSection content={guideContent} />
        <GuideSupportSection
          content={guideContent.supportSection}
          websiteConfig={websiteConfig}
          onBrowseProducts={() => navigate('/products')}
          onViewCoupons={() => navigate('/coupons')}
        />
      </main>
    </div>
  )
}

export default ShoppingGuide
