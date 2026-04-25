import { Alert, Card, Space, Switch, Table, Tag, Typography } from 'antd'
import { ToolOutlined } from '@ant-design/icons'
import { RISK_COLORS } from '@/pages/AdminChatbotShared/utils'

const { Paragraph, Text } = Typography

const toolColumns = onToggleTool => [
  {
    title: 'Tool',
    dataIndex: 'label',
    key: 'label',
    render: (_, tool) => (
      <div>
        <div className="admin-chatbot-primary-text font-medium">{tool.label}</div>
        <Text type="secondary" className="text-xs">
          {tool.name}
        </Text>
      </div>
    )
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
    render: value => (
      <Paragraph className="!mb-0" ellipsis={{ rows: 2, expandable: false }}>
        {value}
      </Paragraph>
    )
  },
  {
    title: 'Nhóm',
    dataIndex: 'group',
    key: 'group',
    width: 120,
    render: value => <Tag>{value}</Tag>
  },
  {
    title: 'Quyền',
    key: 'riskLevel',
    width: 180,
    render: (_, tool) => (
      <Space direction="vertical" size={2}>
        <Tag color={RISK_COLORS[tool.riskLevel] || 'default'}>
          {tool.riskLevel || 'safe'}
        </Tag>

        <Text type="secondary" className="text-xs">
          {tool.requiresConfirmation ? 'Cần xác nhận user' : 'Không cần xác nhận'}
        </Text>
      </Space>
    )
  },
  {
    title: 'Bật',
    key: 'enabled',
    width: 100,
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
  return (
    <Card
      title={(
        <span className="flex items-center gap-2">
          <ToolOutlined /> Tools built-in
        </span>
      )}
      extra={<Tag color="processing">Hard-code trong backend</Tag>}
      className="admin-chatbot-card"
    >
      <Alert
        className="admin-chatbot-alert mb-4"
        type="info"
        showIcon
        message="Admin chỉ quản lý quyền bật/tắt của tool"
        description="Định nghĩa tool, schema và executor vẫn nằm ở backend. Trang này chỉ quyết định tool nào được phép đưa vào runtime của agent."
      />

      <Table
        className="admin-chatbot-table"
        rowKey="name"
        columns={toolColumns(onToggleTool)}
        dataSource={toolRegistry}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (count, range) => `${range[0]}-${range[1]} của ${count} tools`,
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        scroll={{ x: 960 }}
      />
    </Card>
  )
}
