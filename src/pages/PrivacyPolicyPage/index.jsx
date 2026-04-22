import React, { useState } from 'react'
import { Alert, Col, Row } from 'antd'
import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'
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

const PrivacyPolicyPage = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const [contactModalVisible, setContactModalVisible] = useState(false)

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 py-8 dark:from-gray-800 dark:to-gray-800">
      <SEO
        title="Chính sách bảo mật"
        description="Chính sách bảo mật thông tin của SmartMall – cam kết bảo vệ dữ liệu cá nhân của bạn."
      />

      <div className="mx-auto max-w-7xl px-4">
        <PolicyPageHeader />

        <Alert
          message={<span className="dark:text-gray-100">Tóm tắt nhanh</span>}
          description={
            <span className="dark:text-gray-300">
              Chúng tôi thu thập thông tin cần thiết để cung cấp dịch vụ, bảo vệ dữ liệu bằng mã hóa SSL, không bán
              thông tin cho bên thứ ba, và bạn có toàn quyền kiểm soát dữ liệu cá nhân.
            </span>
          }
          type="info"
          showIcon
          className="mb-8 rounded-lg dark:bg-gray-800"
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <PolicySidebar />
          </Col>

          <Col xs={24} lg={18}>
            <div className="space-y-8">
              <DataCollectionSection />
              <InformationUsageSection />
              <InformationSharingSection />
              <SecuritySection />
              <UserRightsSection onOpenContactModal={() => setContactModalVisible(true)} />
              <CookiesSection />
              <PolicyFaqSection />
              <ContactSection websiteConfig={websiteConfig} />
            </div>
          </Col>
        </Row>

        <PolicyContactModal open={contactModalVisible} onClose={() => setContactModalVisible(false)} />
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
