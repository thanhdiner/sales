import { Badge, Button, Card, Empty, Popconfirm, Spin, Switch, Tag, Tooltip, Typography } from 'antd'
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined,
  RobotOutlined,
  StarFilled,
  StarOutlined
} from '@ant-design/icons'

const { Text } = Typography

function AgentRow({
  record,
  index,
  total,
  onEdit,
  onDelete,
  onToggle,
  onMove,
  onSetDefault
}) {
  const status = record.enabled ? 'success' : 'default'

  return (
    <div className="admin-ai-provider-row admin-ai-agent-row">
      <div className="admin-ai-provider-row__reorder">
        <Tooltip title="Move up">
          <Button
            type="text"
            size="small"
            className="admin-ai-provider-row__arrow"
            icon={<CaretUpOutlined />}
            disabled={index === 0}
            onClick={() => onMove?.(record, 'up')}
          />
        </Tooltip>

        <Tooltip title="Move down">
          <Button
            type="text"
            size="small"
            className="admin-ai-provider-row__arrow"
            icon={<CaretDownOutlined />}
            disabled={index === total - 1}
            onClick={() => onMove?.(record, 'down')}
          />
        </Tooltip>
      </div>

      <div
        className="admin-ai-provider-row__icon admin-ai-agent-row__avatar"
        style={{ backgroundColor: record.color ? `${record.color}1f` : undefined }}
      >
        {record.avatar
          ? <img src={record.avatar} alt={record.name} className="h-full w-full rounded-md object-cover" />
          : <RobotOutlined style={{ color: record.color || undefined }} />}
      </div>

      <div className="admin-ai-provider-row__main">
        <div className="admin-ai-agent-row__title">
          <Text strong className="admin-ai-provider-row__alias">{record.name}</Text>
          {record.isDefault && <Tag color="gold" icon={<StarFilled />}>default</Tag>}
        </div>

        <div className="admin-ai-provider-row__meta">
          <Badge status={status} text={<span className="admin-ai-provider-row__health">{record.enabled ? 'enabled' : 'disabled'}</span>} />
          <Text type="secondary" className="admin-ai-provider-row__index">#{index + 1}</Text>
          <Text type="secondary" className="admin-ai-agent-row__pill">{record.code}</Text>
          <Text type="secondary" className="admin-ai-agent-row__pill">{record.providerCode}/{record.model}</Text>
          <Text type="secondary" className="admin-ai-agent-row__pill">
            {Array.isArray(record.toolIds) && record.toolIds.length > 0
              ? `${record.toolIds.length} tools`
              : 'global tools'}
          </Text>
        </div>
      </div>

      <div className="admin-ai-provider-row__actions">
        <Tooltip title={record.isDefault ? 'Default agent' : 'Set as default'}>
          <Button
            type="text"
            className="admin-ai-provider-row__action"
            icon={record.isDefault ? <StarFilled /> : <StarOutlined />}
            disabled={record.isDefault}
            onClick={() => onSetDefault?.(record)}
          >
            Default
          </Button>
        </Tooltip>

        <Tooltip title="Edit agent">
          <Button
            type="text"
            className="admin-ai-provider-row__action"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            Edit
          </Button>
        </Tooltip>

        <Popconfirm
          title="Delete agent?"
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete?.(record)}
        >
          <Button
            type="text"
            danger
            className="admin-ai-provider-row__action admin-ai-provider-row__action--danger"
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>

        <Switch
          className="admin-ai-provider-row__switch"
          checked={record.enabled}
          onChange={() => onToggle?.(record)}
        />
      </div>
    </div>
  )
}

export default function AIAgentList({
  agents = [],
  loading = false,
  title = 'AI agents',
  extra,
  onEdit,
  onDelete,
  onToggle,
  onMove,
  onSetDefault
}) {
  const total = agents.length

  return (
    <Card
      className="admin-chatbot-card admin-ai-provider-list-card mb-5"
      title={title}
      extra={extra}
    >
      <Spin spinning={loading}>
        {total === 0 ? (
          <Empty description="No agents yet" />
        ) : (
          <div className="admin-ai-provider-list">
            {agents.map((record, index) => (
              <AgentRow
                key={record.id || record._id}
                record={record}
                index={index}
                total={total}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
                onMove={onMove}
                onSetDefault={onSetDefault}
              />
            ))}
          </div>
        )}
      </Spin>
    </Card>
  )
}
