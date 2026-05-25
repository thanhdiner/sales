import { Badge, Button, Card, Empty, Popconfirm, Spin, Switch, Tooltip, Typography } from 'antd'
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
  LockOutlined
} from '@ant-design/icons'
import { HEALTH_COLORS } from '../config/providerKeys.constants'
import './ProviderKeysList.scss'

const { Text } = Typography

const HEALTH_BADGE_STATUS = {
  enabled: 'success',
  disabled: 'default',
  error: 'error',
  'rate limited': 'warning',
  'quota exceeded': 'warning',
  testing: 'processing'
}

function ProviderKeyRow({
  record,
  index,
  total,
  testingId,
  onTestKey,
  onEditKey,
  onDeleteKey,
  onToggleKey,
  onMoveKey
}) {
  const health = record.health || (record.enabled ? 'enabled' : 'disabled')
  const status = HEALTH_BADGE_STATUS[health] || 'default'
  const tone = HEALTH_COLORS[health] || 'default'
  const testing = testingId === record.id

  return (
    <div className="admin-ai-provider-row">
      <div className="admin-ai-provider-row__reorder">
        <Tooltip title="Move up">
          <Button
            type="text"
            size="small"
            className="admin-ai-provider-row__arrow"
            icon={<CaretUpOutlined />}
            disabled={index === 0}
            onClick={() => onMoveKey?.(record, 'up')}
          />
        </Tooltip>

        <Tooltip title="Move down">
          <Button
            type="text"
            size="small"
            className="admin-ai-provider-row__arrow"
            icon={<CaretDownOutlined />}
            disabled={index === total - 1}
            onClick={() => onMoveKey?.(record, 'down')}
          />
        </Tooltip>
      </div>

      <div className="admin-ai-provider-row__icon">
        <LockOutlined />
      </div>

      <div className="admin-ai-provider-row__main">
        <Text strong className="admin-ai-provider-row__alias">{record.alias}</Text>
        <div className="admin-ai-provider-row__meta">
          <Badge status={status} text={<span className={`admin-ai-provider-row__health admin-ai-provider-row__health--${tone}`}>{health}</span>} />
          <Text type="secondary" className="admin-ai-provider-row__index">#{index + 1}</Text>
        </div>
      </div>

      <div className="admin-ai-provider-row__actions">
        <Tooltip title="Test key">
          <Button
            type="text"
            className="admin-ai-provider-row__action"
            icon={<ExperimentOutlined />}
            loading={testing}
            onClick={() => onTestKey?.(record)}
          >
            Test
          </Button>
        </Tooltip>

        <Tooltip title="Edit key">
          <Button
            type="text"
            className="admin-ai-provider-row__action"
            icon={<EditOutlined />}
            onClick={() => onEditKey?.(record)}
          >
            Edit
          </Button>
        </Tooltip>

        <Popconfirm
          title="Delete API key?"
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDeleteKey?.(record)}
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
          onChange={() => onToggleKey?.(record)}
        />
      </div>
    </div>
  )
}

export default function ProviderKeysList({
  visibleKeys = [],
  testingId,
  loading = false,
  title = 'API keys',
  extra,
  onTestKey,
  onEditKey,
  onDeleteKey,
  onToggleKey,
  onMoveKey
}) {
  const total = visibleKeys.length

  return (
    <Card
      className="admin-chatbot-card admin-ai-provider-list-card mb-5"
      title={title}
      extra={extra}
    >
      <Spin spinning={loading}>
        {total === 0 ? (
          <Empty description="No API keys yet" />
        ) : (
          <div className="admin-ai-provider-list">
            {visibleKeys.map((record, index) => (
              <ProviderKeyRow
                key={record.id || record._id}
                record={record}
                index={index}
                total={total}
                testingId={testingId}
                onTestKey={onTestKey}
                onEditKey={onEditKey}
                onDeleteKey={onDeleteKey}
                onToggleKey={onToggleKey}
                onMoveKey={onMoveKey}
              />
            ))}
          </div>
        )}
      </Spin>
    </Card>
  )
}
