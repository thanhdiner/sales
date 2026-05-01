import { Card, Col, Input, Row, Select, Space, Statistic } from 'antd'
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
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} xl={4}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title={t('stats.totalLogs')}
            value={toolLogsMeta.total || 0}
            prefix={<FileSearchOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={4}>
        <Card className="admin-chatbot-stat-card">
          <Statistic
            title={t('stats.errors')}
            value={toolLogsMeta.errorCount || 0}
            prefix={<FileSearchOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={16}>
        <Card className="admin-chatbot-card">
          <Space wrap className="w-full">
            <Select
              allowClear
              placeholder={t('filters.toolPlaceholder')}
              className="min-w-[220px]"
              options={toolOptions}
              value={toolNameFilter}
              onChange={onToolNameFilterChange}
            />

            <Input
              placeholder={t('filters.sessionPlaceholder')}
              className="min-w-[260px]"
              value={sessionIdFilter}
              onChange={event => onSessionIdFilterChange(event.target.value)}
            />
          </Space>
        </Card>
      </Col>
    </Row>
  )
}
