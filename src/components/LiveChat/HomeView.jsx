import React from 'react'
import { Bot, MessageCircle, Minus, Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getChatMessagePreview, getLocalizedSystemMessage } from '@/utils/chatMessage'

export default function HomeView({
  onClose,
  onMinimize,
  onOpenChat,
  onStartNewConversation,
  isStartingNewConversation = false,
  assignedAgent,
  messages = [],
  unread = 0,
  onQuickAction,
  quickActions = [],
}) {
  const { t, i18n } = useTranslation('clientChat')
  const language = i18n.resolvedLanguage || i18n.language
  const lastMessage = getChatMessagePreview(messages[messages.length - 1], {
    emptyText: t('preview.empty'),
    imageText: t('preview.image'),
    language,
    systemText: msg => getLocalizedSystemMessage(msg, t, language)
  })
  const agentName = assignedAgent?.agentName || t('agent.defaultName')
  const hasConversationHistory = messages.some(message => message.type !== 'system')

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-black/5 bg-white/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/95">
      <div className="flex items-start justify-between border-b border-black/5 px-5 py-3.5 dark:border-white/10">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">{agentName}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('home.responseTime')}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            aria-label={t('actions.minimize')}
            title={t('actions.minimize')}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Minus className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('actions.close')}
            title={t('actions.close')}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="
          flex-1 space-y-4 overflow-y-auto px-5 py-4
          [scrollbar-width:thin]
          [scrollbar-color:#f3f4f6_transparent]
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-100/90
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-200
          dark:[scrollbar-color:#3f3f46_transparent]
          dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800/80
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700
        "
      >
        <button
          onClick={onOpenChat}
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-gray-300 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white">
            <Bot className="h-4.5 w-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{agentName}</p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {lastMessage}
            </p>
          </div>

          {unread > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </button>

        {quickActions.length > 0 && (
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              {t('home.faqTitle')}
            </p>

            <div className="space-y-2">
              {quickActions.map((qa, i) => {
                const Icon = qa.icon

                return (
                  <button
                    key={i}
                    onClick={() => onQuickAction(qa)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                  >
                    {Icon && (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300">
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0 truncate">{qa.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-black/5 p-4 dark:border-white/10">
        <div className="space-y-2">
          <button
            onClick={onOpenChat}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
          >
            <MessageCircle className="h-4 w-4" />
            {t('home.startChat')}
          </button>

          {hasConversationHistory && (
            <button
              type="button"
              onClick={onStartNewConversation}
              disabled={isStartingNewConversation}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              {t('home.newConversation')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
