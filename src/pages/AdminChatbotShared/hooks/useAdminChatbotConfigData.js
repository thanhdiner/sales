import { useCallback, useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import {
  getChatbotConfig,
  getChatbotToolLogs,
  updateChatbotConfig
} from '@/services/adminChatbotConfigService'

export default function useAdminChatbotConfigData(options = {}) {
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
        message.error(err?.message || 'Không thể tải lịch sử tool calls')
      }
    } finally {
      if (withLoading) setLogsLoading(false)
    }
  }, [defaultLogsMeta, logLimit])

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
      message.error(err?.message || 'Không thể tải cấu hình AI')
    } finally {
      setLoading(false)
    }
  }, [loadLogs, loadToolLogs])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const saveConfig = useCallback(async (payload, successMessage = 'Cập nhật thành công') => {
    try {
      setSaving(true)
      const res = await updateChatbotConfig(payload)

      if (res?.success) {
        message.success(res.message || successMessage)
        await loadConfig()
      } else {
        message.error(res?.message || 'Cập nhật thất bại')
      }

      return res
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra khi cập nhật')
      throw err
    } finally {
      setSaving(false)
    }
  }, [loadConfig])

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
