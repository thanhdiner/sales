import { Link } from 'react-router-dom'
import { Alert, Button, Space } from 'antd'
import { useTranslation } from 'react-i18next'

export default function ChatbotConfigOverview() {
  const { t } = useTranslation('adminChatbotConfig')

  return (
    <Alert
      className="admin-chatbot-alert mb-4"
      type="info"
      showIcon
      message={t('overview.message')}
      description={(
        <Space wrap>
          <Link to="/admin/chatbot-runtime">
            <Button size="small" className="admin-chatbot-action-btn">{t('overview.runtime')}</Button>
          </Link>

          <Link to="/admin/chatbot-rules">
            <Button size="small" className="admin-chatbot-action-btn">{t('overview.rules')}</Button>
          </Link>

          <Link to="/admin/chatbot-tools">
            <Button size="small" className="admin-chatbot-action-btn">{t('overview.tools')}</Button>
          </Link>

          <Link to="/admin/chatbot-tool-logs">
            <Button size="small" className="admin-chatbot-action-btn">{t('overview.toolLogs')}</Button>
          </Link>
        </Space>
      )}
    />
  )
}
