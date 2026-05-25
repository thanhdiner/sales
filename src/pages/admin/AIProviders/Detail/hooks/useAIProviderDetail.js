import { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, message } from 'antd'
import {
  createAIProviderKey,
  deleteAIProviderKey,
  getAIProviderKeys,
  getAIProviderKeySettings,
  reorderAIProviderKey,
  testAIProviderKey,
  toggleAIProviderKey,
  updateAIProviderKey,
  updateAIProviderKeySettings
} from '@/services/admin/chatbot/aiProviderKeys'
import { getAIProviders, testAIProvider, updateAIProvider } from '@/services/admin/chatbot/aiProviders'

const normalizeKey = item => ({
  ...item,
  id: item.id || item._id,
  provider: item.provider || item.providerCode,
  env: item.env || 'production',
  maskedKey: item.maskedKey || '****',
  requestsToday: item.requestsToday || 0,
  tokensToday: item.tokensToday || 0,
  requestLimit: item.requestLimit || 0,
  tokenLimit: item.tokenLimit || 0,
  lastUsed: item.lastUsed || '-',
  lastError: item.lastError || '-'
})

const normalizeModel = value => ({
  model: String(value.model || '').trim(),
  displayName: String(value.displayName || value.model || '').trim(),
  enabled: value.enabled !== false,
  supportsTools: value.supportsTools !== false,
  supportsVision: value.supportsVision === true,
  supportsJsonMode: value.supportsJsonMode !== false,
  supportsStreaming: value.supportsStreaming !== false,
  contextWindow: Number(value.contextWindow) || 0,
  maxOutputTokens: Number(value.maxOutputTokens) || 0,
  costLevel: value.costLevel || 'medium',
  speedLevel: value.speedLevel || 'medium'
})

export function getProviderModels(provider = {}) {
  if (Array.isArray(provider.models) && provider.models.length) return provider.models.map(normalizeModel)

  const values = Array.isArray(provider.allowedModels) && provider.allowedModels.length
    ? provider.allowedModels
    : (provider.defaultModel ? [provider.defaultModel] : [])

  return values.map(model => normalizeModel({ model, displayName: model, enabled: true }))
}

