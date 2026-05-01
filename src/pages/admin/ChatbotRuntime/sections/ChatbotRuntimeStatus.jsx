import { Alert, Badge, Tag, Tooltip, Typography } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

const { Text } = Typography

function EnvStatusBadge({ label, envKey, configured }) {
  const { t } = useTranslation('adminChatbotRuntime')

  return (
    <Tooltip title={t('status.envTooltip', { key: envKey })}>
      <Badge
        status={configured ? 'success' : 'error'}
        text={(
          <span>
            {label}{' '}
            {configured ? (
              <Tag color="green">{t('status.configured')}</Tag>
            ) : (
              <Tag color="red">{t('status.missing')}</Tag>
            )}
          </span>
        )}
      />
    </Tooltip>
  )
}

export default function ChatbotRuntimeStatus({ config }) {
  const { t } = useTranslation('adminChatbotRuntime')
  const runtimeProvider = config?.runtimeProvider || '--'
  const runtimeModel = config?.runtimeModel || '--'

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <EnvStatusBadge label="OpenAI" envKey="OPENAI_API_KEY" configured={config?.hasOpenaiKey} />
        <EnvStatusBadge label="DeepSeek" envKey="DEEPSEEK_API_KEY" configured={config?.hasDeepseekKey} />
        <EnvStatusBadge label="Groq" envKey="GROQ_API_KEY" configured={config?.hasGroqKey} />
        <EnvStatusBadge label="9Router" envKey="NINEROUTER_API_KEY" configured={config?.has9routerKey} />
      </div>

      <Alert
        className="admin-chatbot-alert mb-4"
        type="warning"
        showIcon
        message={t('status.warningTitle')}
        description={t('status.warningDescription')}
      />

      <div className="admin-chatbot-runtime-summary mb-4 rounded-2xl p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Tag color={config?.runtimeEnabled ? 'green' : 'red'}>
            {t('status.runtime')}: {config?.runtimeEnabled ? t('status.enabled') : t('status.disabled')}
          </Tag>
          <Tag color="blue">{t('status.provider')}: {runtimeProvider}</Tag>
          <Tag color="geekblue">{t('status.model')}: {runtimeModel}</Tag>
          <Tag color={config?.runtimeBaseUrl ? 'cyan' : 'default'}>
            {t('status.baseUrl')}: {config?.runtimeBaseUrl || t('status.defaultBaseUrl')}
          </Tag>
        </div>

        <Text>
          <Trans
            i18nKey="status.summary"
            ns="adminChatbotRuntime"
            values={{ provider: runtimeProvider, model: runtimeModel }}
            components={{
              provider: <strong />,
              model: <strong />
            }}
          />
        </Text>
      </div>

      {config?.runtimeConfigError && (
        <Alert
          className="admin-chatbot-alert mb-4"
          type="error"
          showIcon
          message={t('status.envInvalidTitle')}
          description={config.runtimeConfigError}
        />
      )}
    </>
  )
}
