import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getReturnPolicyContent } from '@/services/client/content/returnPolicy'
import ReturnPolicyHeader from './sections/ReturnPolicyHeader'
import ReturnPolicyProcess from './sections/ReturnPolicyProcess'
import ReturnPolicyConditions from './sections/ReturnPolicyConditions'
import ReturnPolicyCategories from './sections/ReturnPolicyCategories'
import ReturnPolicyReasons from './sections/ReturnPolicyReasons'
import ReturnPolicyFaq from './sections/ReturnPolicyFaq'
import ReturnPolicySupport from './sections/ReturnPolicySupport'
import ReturnPolicyFooterCta from './sections/ReturnPolicyFooterCta'
import ReturnRequestModal from './components/ReturnRequestModal'
import ReturnTrackingModal from './components/ReturnTrackingModal'
import { normalizeReturnPolicyContent } from './returnPolicyContent'

const ReturnPolicy = () => {
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

        <ReturnPolicyProcess content={content.process} />
        <ReturnPolicyConditions conditions={content.conditions} refund={content.refund} />
        <ReturnPolicyCategories content={content.categories} />
        <ReturnPolicyReasons content={content.reasons} onOpenRequestModal={() => setRequestModalVisible(true)} />
        <ReturnPolicyFaq content={content.faqSection} />
        <ReturnPolicySupport content={content.support} />
        <ReturnPolicyFooterCta content={content.footerCta} />

        <ReturnRequestModal open={requestModalVisible} onClose={() => setRequestModalVisible(false)} reasons={content.reasons.items} />
        <ReturnTrackingModal open={trackingModalVisible} onClose={() => setTrackingModalVisible(false)} />
      </div>
    </div>
  )
}

export default ReturnPolicy
