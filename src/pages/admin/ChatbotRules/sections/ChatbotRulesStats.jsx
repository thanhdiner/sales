import { Card, Col, Row, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { FileTextOutlined, RobotOutlined } from '@ant-design/icons'

export default function ChatbotRulesStats({
  rulesCount,
  keywordsCount,
  promptOverrideEnabled
}) {
  const { t } = useTranslation('adminChatbotRules')

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title={t('stats.systemRules')} value={rulesCount} prefix={<FileTextOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title={t('stats.escalateKeywords')} value={keywordsCount} prefix={<RobotOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title={t('stats.promptOverride')}
            value={promptOverrideEnabled ? t('stats.overrideEnabled') : t('stats.defaultPrompt')}
          />
        </Card>
      </Col>
    </Row>
  )
}
