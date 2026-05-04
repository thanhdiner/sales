import { useTranslation } from 'react-i18next'
import { ToolOutlined } from '@ant-design/icons'
import { StatCard, StatGrid } from '@/components/admin/ui'

export default function ChatbotToolsStats({
  totalTools,
  enabledTools,
  disabledTools
}) {
  const { t } = useTranslation('adminChatbotTools')

  return (
    <StatGrid className="mb-4" columns={3}>
      <StatCard label={t('stats.totalTools')} value={totalTools} meta={t('stats.totalToolsHint')} icon={<ToolOutlined />} />
      <StatCard label={t('stats.enabledTools')} value={enabledTools} meta={t('stats.enabledToolsHint')} icon={<ToolOutlined />} />
      <StatCard label={t('stats.disabledTools')} value={disabledTools} meta={t('stats.disabledToolsHint')} icon={<ToolOutlined />} />
    </StatGrid>
  )
}
