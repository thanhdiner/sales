import { Card, Col, Row, Statistic } from 'antd'
import { ToolOutlined } from '@ant-design/icons'

export default function AdminChatbotToolsStatsSection({
  totalTools,
  enabledTools,
  disabledTools
}) {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title="Tổng tools" value={totalTools} prefix={<ToolOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title="Đang bật" value={enabledTools} prefix={<ToolOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic title="Đang tắt" value={disabledTools} prefix={<ToolOutlined />} />
        </Card>
      </Col>
    </Row>
  )
}