export function useAIProviderDetail(providerCode) {
  const [keyForm] = Form.useForm()
  const [modelForm] = Form.useForm()

  const [providers, setProviders] = useState([])
  const [keys, setKeys] = useState([])
  const [settings, setSettings] = useState({ roundRobinEnabled: false, stickyCount: 1 })
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [environment, setEnvironment] = useState('production')
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [modelModalOpen, setModelModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [testingId, setTestingId] = useState(null)
  const [testingModel, setTestingModel] = useState(false)
  const [testingExistingModel, setTestingExistingModel] = useState(null)
  const [savingModel, setSavingModel] = useState(false)

  const normalizedProviderCode = String(providerCode || '').trim().toLowerCase()

  const provider = useMemo(
    () => providers.find(item => item.code === normalizedProviderCode),
    [normalizedProviderCode, providers]
  )

  const providerOptions = useMemo(() => (
    provider
      ? [{ label: `${provider.name} (${provider.code})`, value: provider.code, disabled: !provider.enabled }]
      : []
  ), [provider])

  const visibleKeys = useMemo(
    () => keys.filter(item => item.env === environment),
    [environment, keys]
  )

  const loadData = useCallback(async () => {
    setLoaded(false)
    setLoading(true)

    try {
      const [providersRes, keysRes, settingsRes] = await Promise.all([
        getAIProviders(),
        getAIProviderKeys({ providerCode: normalizedProviderCode }),
        getAIProviderKeySettings()
      ])

      setProviders(providersRes?.data || [])
      setKeys((keysRes?.data || []).map(normalizeKey))
      if (settingsRes?.data) {
        setSettings({
          roundRobinEnabled: Boolean(settingsRes.data.roundRobinEnabled),
          stickyCount: Number(settingsRes.data.stickyCount) || 1
        })
      }
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot load provider detail')
    } finally {
      setLoaded(true)
      setLoading(false)
    }
  }, [normalizedProviderCode])

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0)
    return () => window.clearTimeout(timer)
  }, [loadData])

  const openCreateKeyModal = () => {
    setEditingKey(null)
    keyForm.resetFields()
    keyForm.setFieldsValue({
      provider: normalizedProviderCode,
      env: environment,
      enabled: true
    })
    setKeyModalOpen(true)
  }

  const openEditKeyModal = record => {
    setEditingKey(record)
    keyForm.resetFields()
    keyForm.setFieldsValue({
      provider: normalizedProviderCode,
      env: record.env || environment,
      alias: record.alias,
      apiKey: '',
      enabled: record.enabled
    })
    setKeyModalOpen(true)
  }

  const closeKeyModal = () => {
    setKeyModalOpen(false)
  }

  const handleSaveKey = async () => {
    const values = await keyForm.validateFields()
    const payload = {
      ...values,
      provider: normalizedProviderCode,
      providerCode: normalizedProviderCode
    }

    if (!payload.apiKey) delete payload.apiKey

    setLoading(true)

    try {
      await (editingKey
        ? updateAIProviderKey(editingKey._id || editingKey.id, payload)
        : createAIProviderKey(payload))

      message.success(editingKey ? 'Updated API key' : 'Added API key')
      setKeyModalOpen(false)
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot save API key')
    } finally {
      setLoading(false)
    }
  }

  const toggleKey = async record => {
    setLoading(true)

    try {
      await toggleAIProviderKey(record._id || record.id)
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot update key status')
    } finally {
      setLoading(false)
    }
  }

  const deleteKey = async record => {
    setLoading(true)

    try {
      await deleteAIProviderKey(record._id || record.id)
      setKeys(current => current.filter(item => item.id !== record.id))
      message.success('Deleted API key')
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot delete API key')
    } finally {
      setLoading(false)
    }
  }

  const testKey = async record => {
    setTestingId(record.id)

    try {
      const res = await testAIProviderKey(record._id || record.id)
      message.success(res?.message || 'Key test success')
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Key test failed')
      await loadData()
    } finally {
      setTestingId(null)
    }
  }

  const moveKey = async (record, direction) => {
    setLoading(true)

    try {
      await reorderAIProviderKey(record._id || record.id, direction)
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot reorder key')
    } finally {
      setLoading(false)
    }
  }

  const updateSettingsField = async patch => {
    const next = { ...settings, ...patch }
    setSettings(next)

    try {
      await updateAIProviderKeySettings({
        roundRobinEnabled: next.roundRobinEnabled,
        stickyCount: next.stickyCount
      })
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot update settings')
    }
  }

  const openAddModelModal = () => {
    modelForm.resetFields()
    modelForm.setFieldsValue({
      model: ''
    })
    setModelModalOpen(true)
  }

  const closeModelModal = () => {
    setModelModalOpen(false)
  }

  const handleTestModel = async () => {
    if (!provider) return

    const values = await modelForm.validateFields(['model'])
    const model = String(values.model || '').trim()
    setTestingModel(true)

    try {
      const res = await testAIProvider(provider.id || provider._id, { model })
      message.success(res?.message || 'Model test success')
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Model test failed')
    } finally {
      setTestingModel(false)
    }
  }

  const handleTestExistingModel = async model => {
    if (!provider) return

    const modelValue = String(model || '').trim()
    if (!modelValue) return

    setTestingExistingModel(modelValue)

    try {
      const res = await testAIProvider(provider.id || provider._id, { model: modelValue })
      message.success(res?.message || 'Model test success')
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Model test failed')
    } finally {
      setTestingExistingModel(null)
    }
  }

  const handleAddModel = async () => {
    if (!provider) return

    const values = await modelForm.validateFields()
    const newModel = normalizeModel(values)
    const currentModels = getProviderModels(provider)

    if (currentModels.some(item => item.model === newModel.model)) {
      message.error('Model already exists in this provider')
      return
    }

    const nextModels = [...currentModels, newModel]
    setSavingModel(true)

    try {
      const res = await updateAIProvider(provider.id || provider._id, {
        models: nextModels,
        allowedModels: nextModels.map(item => item.model),
        defaultModel: provider.defaultModel || newModel.model
      })

      if (res?.data) {
        setProviders(current => current.map(item => (item.code === provider.code ? res.data : item)))
      } else {
        await loadData()
      }

      message.success('Added model')
      setModelModalOpen(false)
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot add model')
    } finally {
      setSavingModel(false)
    }
  }

  const handleDeleteModel = async model => {
    if (!provider) return

    const modelValue = String(model || '').trim()
    const currentModels = getProviderModels(provider)

    if (currentModels.length <= 1) {
      message.error('Provider must keep at least one model')
      return
    }

    const nextModels = currentModels.filter(item => item.model !== modelValue)
    if (nextModels.length === currentModels.length) return

    setSavingModel(true)

    try {
      const res = await updateAIProvider(provider.id || provider._id, {
        models: nextModels,
        allowedModels: nextModels.map(item => item.model),
        defaultModel: provider.defaultModel === modelValue ? nextModels[0].model : provider.defaultModel
      })

      if (res?.data) {
        setProviders(current => current.map(item => (item.code === provider.code ? res.data : item)))
      } else {
        await loadData()
      }

      message.success('Deleted model')
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot delete model')
    } finally {
      setSavingModel(false)
    }
  }

  return {
    keyForm,
    modelForm,
    provider,
    providerOptions,
    keys,
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
    refresh: loadData
  }
}
