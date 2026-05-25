import { Button, Card, Empty, Spin, Tag, Tooltip, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AI_PROVIDER_HEALTH_COLORS } from '../constants/aiProviders.constants'
import './AIProviderList.scss'

const { Text } = Typography

const providerButtonBaseClass = 'admin-ai-provider-button'
const providerButtonActiveClass = 'admin-ai-provider-button--active'

function getModelCount(provider = {}) {
  const total = provider.models?.length || provider.allowedModels?.length || 0
  const enabled = provider.enabledModels?.length || provider.models?.filter(model => model.enabled !== false).length || total
  return { enabled, total }
}

function getHealthTooltip(provider = {}, health = '') {
  const details = []

  if (provider.lastError && provider.lastError !== '-') {
    details.push(provider.lastError)
  }

  if (provider.lastTested && provider.lastTested !== '-') {
    details.push(`Last tested: ${provider.lastTested}`)
  }

  if (details.length === 0) {
    return health === 'failed' ? 'Last provider test failed' : `Provider health: ${health || 'unknown'}`
  }

  return details.join('\n')
}

function AIProviderButton({ provider, activeProviderCode }) {
  const navigate = useNavigate()
  const isActive = provider.code === activeProviderCode
  const health = provider.enabled === false ? 'disabled' : provider.health
  const modelCount = getModelCount(provider)

  return (
    <Button
      block
      type="default"
      className={`${providerButtonBaseClass} ${isActive ? providerButtonActiveClass : ''}`}
      onClick={() => navigate(`/admin/ai-providers/${encodeURIComponent(provider.code)}`)}
    >
      <div className="flex w-full min-w-0 flex-col gap-2">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-medium">{provider.name}</div>
            <div className="admin-ai-provider-button__code">{provider.code}</div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isActive && <Tag color="cyan">Active</Tag>}
            <Tooltip title={<span className="whitespace-pre-line">{getHealthTooltip(provider, health)}</span>}>
              <Tag color={AI_PROVIDER_HEALTH_COLORS[health] || 'default'}>{health || 'unknown'}</Tag>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tag color={provider.providerKind === 'built-in' ? 'geekblue' : 'purple'}>{provider.providerKind || 'custom'}</Tag>
          <Tag>{provider.adapter || provider.type || '-'}</Tag>
          <Tag>{modelCount.enabled}/{modelCount.total} models</Tag>
          {provider.defaultModel && (
            <Text className="admin-ai-provider-button__model" ellipsis>
              {provider.defaultModel}
            </Text>
          )}
        </div>
      </div>
    </Button>
  )
}

export default function AIProviderList({ providers, activeProviderCode, loading }) {
  return (
    <Card title="Provider list">
      <Spin spinning={loading}>
        {providers.length === 0 ? (
          <Empty description="No providers found" />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {providers.map(provider => (
              <AIProviderButton
                key={provider.id || provider._id || provider.code}
                provider={provider}
                activeProviderCode={activeProviderCode}
              />
            ))}
          </div>
        )}
      </Spin>
    </Card>
  )
}
