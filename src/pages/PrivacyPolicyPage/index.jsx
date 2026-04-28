import React, { useMemo, useState } from 'react'
import { Alert, Col, Row } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getPrivacyPolicyContent } from '@/services/privacyPolicyContentService'
import PolicyPageHeader from './components/PolicyPageHeader'
import PolicySidebar from './components/PolicySidebar'
import DataCollectionSection from './components/DataCollectionSection'
import InformationUsageSection from './components/InformationUsageSection'
import InformationSharingSection from './components/InformationSharingSection'
import SecuritySection from './components/SecuritySection'
import UserRightsSection from './components/UserRightsSection'
import CookiesSection from './components/CookiesSection'
import PolicyFaqSection from './components/PolicyFaqSection'
import ContactSection from './components/ContactSection'
import PolicyContactModal from './components/PolicyContactModal'
import { normalizePrivacyPolicyContent } from './privacyPolicyContent'

const PrivacyPolicyPage = () => {
  const language = useCurrentLanguage()
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const { data: privacyPolicyData } = useQuery({
    queryKey: ['privacy-policy-content', language],
    queryFn: async () => {
      const response = await getPrivacyPolicyContent()
      return response?.data || null
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  })
  const content = useMemo(
    () => normalizePrivacyPolicyContent(privacyPolicyData, language),
    [privacyPolicyData, language]
  )

  return (
    <div className="privacy-policy-page min-h-screen rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 py-8 dark:bg-gray-950 dark:bg-none">
      <SEO title={content.seo.title} description={content.seo.description} />

      <div className="mx-auto max-w-7xl px-4">
        <PolicyPageHeader content={content.pageHeader} />

        <Alert
          message={<span className="dark:text-gray-100">{content.summary.title}</span>}
          description={<span className="dark:text-gray-300">{content.summary.description}</span>}
          type="info"
          showIcon
          className="mb-8 rounded-lg dark:bg-gray-800"
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <PolicySidebar title={content.sidebar.title} sections={content.sections} />
          </Col>

          <Col xs={24} lg={18}>
            <div className="space-y-8">
              <DataCollectionSection section={content.dataCollectionSection} />
              <InformationUsageSection section={content.informationUsageSection} />
              <InformationSharingSection section={content.informationSharingSection} />
              <SecuritySection section={content.securitySection} />
              <UserRightsSection section={content.userRightsSection} onOpenContactModal={() => setContactModalVisible(true)} />
              <CookiesSection section={content.cookiesSection} />
              <PolicyFaqSection section={content.faqSection} />
              <ContactSection section={content.contactSection} websiteConfig={websiteConfig} />
            </div>
          </Col>
        </Row>

        <PolicyContactModal
          content={content.contactModal}
          open={contactModalVisible}
          websiteConfig={websiteConfig}
          onClose={() => setContactModalVisible(false)}
        />
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
