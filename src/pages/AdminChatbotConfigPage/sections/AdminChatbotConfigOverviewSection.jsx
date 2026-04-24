import { Link } from 'react-router-dom'
import { Alert, Button, Space } from 'antd'

export default function AdminChatbotConfigOverviewSection() {
  return (
    <Alert
      className="mb-4"
      type="info"
      showIcon
      message="Các phần cấu hình chuyên biệt đã được tách ra"
      description={(
        <Space wrap>
          <Link to="/admin/chatbot-runtime">
            <Button size="small">Runtime & Provider</Button>
          </Link>

          <Link to="/admin/chatbot-rules">
            <Button size="small">Agent Rules</Button>
          </Link>

          <Link to="/admin/chatbot-tools">
            <Button size="small">Agent Tools</Button>
          </Link>

          <Link to="/admin/chatbot-tool-logs">
            <Button size="small">Tool Call Logs</Button>
          </Link>
        </Space>
      )}
    />
  )
}
