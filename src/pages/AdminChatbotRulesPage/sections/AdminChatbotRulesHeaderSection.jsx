import { Link } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import {
  FileTextOutlined,
  ReloadOutlined,
  RobotOutlined,
  SaveOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminChatbotRulesHeaderSection({ saving, onReload, onSave }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
          <FileTextOutlined style={{ fontSize: 22, color: '#fff' }} />
        </div>

        <div>
          <Title level={4} className="!mb-0 dark:text-white">
            Agent Rules
          </Title>

          <Text type="secondary" className="dark:text-gray-400">
            Quản lý prompt, quy tắc hệ thống, fallback và từ khóa auto-escalate.
          </Text>
        </div>
      </div>

      <Space wrap>
        <Link to="/admin/chatbot-config">
          <Button icon={<RobotOutlined />}>Agent Settings</Button>
        </Link>

        <Button icon={<ReloadOutlined />} onClick={onReload}>
          Tải lại
        </Button>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={saving}
          className="bg-blue-600"
        >
          Lưu rules
        </Button>
      </Space>
    </div>
  )
}
