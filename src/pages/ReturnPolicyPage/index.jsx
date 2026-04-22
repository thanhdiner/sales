import React, { useState } from 'react'
import SEO from '@/components/SEO'
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

const ReturnPolicyPage = () => {
  const [requestModalVisible, setRequestModalVisible] = useState(false)
  const [trackingModalVisible, setTrackingModalVisible] = useState(false)

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-br from-green-50 to-blue-50 py-8 dark:from-gray-800 dark:to-gray-800">
      <SEO
        title="Chính sách đổi trả"
        description="Chính sách đổi trả hàng tại SmartMall - rõ ràng, minh bạch, bảo vệ quyền lợi khách hàng."
      />

      <div className="mx-auto max-w-7xl px-4">
        <ReturnPolicyHeader
          onOpenRequestModal={() => setRequestModalVisible(true)}
          onOpenTrackingModal={() => setTrackingModalVisible(true)}
        />

        <ReturnPolicyProcessSection />
        <ReturnPolicyConditionsSection />
        <ReturnPolicyCategoriesSection />
        <ReturnPolicyReasonsSection />
        <ReturnPolicyFaqSection />
        <ReturnPolicySupportSection />
        <ReturnPolicyFooterCta />

        <ReturnRequestModal open={requestModalVisible} onClose={() => setRequestModalVisible(false)} />
        <ReturnTrackingModal open={trackingModalVisible} onClose={() => setTrackingModalVisible(false)} />
      </div>
    </div>
  )
}

export default ReturnPolicyPage
