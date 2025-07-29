import { Row, Col, Typography } from 'antd'
import ChangePasswordForm from './ChangePasswordForm'
import TwoFactorAuthPanel from './TwoFactorAuthPanel'

const { Title } = Typography

const AdminSecurityTab = () => {
  return (
    <div className="pb-6">
      <Title level={2} className="dark:text-gray-200">
        Bảo mật tài khoản
      </Title>
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <ChangePasswordForm />
        </Col>
        <Col xs={24} md={12}>
          <TwoFactorAuthPanel />
        </Col>
      </Row>
    </div>
  )
}

export default AdminSecurityTab
