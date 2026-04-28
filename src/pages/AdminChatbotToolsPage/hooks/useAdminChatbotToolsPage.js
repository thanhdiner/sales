import { useTranslation } from 'react-i18next'
import useAdminChatbotConfigData from '@/pages/AdminChatbotShared/hooks/useAdminChatbotConfigData'
import { buildToolSettingsPayload } from '@/pages/AdminChatbotShared/utils'

export default function useAdminChatbotToolsPage() {
  const { t } = useTranslation('adminChatbotTools')
  const {
    loading,
    saving,
    toolRegistry,
    setToolRegistry,
    loadConfig,
    saveConfig
  } = useAdminChatbotConfigData()

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
