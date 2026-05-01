import React from 'react'
import { Bot, ChevronDown, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MessageBubble from './MessageBubble'
import AgentActivityPanel from './AgentActivityPanel'

export default function MessageList({
  historyLoaded,
  messages,
  assignedAgent,
  quickActions,
  onSendMessage,
  groupedMessages,
  isTypingAgent,
  isBotTyping,
  botActivity = [],
  containerRef,
  onScroll,
  bottomRef,
  showScrollToBottom,
  newIncomingCount = 0,
  onScrollToBottom,
  onOpenImagePreview,
  onReactToMessage,
  reactionActor
}) {
  const { t } = useTranslation('clientChat')

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="
          h-full space-y-2 overflow-x-hidden overflow-y-auto bg-gray-50 px-4 py-4 dark:bg-gray-950
          [scrollbar-width:thin]
          [scrollbar-color:#e5e7eb_transparent]
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-200/80
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[scrollbar-color:#3f3f46_transparent]
          dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700/80
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600
        "
      >
        {historyLoaded && messages.filter(m => m.type !== 'system').length === 0 && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Bot className="h-7 w-7 text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('empty.title')}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {t('empty.description')}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {quickActions.slice(0, 3).map((qa, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(qa.text)}
                  className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {groupedMessages.map((msg, i) => (
          <MessageBubble
            key={msg._id || i}
            msg={msg}
            assignedAgent={assignedAgent}
            showAvatar={msg.showAvatar}
            onSuggestionClick={onSendMessage}
            onOpenImagePreview={onOpenImagePreview}
            onReactToMessage={onReactToMessage}
            reactionActor={reactionActor}
          />
        ))}

        {isTypingAgent && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex h-4 items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        {isBotTyping && !isTypingAgent && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex max-w-[80%] flex-col items-start gap-0.5">
              <div className="rounded-2xl rounded-bl-sm border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3 shadow-sm dark:border-emerald-800/40 dark:from-emerald-900/20 dark:to-teal-900/20">
                <div className="flex h-4 items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
              <AgentActivityPanel steps={botActivity} live />
            </div>
            <span className="mb-1 self-end text-[10px] text-emerald-500">{t('typing.bot')}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <button
        type="button"
        onClick={() => onScrollToBottom?.()}
        aria-label={t('actions.scrollBottom')}
        title={t('actions.scrollBottom')}
        className={`absolute bottom-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-lg ring-1 ring-black/5 backdrop-blur transition-all duration-200 hover:bg-white hover:text-blue-600 dark:bg-gray-800/95 dark:text-gray-200 dark:ring-white/10 dark:hover:bg-gray-800 dark:hover:text-blue-300 ${
          newIncomingCount > 0 ? 'ring-2 ring-blue-200 dark:ring-blue-500/40' : ''
        } ${
          showScrollToBottom
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-2 opacity-0 pointer-events-none'
        }`}
      >
        <ChevronDown className="h-4 w-4" />
        {newIncomingCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
            {newIncomingCount > 9 ? '9+' : newIncomingCount}
          </span>
        )}
      </button>
    </div>
  )
}
