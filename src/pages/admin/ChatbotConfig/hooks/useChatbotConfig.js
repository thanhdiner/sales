import { useEffect, useMemo, useState } from 'react'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import useChatbotConfigData from '@/pages/admin/ChatbotShared/hooks/useChatbotConfigData'
import { getAIProviders } from '@/services/admin/chatbot/aiProviders'

const getProviderModelOptions = provider => {
  const models = Array.isArray(provider?.models) && provider.models.length
    ? provider.models.filter(model => model.enabled !== false)
    : (provider?.allowedModels || []).map(model => ({ model, displayName: model, enabled: true, supportsTools: true }))

  return models.map(model => ({
    label: model.displayName ? `${model.displayName} (${model.model})` : model.model,
    value: model.model,
    model
  }))
}

export default function useChatbotConfig() {
  const { t } = useTranslation('adminChatbotConfig')
  const [form] = Form.useForm()
  const {
    config,
    loading,
    saving,
    toolRegistry,
    loadConfig,
    saveConfig
  } = useChatbotConfigData()
  const [providers, setProviders] = useState([])
  const [providersLoading, setProvidersLoading] = useState(false)

  const agentEnabled = Form.useWatch('isEnabled', form)
  const providerKey = Form.useWatch('providerKey', form)
  const model = Form.useWatch('model', form)
  const fallbackProvider = Form.useWatch('fallbackProvider', form)

  const enabledTools = toolRegistry.filter(tool => tool.enabled !== false).length

  useEffect(() => {
    let mounted = true

    async function loadProviders() {
      setProvidersLoading(true)
      try {
        const res = await getAIProviders()
        if (mounted) setProviders(res?.data || [])
      } catch (err) {
        message.error(err?.response?.message || err.message || 'Cannot load AI providers')
      } finally {
        if (mounted) setProvidersLoading(false)
      }
    }

    loadProviders()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!config) return

    form.setFieldsValue({
      agentName: config.agentName || t('defaults.agentName'),
      agentRole: config.agentRole || '',
      agentTone: config.agentTone || '',
      isEnabled: config.isEnabled,
      providerKey: config.providerKey || config.aiProvider || config.runtimeProvider,
      model: config.model || config.runtimeModel,
      fallbackProvider: config.fallbackProvider || '',
      fallbackModel: config.fallbackModel || ''
    })
  }, [config, form, t])

  const providerOptions = useMemo(() => providers.map(provider => ({
    label: `${provider.name} (${provider.code})`,
    value: provider.code,
    disabled: !provider.enabled
  })), [providers])

  const selectedProvider = useMemo(
    () => providers.find(provider => provider.code === providerKey),
    [providerKey, providers]
  )

  const fallbackProviderRecord = useMemo(
    () => providers.find(provider => provider.code === fallbackProvider),
    [fallbackProvider, providers]
  )

  const modelOptions = useMemo(() => getProviderModelOptions(selectedProvider), [selectedProvider])
  const fallbackModelOptions = useMemo(() => getProviderModelOptions(fallbackProviderRecord), [fallbackProviderRecord])

  useEffect(() => {
    if (!selectedProvider || !modelOptions.length) return
    const currentModel = form.getFieldValue('model')
    const enabledModelValues = modelOptions.map(option => option.value)

    if (!currentModel || !enabledModelValues.includes(currentModel)) {
      form.setFieldsValue({
        model: enabledModelValues.includes(selectedProvider.defaultModel) ? selectedProvider.defaultModel : enabledModelValues[0]
      })
    }
  }, [form, modelOptions, selectedProvider])

  useEffect(() => {
    if (!fallbackProviderRecord) {
      form.setFieldsValue({ fallbackModel: '' })
      return
    }

    const currentModel = form.getFieldValue('fallbackModel')
    const enabledModelValues = fallbackModelOptions.map(option => option.value)
    if (!currentModel || !enabledModelValues.includes(currentModel)) {
      form.setFieldsValue({
        fallbackModel: enabledModelValues.includes(fallbackProviderRecord.defaultModel)
          ? fallbackProviderRecord.defaultModel
          : enabledModelValues[0]
      })
    }
  }, [fallbackModelOptions, fallbackProviderRecord, form])

  const selectedModelMeta = modelOptions.find(option => option.value === model)?.model
  const toolsModelWarning = enabledTools > 0 && selectedModelMeta?.supportsTools === false

  const handleSave = async () => {
    const values = form.getFieldsValue(true)
    await saveConfig({
      ...values,
      aiProvider: values.providerKey,
      fallbackProvider: values.fallbackProvider || '',
      fallbackModel: values.fallbackProvider ? values.fallbackModel : ''
    }, t('messages.updateProfileSuccess'))
  }

  return {
    form,
    loading: loading || providersLoading,
    saving,
    agentEnabled,
    runtimeProvider: config?.providerKey || config?.aiProvider || config?.runtimeProvider || '--',
    runtimeModel: config?.model || config?.runtimeModel || '',
    enabledTools,
    totalTools: toolRegistry.length || 0,
    providerOptions,
    modelOptions,
    fallbackProviderOptions: providerOptions.filter(option => option.value !== providerKey && !option.disabled),
    fallbackModelOptions,
    toolsModelWarning,
    handleReload: loadConfig,
    handleSave
  }
}
