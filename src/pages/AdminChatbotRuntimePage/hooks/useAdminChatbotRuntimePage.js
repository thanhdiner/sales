import { useCallback, useEffect, useState } from 'react'
import { Form, message } from 'antd'
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
      message.error(error?.message || 'Không thể tải cấu hình runtime AI')
    } finally {
      setLoading(false)
    }
  }, [form])

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
        message.success(response.message || 'Cập nhật runtime thành công')
        await loadConfig()
      } else {
        message.error(response?.message || 'Cập nhật runtime thất bại')
      }
    } catch (error) {
      message.error(error?.message || 'Có lỗi xảy ra khi cập nhật runtime')
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
        message.success('Kết nối thành công')
      } else {
        message.error(response?.message || 'Kết nối thất bại')
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message || 'Lỗi kết nối' })
      message.error(error?.message || 'Lỗi kết nối')
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
