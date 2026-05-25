import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import SEO from '@/components/shared/SEO'
import '@/pages/admin/ChatbotShared/ChatbotTheme.scss'
import { getAIProviders } from '@/services/admin/chatbot/aiProviders'
import { getAIRuntimeSettings } from '@/services/admin/chatbot/aiRuntimeSettings'
import AIProviderList from './components/AIProviderList'

export default function AIProviders() {
  const [providers, setProviders] = useState([])
  const [activeProviderCode, setActiveProviderCode] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadProviders = useCallback(async () => {
    setLoading(true)

    try {
      const [providersRes, runtimeRes] = await Promise.all([
        getAIProviders(),
        getAIRuntimeSettings()
      ])

      setProviders(providersRes?.data || [])
      setActiveProviderCode(runtimeRes?.data?.activeProviderCode || null)
    } catch (err) {
      message.error(err?.response?.message || err.message || 'Cannot load AI providers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadProviders, 0)
    return () => window.clearTimeout(timer)
  }, [loadProviders])

  return (
    <div className="admin-chatbot-page admin-ai-providers-page mx-auto max-w-7xl">
      <SEO title="AI Providers" noIndex />
      <AIProviderList providers={providers} activeProviderCode={activeProviderCode} loading={loading} />
    </div>
  )
}
