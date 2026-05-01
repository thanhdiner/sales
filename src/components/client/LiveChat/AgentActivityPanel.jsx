import React, { useState } from 'react'
import { Brain, CheckCircle2, ChevronDown, MessageSquareText, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const normalizeActivitySteps = source => {
  const directSteps = Array.isArray(source)
    ? source
    : Array.isArray(source?.steps)
      ? source.steps
      : null

  if (directSteps) {
    return directSteps.filter(step => step && typeof step === 'object')
  }

  const metadata = source?.metadata || {}
  const explicitSteps = Array.isArray(metadata.agentActivity)
    ? metadata.agentActivity.filter(step => step && typeof step === 'object')
    : []

  if (explicitSteps.length > 0) return explicitSteps

  if (!metadata.provider && !metadata.responseTime && !Array.isArray(metadata.toolsUsed)) {
    return []
  }

  const toolsUsed = Array.isArray(metadata.toolsUsed) ? metadata.toolsUsed : []

  return [
    { type: 'understand', status: 'done' },
    ...toolsUsed.map(toolName => ({
      type: 'tool',
      status: 'done',
      toolName,
      toolLabel: toolName
    })),
    { type: 'compose', status: 'done', durationMs: metadata.responseTime }
  ]
}

const formatDuration = durationMs => {
  const value = Number(durationMs)
  if (!Number.isFinite(value) || value <= 0) return ''
  if (value < 1000) return `${Math.round(value)}ms`
  return `${(value / 1000).toFixed(value < 10000 ? 1 : 0)}s`
}

const getActivityIcon = type => {
  if (type === 'tool') return Search
  if (type === 'compose') return MessageSquareText
  return Brain
}

export default function AgentActivityPanel({
  msg,
  steps: rawSteps,
  live = false,
  defaultOpen = false,
  className = ''
}) {
  const { t } = useTranslation('clientChat')
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const steps = normalizeActivitySteps(rawSteps || msg)

  if (!steps.length) return null

  const responseTime = formatDuration(msg?.metadata?.responseTime)
  const summary = live
    ? t('thinking.liveSummary')
    : responseTime
      ? t('thinking.summaryWithTime', { time: responseTime })
      : t('thinking.summary')

  const getStepLabel = step => {
    const isDone = step.status === 'done'

    if (step.type === 'tool') {
      const tool = step.toolLabel || step.toolName || t('thinking.steps.toolFallback')
      return isDone
        ? t('thinking.steps.tool', { tool })
        : t('thinking.steps.toolRunning', { tool })
    }

    if (step.type === 'compose') {
      return isDone ? t('thinking.steps.compose') : t('thinking.steps.composeRunning')
    }

    return isDone ? t('thinking.steps.understand') : t('thinking.steps.understandRunning')
  }

  return (
    <div className={`ml-1 mt-1.5 max-w-[260px] ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 shadow-sm transition-colors hover:border-emerald-200 hover:bg-white dark:border-emerald-800/50 dark:bg-gray-900/70 dark:text-emerald-300 dark:hover:bg-gray-900"
        aria-expanded={isOpen}
      >
        <Brain className={`h-3 w-3 shrink-0 ${live ? 'animate-pulse' : ''}`} />
        <span className="truncate">{summary}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-1.5 rounded-xl border border-emerald-100 bg-white p-2.5 text-[11px] leading-5 text-gray-600 shadow-sm dark:border-emerald-800/40 dark:bg-gray-900 dark:text-gray-300">
          <div className="mb-1 font-medium text-gray-800 dark:text-gray-100">{t('thinking.title')}</div>
          <div className="space-y-1.5">
            {steps.map((step, index) => {
              const StepIcon = getActivityIcon(step.type)
              const duration = formatDuration(step.durationMs)
              const isDone = step.status === 'done'

              return (
                <div key={`${step.type || 'step'}_${step.toolName || index}_${step.round || ''}`} className="flex gap-2">
                  <span className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {isDone
                      ? <CheckCircle2 className="h-3 w-3" />
                      : <StepIcon className="h-3 w-3 animate-pulse" />
                    }
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="break-words">{getStepLabel(step)}</span>
                    {duration && <span className="ml-1 text-gray-400 dark:text-gray-500">({duration})</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
