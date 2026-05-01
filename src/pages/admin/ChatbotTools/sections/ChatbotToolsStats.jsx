import { Card, Col, Row, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { ToolOutlined } from '@ant-design/icons'

export default function ChatbotToolsStats({
  totalTools,
  enabledTools,
  disabledTools
}) {
  const { t } = useTranslation('adminChatbotTools')

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title={t('stats.totalTools')} value={totalTools} prefix={<ToolOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title={t('stats.enabledTools')} value={enabledTools} prefix={<ToolOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title={t('stats.disabledTools')} value={disabledTools} prefix={<ToolOutlined />} />
        </Card>
      </Col>
    </Row>
  )
}
