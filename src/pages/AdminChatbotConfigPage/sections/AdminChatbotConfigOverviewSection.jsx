import { Link } from 'react-router-dom'
import { Alert, Button, Space } from 'antd'

export default function AdminChatbotConfigOverviewSection() {
  return (
    <Alert
      className="admin-chatbot-alert mb-4"
      type="info"
      showIcon
      message="Các phần cấu hình chuyên biệt đã được tách ra"
      description={(
        <Space wrap>
          <Link to="/admin/chatbot-runtime">
            <Button size="small" className="admin-chatbot-action-btn">Runtime & Provider</Button>
          </Link>

          <Link to="/admin/chatbot-rules">
            <Button size="small" className="admin-chatbot-action-btn">Agent Rules</Button>
          </Link>

          <Link to="/admin/chatbot-tools">
            <Button size="small" className="admin-chatbot-action-btn">Agent Tools</Button>
          </Link>

          <Link to="/admin/chatbot-tool-logs">
            <Button size="small" className="admin-chatbot-action-btn">Tool Call Logs</Button>
          </Link>
        </Space>
      )}
    />
  )
}
