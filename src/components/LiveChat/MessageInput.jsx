import React from 'react'
import { Send, Sparkles, User } from 'lucide-react'

export default function MessageInput({
  input,
  onInputChange,
  onKeyDown,
  onSendMessage,
  messages,
  conversation,
  onSwitchToBot,
  onRequestHuman,
  inputRef
}) {
  return (
    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-colors">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 leading-5 py-1"
          style={{ maxHeight: '80px', overflowY: 'auto' }}
        />
        <button
          onClick={onSendMessage}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {messages.length > 0 && (
        <>
          {conversation?.botStats?.escalated || conversation?.assignedAgent?.agentId ? (
            <button
              onClick={onSwitchToBot}
              className="w-full mt-2 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Quay lại chat với AI
            </button>
          ) : (
            <button
              onClick={onRequestHuman}
              className="w-full mt-2 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3" />
              Nói chuyện với nhân viên
            </button>
          )}
        </>
      )}
    </div>
  )
}
