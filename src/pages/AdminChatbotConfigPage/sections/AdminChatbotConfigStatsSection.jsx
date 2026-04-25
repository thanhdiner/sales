import { Card, Col, Row, Statistic } from 'antd'
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
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title="Trạng thái agent"
            value={agentEnabled ? 'Đang bật' : 'Đang tắt'}
            prefix={<RobotOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title="Provider runtime"
            value={runtimeProvider}
            suffix={runtimeModel}
            prefix={<InfoCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={8}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title="Tools đang bật"
            value={enabledTools}
            suffix={`/ ${totalTools}`}
            prefix={<ToolOutlined />}
          />
        </Card>
      </Col>
    </Row>
  )
}
