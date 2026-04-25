import { Card, Col, Row, Statistic } from 'antd'
import { FileTextOutlined, RobotOutlined } from '@ant-design/icons'

export default function AdminChatbotRulesStatsSection({
  rulesCount,
  keywordsCount,
  promptOverrideEnabled
}) {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title="Rules hệ thống" value={rulesCount} prefix={<FileTextOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title="Từ khóa escalate" value={keywordsCount} prefix={<RobotOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title="Prompt override"
            value={promptOverrideEnabled ? 'Đã dùng' : 'Mặc định'}
          />
        </Card>
      </Col>
    </Row>
  )
}
