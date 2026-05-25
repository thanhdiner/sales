import { useEffect, useState } from 'react'
import { Form, Modal, message } from 'antd'
import { useTranslation } from 'react-i18next'
import useChatbotConfigData from '@/pages/admin/ChatbotShared/hooks/useChatbotConfigData'
import {
  getChatbotRulesDefaults,
  getChatbotRulesHistory,
  previewChatbotPrompt,
  rollbackChatbotRulesHistory,
  testChatbotRules
} from '@/services/admin/agent/chatbotConfig'

const LIMITS = {
  brandVoice: 2000,
  systemPromptOverride: 8000,
  fallbackMessage: 500,
  rule: 500,
  keyword: 80
}

const normalizeList = values => {
  const seen = new Set()
  const result = []

  ;(Array.isArray(values) ? values : []).forEach(value => {
    const text = typeof value === 'string' ? value.trim() : ''
    if (!text) return
    const key = text.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    result.push(text)
  })

  return result
}

export default function useChatbotRules() {
  const { t } = useTranslation('adminChatbotRules')
  const [form] = Form.useForm()
  const [keywordInput, setKeywordInput] = useState('')
  const [ruleInput, setRuleInput] = useState('')
  const [defaults, setDefaults] = useState(null)
  const [history, setHistory] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewPrompt, setPreviewPrompt] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [panelLoading, setPanelLoading] = useState(false)
  const {
    config,
    loading,
    saving,
    loadConfig,
    saveConfig
  } = useChatbotConfigData()

  const watchedKeywords = Form.useWatch('autoEscalateKeywords', form) || []
  const watchedRules = Form.useWatch('systemRules', form) || []
  const promptOverrideValue = Form.useWatch('systemPromptOverride', form)

  const loadRulesExtras = async () => {
    const [defaultsRes, historyRes] = await Promise.all([
      getChatbotRulesDefaults(),
      getChatbotRulesHistory()
    ])
    setDefaults(defaultsRes?.data || null)
    setHistory(historyRes?.data || [])
  }

  useEffect(() => {
    loadRulesExtras().catch(() => {})
  }, [])

  useEffect(() => {
    if (!config) return

    form.setFieldsValue({
      brandVoice: config.brandVoice || '',
      systemPromptOverride: config.systemPromptOverride || '',
      systemRules: normalizeList(config.systemRules || []),
      fallbackMessage: config.fallbackMessage || '',
      autoEscalateKeywords: normalizeList(config.autoEscalateKeywords || [])
    })
  }, [config, form])

  const updateStringListField = (fieldName, nextValues) => {
    form.setFieldsValue({ [fieldName]: normalizeList(nextValues) })
  }

  const addListValue = (fieldName, currentItems, value, maxLength) => {
    const text = value.trim()
    if (!text) return false
    if (text.length > maxLength) {
      message.error(`Nội dung vượt quá ${maxLength} ký tự`)
      return false
    }

    updateStringListField(fieldName, [...currentItems, text])
    return true
  }

  const handleAddKeyword = () => {
    if (addListValue('autoEscalateKeywords', watchedKeywords, keywordInput, LIMITS.keyword)) setKeywordInput('')
  }

  const handleRemoveKeyword = keyword => {
    updateStringListField('autoEscalateKeywords', watchedKeywords.filter(item => item !== keyword))
  }

  const handleAddRule = () => {
    if (addListValue('systemRules', watchedRules, ruleInput, LIMITS.rule)) setRuleInput('')
  }

  const handleRemoveRule = rule => {
    updateStringListField('systemRules', watchedRules.filter(item => item !== rule))
  }

  const getPayload = async () => {
    const values = await form.validateFields()
    return {
      brandVoice: values.brandVoice || '',
      systemPromptOverride: values.systemPromptOverride || '',
      fallbackMessage: values.fallbackMessage || '',
      systemRules: normalizeList(watchedRules),
      autoEscalateKeywords: normalizeList(watchedKeywords)
    }
  }

  const savePayload = async payload => {
    await saveConfig(payload, t('messages.updateSuccess'))
    await loadRulesExtras()
  }

  const handleSave = async () => {
    const payload = await getPayload()

    if (payload.systemPromptOverride) {
      Modal.confirm({
        title: t('override.confirmTitle'),
        content: t('override.confirmDescription'),
        okText: t('page.save'),
        onOk: () => savePayload(payload)
      })
      return
    }

    await savePayload(payload)
  }

  const handleResetDefaults = () => {
    if (!defaults) return
    Modal.confirm({
      title: t('defaults.confirmTitle'),
      content: t('defaults.confirmDescription'),
      onOk: () => {
        form.setFieldsValue(defaults)
        message.success(t('defaults.applied'))
      }
    })
  }

  const handlePreviewPrompt = async () => {
    const payload = await getPayload()
    setPanelLoading(true)
    try {
      const res = await previewChatbotPrompt(payload)
      setPreviewPrompt(res?.data?.prompt || '')
      setPreviewOpen(true)
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Không thể preview prompt')
    } finally {
      setPanelLoading(false)
    }
  }

  const handleTestRules = async () => {
    const payload = await getPayload()
    setPanelLoading(true)
    try {
      const res = await testChatbotRules({ ...payload, message: testMessage })
      setTestResult(res?.data || null)
      message.success(res?.message || 'Test chatbot thành công')
    } catch (err) {
      setTestResult(err?.response?.data || { error: err.message })
      message.error(err?.response?.message || err.message || 'Test chatbot thất bại')
    } finally {
      setPanelLoading(false)
    }
  }

  const handleRollback = id => {
    Modal.confirm({
      title: t('history.rollbackConfirmTitle'),
      content: t('history.rollbackConfirmDescription'),
      onOk: async () => {
        await rollbackChatbotRulesHistory(id)
        await loadConfig()
        await loadRulesExtras()
        message.success(t('history.rollbackSuccess'))
      }
    })
  }

  return {
    form,
    loading,
    saving,
    panelLoading,
    watchedKeywords,
    watchedRules,
    promptOverrideEnabled: !!promptOverrideValue,
    keywordInput,
    ruleInput,
    history,
    previewOpen,
    previewPrompt,
    testMessage,
    testResult,
    limits: LIMITS,
    handleReload: loadConfig,
    handleSave,
    handleResetDefaults,
    handlePreviewPrompt,
    handleTestRules,
    handleRollback,
    handleClosePreview: () => setPreviewOpen(false),
    handleKeywordInputChange: setKeywordInput,
    handleRuleInputChange: setRuleInput,
    handleTestMessageChange: setTestMessage,
    handleAddKeyword,
    handleRemoveKeyword,
    handleAddRule,
    handleRemoveRule
  }
}
