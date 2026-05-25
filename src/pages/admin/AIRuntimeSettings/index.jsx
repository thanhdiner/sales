import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Col, Form, InputNumber, Row, Select, Space, Spin, Switch, Tag, Typography, message } from 'antd'
import { ExperimentOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons'
import SEO from '@/components/shared/SEO'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import { getAIProviders } from '@/services/admin/chatbot/aiProviders'
import { getAIRuntimeSettings, testAIRuntimeSettings, updateAIRuntimeSettings } from '@/services/admin/chatbot/aiRuntimeSettings'
import './index.scss'

const { Text, Title } = Typography

const getProviderModelOptions = provider => {
  const models = Array.isArray(provider?.models) && provider.models.length
    ? provider.models.filter(model => model.enabled !== false)
    : (provider?.allowedModels || []).map(model => ({ model, displayName: model, enabled: true }))

  return models.map(model => ({
    label: model.displayName ? `${model.displayName} (${model.model})` : model.model,
    value: model.model
  }))
}

function StatusRow({ label, children }) {
  return (
    <div className="admin-ai-runtime-settings__status-row">
      <Text type="secondary" className="admin-ai-runtime-settings__status-label">{label}</Text>
      <div className="admin-ai-runtime-settings__status-value">{children}</div>
    </div>
  )
}

export default function AIRuntimeSettings() {
  const formRef = useRef(null)
  const [providers, setProviders] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [activeProviderCode, setActiveProviderCode] = useState()

  const activeProvider = useMemo(
    () => providers.find(item => item.code === activeProviderCode),
    [activeProviderCode, providers]
  )

  const providerOptions = useMemo(
    () => providers.map(item => ({ label: `${item.name} (${item.code})`, value: item.code, disabled: !item.enabled })),
    [providers]
  )

  const modelOptions = useMemo(
    () => getProviderModelOptions(activeProvider),
    [activeProvider]
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [providerRes, settingsRes] = await Promise.all([getAIProviders(), getAIRuntimeSettings()])
      const nextProviders = providerRes?.data || []
      const nextSettings = settingsRes?.data || {}
      setProviders(nextProviders)
      setSettings(nextSettings)
      setActiveProviderCode(nextSettings.activeProviderCode)
      formRef.current?.setFieldsValue({
        enabled: nextSettings.enabled,
        activeProviderCode: nextSettings.activeProviderCode,
        activeModel: nextSettings.activeModel,
        fallbackProviderCodes: nextSettings.fallbackProviderCodes || [],
        maxTokens: nextSettings.maxTokens,
        temperature: nextSettings.temperature,
        timeoutMs: nextSettings.timeoutMs,
        maxRetries: nextSettings.maxRetries
      })
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Không thể tải runtime settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0)
    return () => window.clearTimeout(timer)
  }, [loadData])

  useEffect(() => {
    if (!activeProvider) return

    const currentModel = formRef.current?.getFieldValue('activeModel')
    const enabledModels = getProviderModelOptions(activeProvider).map(option => option.value)
    if (!currentModel || (enabledModels.length && !enabledModels.includes(currentModel))) {
      formRef.current?.setFieldsValue({ activeModel: enabledModels.includes(activeProvider.defaultModel) ? activeProvider.defaultModel : enabledModels[0] })
    }
  }, [activeProvider])

  const saveSettings = async () => {
    const values = await formRef.current?.validateFields()
    setSaving(true)
    try {
      const res = await updateAIRuntimeSettings(values)
      setSettings(res?.data)
      message.success(res?.message || 'Saved runtime settings')
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Không thể lưu runtime settings')
    } finally {
      setSaving(false)
    }
  }

  const testRuntime = async () => {
    const values = await formRef.current?.validateFields()
    setTesting(true)
    try {
      const res = await testAIRuntimeSettings(values)
      message.success(res?.message || 'Runtime connection OK')
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Runtime test failed')
    } finally {
      setTesting(false)
    }
  }

  const status = settings?.status || {}

  return (
    <div className="admin-chatbot-page admin-ai-runtime-settings mx-auto max-w-7xl">
      <SEO title="AI Runtime Settings" noIndex />

      <div className="admin-chatbot-page-header admin-ai-runtime-settings__header flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="admin-ai-runtime-settings__header-icon">
            <SettingOutlined />
          </div>
          <div className="min-w-0">
            <Title level={4} className="admin-chatbot-page-title !mb-0">
              AI Runtime Settings
            </Title>
            <Text type="secondary" className="admin-chatbot-page-subtitle">
              Set the active provider, model, fallback chain, and execution limits.
            </Text>
          </div>
        </div>

        <Space wrap className="admin-ai-runtime-settings__actions">
          <Button
            icon={<ExperimentOutlined />}
            loading={testing}
            disabled={loading}
            onClick={testRuntime}
            className="admin-chatbot-action-btn"
          >
            Test runtime
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            disabled={loading}
            onClick={saveSettings}
            className="admin-chatbot-primary-btn"
          >
            Save
          </Button>
        </Space>
      </div>

      <div className="admin-ai-runtime-settings__content">
        <Spin spinning={loading}>
          <Row gutter={[24, 24]} align="top">
            <Col xs={24} lg={16}>
              <Form
                ref={formRef}
                layout="vertical"
                className="admin-ai-runtime-settings__form"
                onValuesChange={changedValues => {
                  if (Object.prototype.hasOwnProperty.call(changedValues, 'activeProviderCode')) {
                    setActiveProviderCode(changedValues.activeProviderCode)
                  }
                }}
              >
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="enabled" label="Enabled" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="activeProviderCode" label="Active provider" rules={[{ required: true }]}>
                      <Select options={providerOptions} showSearch optionFilterProp="label" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="activeModel"
                  label="Active model"
                  rules={[
                    { required: true },
                    () => ({
                      validator(_, value) {
                        const enabledModels = getProviderModelOptions(activeProvider).map(option => option.value)
                        if (!value || !enabledModels.length || enabledModels.includes(value)) return Promise.resolve()
                        return Promise.reject(new Error(`Model must be one of the enabled models: ${enabledModels.join(', ')}`))
                      }
                    })
                  ]}
                >
                  <Select options={modelOptions} placeholder="Select enabled model" showSearch optionFilterProp="label" />
                </Form.Item>

                <Form.Item name="fallbackProviderCodes" label="Fallback providers">
                  <Select mode="multiple" options={providerOptions.filter(item => item.value !== activeProviderCode && !item.disabled)} />
                </Form.Item>

                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="maxTokens" label="Max tokens" rules={[{ required: true }]}>
                      <InputNumber className="w-full" min={1} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="temperature" label="Temperature" rules={[{ required: true }]}>
                      <InputNumber className="w-full" min={0} max={2} step={0.1} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="timeoutMs" label="Timeout ms" rules={[{ required: true }]}>
                      <InputNumber className="w-full" min={1000} step={1000} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="maxRetries" label="Max retries" rules={[{ required: true }]}>
                      <InputNumber className="w-full" min={0} max={10} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col xs={24} lg={8}>
              <aside className="admin-ai-runtime-settings__status-panel">
                <Text strong className="admin-ai-runtime-settings__status-title">Runtime status</Text>

                <div className="admin-ai-runtime-settings__status-list">
                  <StatusRow label="Provider">
                    <Tag>{status.activeProvider || activeProviderCode || '-'}</Tag>
                  </StatusRow>
                  <StatusRow label="Model">
                    <Tag>{status.model || settings?.activeModel || '-'}</Tag>
                  </StatusRow>
                  <StatusRow label="Keys">
                    <Tag color={(status.keyCount || 0) > 0 ? 'green' : 'default'}>{status.keyCount || 0}</Tag>
                  </StatusRow>
                  <StatusRow label="Adapter">
                    <Tag>{status.adapter || activeProvider?.adapter || '-'}</Tag>
                  </StatusRow>
                  <StatusRow label="Health">
                    <Tag>{status.health || activeProvider?.health || '-'}</Tag>
                  </StatusRow>
                  <StatusRow label="Last error">
                    <Text
                      type={status.lastError && status.lastError !== '-' ? 'danger' : 'secondary'}
                      className="admin-ai-runtime-settings__status-error"
                    >
                      {status.lastError || '-'}
                    </Text>
                  </StatusRow>
                </div>
              </aside>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  )
}
