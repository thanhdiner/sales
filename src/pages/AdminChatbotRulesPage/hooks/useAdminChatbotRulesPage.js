import { useEffect, useState } from 'react'
import { Form } from 'antd'
import useAdminChatbotConfigData from '@/pages/AdminChatbotShared/hooks/useAdminChatbotConfigData'

export default function useAdminChatbotRulesPage() {
  const [form] = Form.useForm()
  const [keywordInput, setKeywordInput] = useState('')
  const [ruleInput, setRuleInput] = useState('')
  const {
    config,
    loading,
    saving,
    loadConfig,
    saveConfig
  } = useAdminChatbotConfigData()

  const watchedKeywords = Form.useWatch('autoEscalateKeywords', form) || []
  const watchedRules = Form.useWatch('systemRules', form) || []
  const promptOverrideValue = Form.useWatch('systemPromptOverride', form)

  useEffect(() => {
    if (!config) return

    form.setFieldsValue({
      brandVoice: config.brandVoice || '',
      systemPromptOverride: config.systemPromptOverride || '',
      systemRules: config.systemRules || [],
      fallbackMessage: config.fallbackMessage || '',
      autoEscalateKeywords: config.autoEscalateKeywords || []
    })
  }, [config, form])

  const updateStringListField = (fieldName, nextValues) => {
    form.setFieldsValue({ [fieldName]: nextValues })
  }

  const handleAddKeyword = () => {
    const value = keywordInput.trim()

    if (!value) return

    if (!watchedKeywords.includes(value)) {
      updateStringListField('autoEscalateKeywords', [...watchedKeywords, value])
    }

    setKeywordInput('')
  }

  const handleRemoveKeyword = keyword => {
    updateStringListField(
      'autoEscalateKeywords',
      watchedKeywords.filter(item => item !== keyword)
    )
  }

  const handleAddRule = () => {
    const value = ruleInput.trim()

    if (!value) return

    if (!watchedRules.includes(value)) {
      updateStringListField('systemRules', [...watchedRules, value])
    }

    setRuleInput('')
  }

  const handleRemoveRule = rule => {
    updateStringListField(
      'systemRules',
      watchedRules.filter(item => item !== rule)
    )
  }

  const handleSave = async () => {
    const values = form.getFieldsValue(true)

    await saveConfig(
      {
        brandVoice: values.brandVoice,
        systemPromptOverride: values.systemPromptOverride,
        fallbackMessage: values.fallbackMessage,
        systemRules: watchedRules,
        autoEscalateKeywords: watchedKeywords
      },
      'Cập nhật agent rules thành công'
    )
  }

  return {
    form,
    loading,
    saving,
    watchedKeywords,
    watchedRules,
    promptOverrideEnabled: !!promptOverrideValue,
    keywordInput,
    ruleInput,
    handleReload: loadConfig,
    handleSave,
    handleKeywordInputChange: setKeywordInput,
    handleRuleInputChange: setRuleInput,
    handleAddKeyword,
    handleRemoveKeyword,
    handleAddRule,
    handleRemoveRule
  }
}
