import { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, message, Upload } from 'antd'
import {
  createAIAgent,
  deleteAIAgent,
  getAIAgents,
  reorderAIAgent,
  setDefaultAIAgent,
  toggleAIAgent,
  updateAIAgent
} from '@/services/admin/chatbot/aiAgents'
import { getAIProviders } from '@/services/admin/chatbot/aiProviders'
import { getChatbotConfig } from '@/services/admin/agent/chatbotConfig'

const normalizeAgent = item => ({
  ...item,
  id: item.id || item._id,
  toolIds: Array.isArray(item.toolIds) ? item.toolIds : [],
  stopSequences: Array.isArray(item.stopSequences) ? item.stopSequences : []
})

const getAgentAvatarFileList = agent => (
  agent?.avatar
    ? [
        {
          uid: agent._id || agent.id || agent.avatar,
          name: agent.avatar.split('/').pop(),
          status: 'done',
          url: agent.avatar
        }
      ]
    : []
)

const appendPayloadValue = (formData, key, value) => {
  if (value === undefined || value === null) return
  if (Array.isArray(value) || typeof value === 'object') {
    formData.append(key, JSON.stringify(value))
    return
  }

  formData.append(key, String(value))
}

const buildAIAgentFormData = ({ values, editingAgent, oldAvatar, isRemoveAvatar }) => {
  const formData = new FormData()
  const file = values.avatar?.[0]?.originFileObj

  Object.entries(values).forEach(([key, value]) => {
    if (key !== 'avatar') appendPayloadValue(formData, key, value)
  })

  if (file) {
    formData.append('avatar', file)
    if (oldAvatar) formData.append('oldImage', oldAvatar)
  } else if (editingAgent && isRemoveAvatar) {
    formData.append('oldImage', oldAvatar)
    formData.append('deleteImage', true)
    formData.append('avatar', '')
  }

  return formData
}

export function useAIAgents() {
  const [form] = Form.useForm()
  const [agents, setAgents] = useState([])
  const [providers, setProviders] = useState([])
  const [toolRegistry, setToolRegistry] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [oldAvatar, setOldAvatar] = useState('')
  const [isRemoveAvatar, setIsRemoveAvatar] = useState(false)

  const providerOptions = useMemo(
    () => providers.map(provider => ({
      label: `${provider.name} (${provider.code})`,
      value: provider.code,
      models: Array.isArray(provider.models) && provider.models.length
        ? provider.models.map(m => m.model)
        : (Array.isArray(provider.allowedModels) ? provider.allowedModels : [])
    })),
    [providers]
  )

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const [agentsRes, providersRes, chatbotConfigRes] = await Promise.all([
        getAIAgents(),
        getAIProviders(),
        getChatbotConfig()
      ])

      setAgents((agentsRes?.data || []).map(normalizeAgent))
      setProviders(providersRes?.data || [])
      setToolRegistry(chatbotConfigRes?.data?.toolRegistry || [])
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot load agents')
    } finally {
      setLoaded(true)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(loadData)
  }, [loadData])

  const openCreateModal = () => {
    setEditingAgent(null)
    setOldAvatar('')
    setIsRemoveAvatar(false)
    form.resetFields()
    form.setFieldsValue({
      enabled: true,
      isDefault: false,
      locale: 'vi',
      color: '#5e6ad2',
      temperature: 0.7,
      topP: 1,
      maxTokens: 1000,
      toolIds: [],
      avatar: []
    })
    setModalOpen(true)
  }

  const openEditModal = record => {
    setEditingAgent(record)
    setOldAvatar(record?.avatar || '')
    setIsRemoveAvatar(false)
    form.resetFields()
    form.setFieldsValue({
      ...record,
      avatar: getAgentAvatarFileList(record),
      stopSequences: Array.isArray(record.stopSequences) ? record.stopSequences.join(', ') : '',
      toolIds: Array.isArray(record.toolIds) ? record.toolIds : []
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setOldAvatar('')
    setIsRemoveAvatar(false)
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const payload = buildAIAgentFormData({
      values: {
        ...values,
        stopSequences: typeof values.stopSequences === 'string'
          ? values.stopSequences.split(',').map(s => s.trim()).filter(Boolean)
          : values.stopSequences,
        toolIds: typeof values.toolIds === 'string'
          ? values.toolIds.split(',').map(s => s.trim()).filter(Boolean)
          : values.toolIds
      },
      editingAgent,
      oldAvatar,
      isRemoveAvatar
    })

    setSaving(true)

    try {
      await (editingAgent
        ? updateAIAgent(editingAgent._id || editingAgent.id, payload)
        : createAIAgent(payload))

      message.success(editingAgent ? 'Updated agent' : 'Created agent')
      setModalOpen(false)
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot save agent')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarBeforeUpload = useCallback(file => {
    setIsRemoveAvatar(false)

    const isImage = file.type?.startsWith('image/')
    if (!isImage) message.error('Avatar must be an image')

    return isImage ? false : Upload.LIST_IGNORE
  }, [])

  const handleAvatarRemove = useCallback(() => {
    setIsRemoveAvatar(!!oldAvatar)
    return true
  }, [oldAvatar])

  const toggleAgent = async record => {
    try {
      await toggleAIAgent(record._id || record.id)
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot toggle agent')
    }
  }

  const deleteAgent = async record => {
    try {
      await deleteAIAgent(record._id || record.id)
      message.success('Deleted agent')
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot delete agent')
    }
  }

  const setDefaultAgent = async record => {
    try {
      await setDefaultAIAgent(record._id || record.id)
      message.success('Default agent updated')
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot set default')
    }
  }

  const moveAgent = async (record, direction) => {
    try {
      await reorderAIAgent(record._id || record.id, direction)
      await loadData()
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot reorder')
    }
  }

  return {
    form,
    agents,
    providers,
    providerOptions,
    toolRegistry,
    loading,
    loaded,
    modalOpen,
    editingAgent,
    saving,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleAvatarBeforeUpload,
    handleAvatarRemove,
    toggleAgent,
    deleteAgent,
    setDefaultAgent,
    moveAgent,
    refresh: loadData
  }
}
