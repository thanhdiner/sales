import React, { useMemo, useState } from 'react'
import { Alert, Col, Row } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getPrivacyPolicyContent } from '@/services/client/content/privacyPolicy'
import PolicyHeader from './sections/PolicyHeader'
import PolicySidebar from './components/PolicySidebar'
import DataCollection from './sections/DataCollection'
import InformationUsage from './sections/InformationUsage'
import InformationSharing from './sections/InformationSharing'
import Security from './sections/Security'
import UserRights from './sections/UserRights'
import Cookies from './sections/Cookies'
import PolicyFaq from './sections/PolicyFaq'
import Contact from './sections/Contact'
import PolicyContactModal from './components/PolicyContactModal'
import { normalizePrivacyPolicyContent } from './privacyPolicyContent'

const PrivacyPolicy = () => {
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
        <PolicyHeader content={content.pageHeader} />

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
              <DataCollection section={content.dataCollectionSection} />
              <InformationUsage section={content.informationUsageSection} />
              <InformationSharing section={content.informationSharingSection} />
              <Security section={content.securitySection} />
              <UserRights section={content.userRightsSection} onOpenContactModal={() => setContactModalVisible(true)} />
              <Cookies section={content.cookiesSection} />
              <PolicyFaq section={content.faqSection} />
              <Contact section={content.contactSection} websiteConfig={websiteConfig} />
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

export default PrivacyPolicy
