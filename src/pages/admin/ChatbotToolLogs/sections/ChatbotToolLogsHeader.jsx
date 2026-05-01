import { Link } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  FileSearchOutlined,
  MessageOutlined,
  ReloadOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function ChatbotToolLogsHeader({ logsLoading, onReload }) {
  const { t } = useTranslation('adminChatbotToolLogs')

  return (
    <div className="admin-chatbot-page-header mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600">
          <FileSearchOutlined style={{ fontSize: 22, color: '#fff' }} />
        </div>

        <div>
          <Title level={4} className="admin-chatbot-page-title !mb-0">
            {t('page.title')}
          </Title>

          <Text type="secondary" className="admin-chatbot-page-subtitle">
            {t('page.description')}
          </Text>
        </div>
      </div>

      <Space wrap>
        <Link to="/admin/chat">
          <Button icon={<MessageOutlined />} className="admin-chatbot-action-btn">
            {t('page.liveChat')}
          </Button>
        </Link>

        <Button
          icon={<ReloadOutlined />}
          loading={logsLoading}
          onClick={onReload}
          className="admin-chatbot-action-btn"
        >
          {t('page.reload')}
        </Button>
      </Space>
    </div>
  )
}
