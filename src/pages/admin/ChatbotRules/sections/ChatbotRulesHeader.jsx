import { Link } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  EyeOutlined,
  FileTextOutlined,
  ReloadOutlined,
  RobotOutlined,
  SaveOutlined,
  UndoOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function ChatbotRulesHeader({ saving, loading, onReload, onSave, onResetDefaults, onPreview }) {
  const { t } = useTranslation('adminChatbotRules')

  return (
    <div className="admin-chatbot-page-header admin-chatbot-rules-header">
      <div className="admin-chatbot-rules-header__title">
        <div className="admin-chatbot-rules-header__icon">
          <FileTextOutlined style={{ fontSize: 22, color: '#fff' }} />
        </div>

        <div className="admin-chatbot-rules-header__copy">
          <Title level={4} className="admin-chatbot-page-title !mb-0">
            {t('page.title')}
          </Title>

          <Text type="secondary" className="admin-chatbot-page-subtitle">
            {t('page.description')}
          </Text>
        </div>
      </div>

      <div className="admin-chatbot-rules-header__actions">
        <Space wrap className="admin-chatbot-rules-header__primary-actions">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={saving}
            className="admin-chatbot-primary-btn admin-chatbot-rules-header__save"
          >
            {t('page.save')}
          </Button>

          <Button icon={<EyeOutlined />} onClick={onPreview} loading={loading} className="admin-chatbot-action-btn">
            {t('page.preview')}
          </Button>
        </Space>

        <Space wrap className="admin-chatbot-rules-header__secondary-actions">
          <Link to="/admin/chatbot-config">
            <Button icon={<RobotOutlined />} className="admin-chatbot-action-btn">{t('page.openAgentSettings')}</Button>
          </Link>

          <Button icon={<ReloadOutlined />} onClick={onReload} className="admin-chatbot-action-btn">
            {t('page.reload')}
          </Button>

          <Button icon={<UndoOutlined />} onClick={onResetDefaults} className="admin-chatbot-action-btn">
            {t('page.resetDefaults')}
          </Button>
        </Space>
      </div>
    </div>
  )
}
