import { Card, Col, Row, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  InfoCircleOutlined,
  RobotOutlined,
  ToolOutlined
} from '@ant-design/icons'

export default function AdminChatbotConfigStatsSection({
  agentEnabled,
  runtimeProvider,
  runtimeModel,
  enabledTools,
  totalTools
}) {
  const { t } = useTranslation('adminChatbotConfig')

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title={t('stats.agentStatus')}
            value={agentEnabled ? t('stats.enabled') : t('stats.disabled')}
            prefix={<RobotOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title={t('stats.runtimeProvider')}
            value={runtimeProvider}
            suffix={runtimeModel}
            prefix={<InfoCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title={t('stats.enabledTools')}
            value={enabledTools}
            suffix={`/ ${totalTools}`}
            prefix={<ToolOutlined />}
          />
        </Card>
      </Col>
    </Row>
  )
}
