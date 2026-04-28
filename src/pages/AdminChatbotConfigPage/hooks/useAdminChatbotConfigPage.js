import { useEffect } from 'react'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import useAdminChatbotConfigData from '@/pages/AdminChatbotShared/hooks/useAdminChatbotConfigData'

export default function useAdminChatbotConfigPage() {
  const { t } = useTranslation('adminChatbotConfig')
  const [form] = Form.useForm()
  const {
    config,
    loading,
    saving,
    toolRegistry,
    loadConfig,
    saveConfig
  } = useAdminChatbotConfigData()

  const agentEnabled = Form.useWatch('isEnabled', form)

  useEffect(() => {
    if (!config) return

    form.setFieldsValue({
      agentName: config.agentName || t('defaults.agentName'),
      agentRole: config.agentRole || '',
      agentTone: config.agentTone || '',
      isEnabled: config.isEnabled
    })
  }, [config, form, t])

  const handleSave = async () => {
    const values = form.getFieldsValue(true)
    await saveConfig(values, t('messages.updateProfileSuccess'))
  }

  return {
    form,
    loading,
    saving,
    agentEnabled,
    runtimeProvider: config?.runtimeProvider || '--',
    runtimeModel: config?.runtimeModel || '',
    enabledTools: toolRegistry.filter(tool => tool.enabled !== false).length,
    totalTools: toolRegistry.length || 0,
    handleReload: loadConfig,
    handleSave
  }
}
