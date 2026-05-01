import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import GuideHero from './sections/GuideHero'
import GuideProcess from './sections/GuideProcess'
import GuideDetailedSteps from './sections/GuideDetailedSteps'
import GuidePayment from './sections/GuidePayment'
import GuideFaq from './sections/GuideFaq'
import GuideTips from './sections/GuideTips'
import GuideSupport from './sections/GuideSupport'
import { getShoppingGuideContent } from './content'
import './index.scss'

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
        <GuideHero content={guideContent.hero} onRegister={() => navigate('/user/register')} />
        <GuideProcess content={guideContent} currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <GuideDetailedSteps content={guideContent} />
        <GuidePayment content={guideContent} />
        <GuideFaq content={guideContent} />
        <GuideTips content={guideContent} />
        <GuideSupport
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
