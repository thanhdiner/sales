import React from 'react'
import { Bot, ChevronDown, Minus, Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const getInitials = name =>
  String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'A'

export default function ChatHeader({
  onBack,
  onClose,
  onMinimize,
  onStartNewConversation,
  isStartingNewConversation = false,
  assignedAgent,
  isResolved
}) {
  const { t } = useTranslation('clientChat')
  const displayName = assignedAgent ? assignedAgent.agentName : t('agent.defaultName')

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
      <button
        type="button"
        onClick={onBack}
        aria-label={t('actions.back')}
        title={t('actions.back')}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <ChevronDown className="w-4 h-4 rotate-90" />
      </button>
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {assignedAgent?.agentAvatar
            ? <img src={assignedAgent.agentAvatar} alt="" className="w-full h-full object-cover" />
            : assignedAgent
              ? <span className="text-[11px] font-semibold text-white">{getInitials(displayName)}</span>
              : <Bot className="w-4 h-4 text-white" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {displayName}
          </p>
          <p className="text-[11px] text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
            {isResolved ? t('status.resolved') : t('status.active')}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onStartNewConversation}
        disabled={isStartingNewConversation}
        aria-label={t('actions.newConversation')}
        title={t('actions.newConversation')}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:cursor-wait disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onMinimize}
        aria-label={t('actions.minimize')}
        title={t('actions.minimize')}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label={t('actions.close')}
        title={t('actions.close')}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
