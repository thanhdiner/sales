import { Button, InputNumber, Result, Segmented, Space, Spin, Switch, Tag, Tooltip, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import AdminBackButton from '@/components/admin/ui/AdminBackButton'
import SEO from '@/components/shared/SEO'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import ProviderKeyModal from '@/pages/admin/AIProviderKeys/components/ProviderKeyModal'
import ProviderKeysList from '@/pages/admin/AIProviderKeys/components/ProviderKeysList'
import { AI_PROVIDER_HEALTH_COLORS } from '../constants/aiProviders.constants'
import AddProviderModelModal from './components/AddProviderModelModal'
import ProviderModelsSection from './components/ProviderModelsSection'
import { useAIProviderDetail } from './hooks/useAIProviderDetail'
import './index.scss'

const { Text, Title } = Typography

function getRouteCode(value) {
  try {
    return decodeURIComponent(value || '')
  } catch {
    return value || ''
  }
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

function ProviderDetailHeader({ provider, onBack }) {
  const health = provider.enabled === false ? 'disabled' : provider.health

  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <AdminBackButton className="mb-2" onClick={onBack} label="Back to providers" />

        <Title level={3} className="!mb-1 truncate">{provider.name}</Title>
        <Text type="secondary">{provider.code}</Text>

        <div className="mt-3 flex flex-wrap gap-2">
          <Tooltip title={<span className="whitespace-pre-line">{getHealthTooltip(provider, health)}</span>}>
            <Tag color={AI_PROVIDER_HEALTH_COLORS[health] || 'default'}>{health || 'unknown'}</Tag>
          </Tooltip>
          <Tag color={provider.providerKind === 'built-in' ? 'geekblue' : 'purple'}>{provider.providerKind || 'custom'}</Tag>
          <Tag>{provider.adapter || provider.type || '-'}</Tag>
          <Tag>{provider.availableKeysCount || 0} enabled keys</Tag>
          {provider.defaultModel && <Tag color="blue">default: {provider.defaultModel}</Tag>}
        </div>
      </div>

      <Space direction="vertical" size={2} className="md:items-end">
        <Text type="secondary">Base URL</Text>
        <Text code className="max-w-full break-all">{provider.baseUrl || '-'}</Text>
      </Space>
    </div>
  )
}

export default function AIProviderDetail() {
  const { code } = useParams()
  const navigate = useNavigate()
  const providerCode = getRouteCode(code)
  const {
    keyForm,
    modelForm,
    provider,
    providerOptions,
    visibleKeys,
    loading,
    loaded,
    environment,
    keyModalOpen,
    modelModalOpen,
    editingKey,
    testingId,
    testingModel,
    testingExistingModel,
    savingModel,
    setEnvironment,
    openCreateKeyModal,
    openEditKeyModal,
    closeKeyModal,
    handleSaveKey,
    toggleKey,
    testKey,
    deleteKey,
    moveKey,
    settings,
    updateSettingsField,
    openAddModelModal,
    closeModelModal,
    handleTestModel,
    handleTestExistingModel,
    handleAddModel,
    handleDeleteModel,
    refresh
  } = useAIProviderDetail(providerCode)

  if (!loaded && !provider) {
    return (
      <div className="admin-chatbot-page mx-auto max-w-7xl">
        <SEO title="AI Provider Detail" noIndex />
        <div className="flex min-h-[260px] items-center justify-center">
          <Spin />
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="admin-chatbot-page mx-auto max-w-7xl">
        <SEO title="AI Provider Not Found" noIndex />
        <Result
          status="404"
          title="Provider not found"
          subTitle={providerCode}
          extra={<Button type="primary" onClick={() => navigate('/admin/ai-providers')}>Back to providers</Button>}
        />
      </div>
    )
  }

  return (
    <div className="admin-chatbot-page admin-ai-provider-detail mx-auto max-w-7xl">
      <SEO title={`${provider.name} - AI Provider`} noIndex />

      <ProviderDetailHeader provider={provider} onBack={() => navigate('/admin/ai-providers')} />

      <ProviderKeysList
        title="API keys"
        visibleKeys={visibleKeys}
        testingId={testingId}
        loading={loading}
        onTestKey={testKey}
        onEditKey={openEditKeyModal}
        onDeleteKey={deleteKey}
        onToggleKey={toggleKey}
        onMoveKey={moveKey}
        extra={(
          <Space wrap size={12} className="admin-ai-provider-list-extra">
            <Space size={6} className="admin-ai-provider-list-extra__group">
              <Text className="admin-ai-provider-list-extra__label">Round Robin</Text>
              <Switch
                checked={settings.roundRobinEnabled}
                onChange={value => updateSettingsField({ roundRobinEnabled: value })}
              />
              <Text className="admin-ai-provider-list-extra__label">Sticky:</Text>
              <InputNumber
                size="small"
                min={1}
                max={1000}
                value={settings.stickyCount}
                onChange={value => updateSettingsField({ stickyCount: Number(value) || 1 })}
                style={{ width: 64 }}
              />
            </Space>
            <Segmented
              options={[
                { label: 'Production', value: 'production' },
                { label: 'Dev', value: 'dev' }
              ]}
              value={environment}
              onChange={setEnvironment}
            />
            <Button icon={<ReloadOutlined />} loading={loading} onClick={refresh} />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateKeyModal}>Add key</Button>
          </Space>
        )}
      />

      <ProviderModelsSection
        provider={provider}
        testingModel={testingExistingModel}
        onAddModel={openAddModelModal}
        onTestModel={handleTestExistingModel}
        onDeleteModel={handleDeleteModel}
      />

      <ProviderKeyModal
        form={keyForm}
        open={keyModalOpen}
        editingKey={editingKey}
        providerOptions={providerOptions}
        providerLocked
        onOk={handleSaveKey}
        onCancel={closeKeyModal}
      />

      <AddProviderModelModal
        form={modelForm}
        open={modelModalOpen}
        saving={savingModel}
        testing={testingModel}
        onOk={handleAddModel}
        onTest={handleTestModel}
        onCancel={closeModelModal}
      />
    </div>
  )
}
