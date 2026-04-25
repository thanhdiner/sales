import { Link } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import {
  ReloadOutlined,
  RobotOutlined,
  SaveOutlined,
  ToolOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminChatbotToolsHeaderSection({ saving, onReload, onSave }) {
  return (
    <div className="admin-chatbot-page-header mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600">
          <ToolOutlined style={{ fontSize: 22, color: '#fff' }} />
        </div>

        <div>
          <Title level={4} className="admin-chatbot-page-title !mb-0">
            Agent Tools
          </Title>

          <Text type="secondary" className="admin-chatbot-page-subtitle">
            Bật tắt tool built-in mà agent được phép gọi trong runtime.
          </Text>
        </div>
      </div>

      <Space wrap>
        <Link to="/admin/chatbot-config">
          <Button icon={<RobotOutlined />} className="admin-chatbot-action-btn">Agent Settings</Button>
        </Link>

        <Button icon={<ReloadOutlined />} onClick={onReload} className="admin-chatbot-action-btn">
          Tải lại
        </Button>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={saving}
          className="admin-chatbot-primary-btn"
        >
          Lưu tools
        </Button>
      </Space>
    </div>
  )
}
