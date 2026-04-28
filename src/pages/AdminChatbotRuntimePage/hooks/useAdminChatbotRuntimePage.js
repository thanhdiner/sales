import { useCallback, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  getChatbotConfig,
  testChatbotConnection,
  updateChatbotConfig
} from '@/services/adminChatbotConfigService'
import {
  CHATBOT_RUNTIME_PROVIDER_OPTIONS,
  DEFAULT_CHATBOT_RUNTIME_MODEL,
  DEFAULT_CHATBOT_RUNTIME_PROVIDER,
  getChatbotRuntimeProvider
} from '../utils'

export default function useAdminChatbotRuntimePage() {
  const { t } = useTranslation('adminChatbotRuntime')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [config, setConfig] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState(DEFAULT_CHATBOT_RUNTIME_PROVIDER)

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getChatbotConfig()

      if (response?.success && response.data) {
        const savedProvider = response.data.aiProvider || DEFAULT_CHATBOT_RUNTIME_PROVIDER
        const providerConfig = getChatbotRuntimeProvider(savedProvider)
        const savedModel =
          response.data.model ||
          providerConfig?.models?.[0] ||
          DEFAULT_CHATBOT_RUNTIME_MODEL

        setConfig(response.data)
        setSelectedProvider(savedProvider)
        form.setFieldsValue({
          aiProvider: savedProvider,
          model: savedModel,
          maxTokens: response.data.maxTokens || 1000,
          temperature: response.data.temperature ?? 0.7,
          maxMessagesPerMinute: response.data.maxMessagesPerMinute || 10,
          maxMessagesPerSession: response.data.maxMessagesPerSession || 100
        })
      }
    } catch (error) {
      message.error(error?.message || t('messages.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [form, t])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const handleProviderChange = value => {
    setSelectedProvider(value)
    const provider = getChatbotRuntimeProvider(value)

    if (provider) {
      form.setFieldsValue({ model: provider.models[0] })
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const values = form.getFieldsValue(true)
      const response = await updateChatbotConfig(values)

      if (response?.success) {
        message.success(response.message || t('messages.updateSuccess'))
        await loadConfig()
      } else {
        message.error(response?.message || t('messages.updateFailed'))
      }
    } catch (error) {
      message.error(error?.message || t('messages.updateError'))
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    try {
      setTesting(true)
      setTestResult(null)

      const values = form.getFieldsValue(['aiProvider', 'model'])
      const response = await testChatbotConnection(values)

      setTestResult(response)

      if (response?.success) {
        message.success(t('messages.testSuccess'))
      } else {
        message.error(response?.message || t('messages.testFailed'))
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message || t('messages.connectionError') })
      message.error(error?.message || t('messages.connectionError'))
    } finally {
      setTesting(false)
    }
  }

  const currentModels = getChatbotRuntimeProvider(selectedProvider)?.models || []

  return {
    form,
    loading,
    saving,
    testing,
    config,
    testResult,
    selectedProvider,
    currentModels,
    providerOptions: CHATBOT_RUNTIME_PROVIDER_OPTIONS,
    handleReload: loadConfig,
    handleSave,
    handleTest,
    handleProviderChange
  }
}
