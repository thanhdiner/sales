import { Button, Space, Typography } from 'antd'
import {
  ReloadOutlined,
  RobotOutlined,
  SaveOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminChatbotConfigHeaderSection({ saving, onReload, onSave }) {
  return (
    <div className="admin-chatbot-page-header mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
          <RobotOutlined style={{ fontSize: 22, color: '#fff' }} />
        </div>

        <div>
          <Title level={4} className="admin-chatbot-page-title !mb-0">
            Agent Settings
          </Title>

          <Text type="secondary" className="admin-chatbot-page-subtitle">
            Quản lý hồ sơ và trạng thái hoạt động của agent chính.
          </Text>
        </div>
      </div>

      <Space wrap>
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
          Lưu cấu hình
        </Button>
      </Space>
    </div>
  )
}
