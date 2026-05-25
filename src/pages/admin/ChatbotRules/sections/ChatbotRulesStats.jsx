import { Card, Col, Row, Statistic, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { FileTextOutlined, RobotOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function ChatbotRulesStats({
  rulesCount,
  keywordsCount,
  promptOverrideEnabled
}) {
  const { t } = useTranslation('adminChatbotRules')

  return (
    <Row gutter={[16, 16]} className="admin-chatbot-rules-stats mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card admin-chatbot-rules-stat-card">
          <Statistic title={t('stats.systemRules')} value={rulesCount} prefix={<FileTextOutlined />} />
          <Text type="secondary" className="admin-chatbot-stat-desc">
            {t('stats.systemRulesDesc')}
          </Text>
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card admin-chatbot-rules-stat-card">
          <Statistic title={t('stats.escalateKeywords')} value={keywordsCount} prefix={<RobotOutlined />} />
          <Text type="secondary" className="admin-chatbot-stat-desc">
            {t('stats.escalateKeywordsDesc')}
          </Text>
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card admin-chatbot-rules-stat-card">
          <Statistic
            title={t('stats.promptOverride')}
            value={promptOverrideEnabled ? t('stats.overrideEnabled') : t('stats.defaultPrompt')}
          />
          <Text type="secondary" className="admin-chatbot-stat-desc">
            {promptOverrideEnabled ? t('stats.promptOverrideEnabledDesc') : t('stats.promptOverrideDefaultDesc')}
          </Text>
        </Card>
      </Col>
    </Row>
  )
}
