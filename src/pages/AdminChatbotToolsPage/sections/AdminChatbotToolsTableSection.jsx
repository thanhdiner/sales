import { Alert, Card, Grid, Space, Switch, Table, Tag, Typography } from 'antd'
import { ToolOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { RISK_COLORS } from '@/pages/AdminChatbotShared/utils'

const { Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const getRiskLabel = (riskLevel, t) => (
  riskLevel ? t(`risk.${riskLevel}`, { defaultValue: riskLevel }) : t('risk.safe')
)

const getGroupLabel = (group, t) => (
  group ? t(`groups.${group}`, { defaultValue: group }) : '--'
)

const getToolText = (tool, field, t) => (
  t(`tools.${tool.name}.${field}`, { defaultValue: tool[field] || '--' })
)

const toolColumns = (onToggleTool, t) => [
  {
    title: t('table.columns.tool'),
    dataIndex: 'label',
    key: 'label',
    className: 'admin-chatbot-tools-table__tool-col',
    render: (_, tool) => {
      const label = getToolText(tool, 'label', t)
      const description = getToolText(tool, 'description', t)
      const group = getGroupLabel(tool.group, t)

      return (
        <div className="admin-chatbot-tools-table__tool-cell">
          <div className="admin-chatbot-primary-text font-medium">{label}</div>
          <Text type="secondary" className="admin-chatbot-tools-table__tool-name text-xs">
            {tool.name}
          </Text>

          <Paragraph className="admin-chatbot-tools-table__mobile-description !mb-0 mt-2" ellipsis={{ rows: 2, expandable: false }}>
            {description}
          </Paragraph>

          <div className="admin-chatbot-tools-table__mobile-meta">
            <Tag>{group}</Tag>
            <Tag color={RISK_COLORS[tool.riskLevel] || 'default'}>
              {getRiskLabel(tool.riskLevel, t)}
            </Tag>
            {tool.requiresConfirmation ? (
              <Tag color="warning">{t('confirmation.requiredShort')}</Tag>
            ) : (
              <Tag>{t('confirmation.noneShort')}</Tag>
            )}
          </div>
        </div>
      )
    }
  },
  {
    title: t('table.columns.description'),
    dataIndex: 'description',
    key: 'description',
    responsive: ['lg'],
    render: (_, tool) => (
      <Paragraph className="!mb-0" ellipsis={{ rows: 2, expandable: false }}>
        {getToolText(tool, 'description', t)}
      </Paragraph>
    )
  },
  {
    title: t('table.columns.group'),
    dataIndex: 'group',
    key: 'group',
    width: 120,
    responsive: ['md'],
    render: value => <Tag>{getGroupLabel(value, t)}</Tag>
  },
  {
    title: t('table.columns.permission'),
    key: 'riskLevel',
    width: 180,
    responsive: ['sm'],
    render: (_, tool) => (
      <Space direction="vertical" size={2}>
        <Tag color={RISK_COLORS[tool.riskLevel] || 'default'}>
          {getRiskLabel(tool.riskLevel, t)}
        </Tag>

        <Text type="secondary" className="text-xs">
          {tool.requiresConfirmation ? t('confirmation.requiredUser') : t('confirmation.none')}
        </Text>
      </Space>
    )
  },
  {
    title: t('table.columns.enabled'),
    key: 'enabled',
    width: 86,
    align: 'center',
    className: 'admin-chatbot-tools-table__toggle-col',
    render: (_, tool) => (
      <Switch
        checked={tool.enabled !== false}
        onChange={checked => onToggleTool(tool.name, checked)}
      />
    )
  }
]

export default function AdminChatbotToolsTableSection({
  toolRegistry,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onToggleTool
}) {
  const { t } = useTranslation('adminChatbotTools')
  const screens = useBreakpoint()
  const showQuickJumper = Boolean(screens.md)
  const showTableScroll = Boolean(screens.lg)

  return (
    <Card
      title={(
        <span className="flex items-center gap-2">
          <ToolOutlined /> {t('table.title')}
        </span>
      )}
      extra={<Tag color="processing">{t('table.backendBadge')}</Tag>}
      className="admin-chatbot-card admin-chatbot-tools-card"
    >
      <Alert
        className="admin-chatbot-alert mb-4"
        type="info"
        showIcon
        message={t('table.alertMessage')}
        description={t('table.alertDescription')}
      />

      <Table
        className="admin-chatbot-table admin-chatbot-tools-table"
        rowKey="name"
        columns={toolColumns(onToggleTool, t)}
        dataSource={toolRegistry}
        tableLayout="fixed"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper,
          responsive: true,
          showTotal: (count, range) => t('pagination.showTotal', {
            rangeStart: range[0],
            rangeEnd: range[1],
            total: count
          }),
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        scroll={showTableScroll ? { x: 860 } : undefined}
      />
    </Card>
  )
}
