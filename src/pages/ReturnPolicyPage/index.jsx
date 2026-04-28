import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getReturnPolicyContent } from '@/services/returnPolicyContentService'
import ReturnPolicyHeader from './components/ReturnPolicyHeader'
import ReturnPolicyProcessSection from './components/ReturnPolicyProcessSection'
import ReturnPolicyConditionsSection from './components/ReturnPolicyConditionsSection'
import ReturnPolicyCategoriesSection from './components/ReturnPolicyCategoriesSection'
import ReturnPolicyReasonsSection from './components/ReturnPolicyReasonsSection'
import ReturnPolicyFaqSection from './components/ReturnPolicyFaqSection'
import ReturnPolicySupportSection from './components/ReturnPolicySupportSection'
import ReturnPolicyFooterCta from './components/ReturnPolicyFooterCta'
import ReturnRequestModal from './components/ReturnRequestModal'
import ReturnTrackingModal from './components/ReturnTrackingModal'
import { normalizeReturnPolicyContent } from './returnPolicyContent'

const ReturnPolicyPage = () => {
  const language = useCurrentLanguage()
  const [requestModalVisible, setRequestModalVisible] = useState(false)
  const [trackingModalVisible, setTrackingModalVisible] = useState(false)
  const { data: returnPolicyData } = useQuery({
    queryKey: ['return-policy-content', language],
    queryFn: async () => {
      const response = await getReturnPolicyContent()
      return response?.data || null
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  })
  const content = useMemo(
    () => normalizeReturnPolicyContent(returnPolicyData, language),
    [returnPolicyData, language]
  )

  return (
    <div className="return-policy-page min-h-screen rounded-xl bg-gradient-to-br from-green-50 to-blue-50 py-8 dark:bg-gray-950 dark:bg-none">
      <SEO title={content.seo.title} description={content.seo.description} />

      <div className="mx-auto max-w-7xl px-4">
        <ReturnPolicyHeader
          content={content.pageHeader}
          onOpenRequestModal={() => setRequestModalVisible(true)}
          onOpenTrackingModal={() => setTrackingModalVisible(true)}
        />

        <ReturnPolicyProcessSection content={content.process} />
        <ReturnPolicyConditionsSection conditions={content.conditions} refund={content.refund} />
        <ReturnPolicyCategoriesSection content={content.categories} />
        <ReturnPolicyReasonsSection content={content.reasons} onOpenRequestModal={() => setRequestModalVisible(true)} />
        <ReturnPolicyFaqSection content={content.faqSection} />
        <ReturnPolicySupportSection content={content.support} />
        <ReturnPolicyFooterCta content={content.footerCta} />

        <ReturnRequestModal open={requestModalVisible} onClose={() => setRequestModalVisible(false)} reasons={content.reasons.items} />
        <ReturnTrackingModal open={trackingModalVisible} onClose={() => setTrackingModalVisible(false)} />
      </div>
    </div>
  )
}

export default ReturnPolicyPage
