import { Card, Input, Select, Statistic } from 'antd'
import { FileSearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function ChatbotToolLogsFilters({
  toolOptions,
  toolLogsMeta,
  toolNameFilter,
  sessionIdFilter,
  onToolNameFilterChange,
  onSessionIdFilterChange
}) {
  const { t } = useTranslation('adminChatbotToolLogs')

  return (
    <Card className="admin-chatbot-card admin-chatbot-tool-logs-overview-card mb-4">
      <div className="admin-chatbot-tool-logs-overview">
        <div className="admin-chatbot-tool-logs-overview__stats">
          <Statistic
            title={t('stats.totalLogs')}
            value={toolLogsMeta.total || 0}
            prefix={<FileSearchOutlined />}
          />
          <Statistic
            title={t('stats.errors')}
            value={toolLogsMeta.errorCount || 0}
            prefix={<FileSearchOutlined />}
          />
        </div>

        <div className="admin-chatbot-tool-logs-overview__filters">
          <Select
            allowClear
            placeholder={t('filters.toolPlaceholder')}
            className="admin-chatbot-tool-logs-overview__tool-select"
            options={toolOptions}
            value={toolNameFilter}
            onChange={onToolNameFilterChange}
          />

          <Input
            placeholder={t('filters.sessionPlaceholder')}
            className="admin-chatbot-tool-logs-overview__session-input"
            value={sessionIdFilter}
            onChange={event => onSessionIdFilterChange(event.target.value)}
          />
        </div>
      </div>
    </Card>
  )
}
