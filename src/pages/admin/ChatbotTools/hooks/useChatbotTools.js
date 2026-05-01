import { useTranslation } from 'react-i18next'
import useChatbotConfigData from '@/pages/admin/ChatbotShared/hooks/useChatbotConfigData'
import { buildToolSettingsPayload } from '@/pages/admin/ChatbotShared/utils'

export default function useChatbotTools() {
  const { t } = useTranslation('adminChatbotTools')
  const {
    loading,
    saving,
    toolRegistry,
    setToolRegistry,
    loadConfig,
    saveConfig
  } = useChatbotConfigData()

  const enabledTools = toolRegistry.filter(tool => tool.enabled !== false).length
  const disabledTools = toolRegistry.length - enabledTools

  const handleToggleTool = (toolName, enabled) => {
    setToolRegistry(currentTools =>
      currentTools.map(tool => (
        tool.name === toolName
          ? { ...tool, enabled }
          : tool
      ))
    )
  }

  const handleSave = async () => {
    await saveConfig(
      {
        toolSettings: buildToolSettingsPayload(toolRegistry)
      },
      t('messages.updateSuccess')
    )
  }

  return {
    loading,
    saving,
    toolRegistry,
    enabledTools,
    disabledTools,
    handleReload: loadConfig,
    handleSave,
    handleToggleTool
  }
}
