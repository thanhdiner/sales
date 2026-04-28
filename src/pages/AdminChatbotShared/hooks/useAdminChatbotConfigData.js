import { useCallback, useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  getChatbotConfig,
  getChatbotToolLogs,
  updateChatbotConfig
} from '@/services/adminChatbotConfigService'

export default function useAdminChatbotConfigData(options = {}) {
  const { t } = useTranslation('adminChatbotConfig')
  const { loadLogs = false, logLimit = 12 } = options
  const defaultLogsMeta = useMemo(() => ({ total: 0, errorCount: 0, page: 1, limit: logLimit }), [logLimit])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [config, setConfig] = useState(null)
  const [toolRegistry, setToolRegistry] = useState([])
  const [toolLogs, setToolLogs] = useState([])
  const [toolLogsMeta, setToolLogsMeta] = useState(defaultLogsMeta)

  const loadToolLogs = useCallback(async (params = {}, requestOptions = {}) => {
    const { silent = false, withLoading = true } = requestOptions

    try {
      if (withLoading) setLogsLoading(true)

      const res = await getChatbotToolLogs({
        limit: logLimit,
        ...params
      })

      if (res?.success) {
        setToolLogs(res.data || [])
        setToolLogsMeta({
          ...defaultLogsMeta,
          ...(res.meta || {}),
          page: Number(res?.meta?.page || params.page || 1),
          limit: Number(res?.meta?.limit || params.limit || logLimit)
        })
      } else {
        setToolLogs([])
        setToolLogsMeta(defaultLogsMeta)
      }
    } catch (err) {
      setToolLogs([])
      setToolLogsMeta(defaultLogsMeta)
      if (!silent) {
        message.error(err?.message || t('messages.loadToolLogsFailed'))
      }
    } finally {
      if (withLoading) setLogsLoading(false)
    }
  }, [defaultLogsMeta, logLimit, t])

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getChatbotConfig()

      if (res?.success && res.data) {
        setConfig(res.data)
        setToolRegistry(res.data.toolRegistry || [])
      }

      if (loadLogs) {
        await loadToolLogs({}, { silent: true, withLoading: false })
      }
    } catch (err) {
      message.error(err?.message || t('messages.loadConfigFailed'))
    } finally {
      setLoading(false)
    }
  }, [loadLogs, loadToolLogs, t])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const saveConfig = useCallback(async (payload, successMessage = t('messages.updateSuccess')) => {
    try {
      setSaving(true)
      const res = await updateChatbotConfig(payload)

      if (res?.success) {
        message.success(res.message || successMessage)
        await loadConfig()
      } else {
        message.error(res?.message || t('messages.updateFailed'))
      }

      return res
    } catch (err) {
      message.error(err?.message || t('messages.updateError'))
      throw err
    } finally {
      setSaving(false)
    }
  }, [loadConfig, t])

  return {
    config,
    loading,
    saving,
    logsLoading,
    toolRegistry,
    setToolRegistry,
    toolLogs,
    toolLogsMeta,
    loadConfig,
    loadToolLogs,
    saveConfig
  }
}
