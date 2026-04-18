import React, { useState, useEffect } from 'react'
import { Sparkles, Bot } from 'lucide-react'

// ─── Sub-component: Typewriter effect for Bot ──────────────────────────────
function TypewriterText({ text, speed = 15 }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return <>{displayed}</>
}

// ─── Main Component: Message bubble UI ──────────────────────────────────────
export default function MessageBubble({ msg, showAvatar, onSuggestionClick }) {
  const isCustomer = msg.sender === 'customer' || msg.sender === 'guest'
  const isSystem = msg.type === 'system' || msg.sender === 'system'
  const isBot = msg.sender === 'bot'

  // System message - centered
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
          {msg.message}
        </span>
      </div>
    )
  }

  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''

  if (isCustomer) {
    return (
      <div className={`flex justify-end items-end gap-2 group ${msg.isOptimistic ? 'opacity-60' : ''}`}>
        {!msg.isOptimistic && (
          <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
            {formatTime(msg.createdAt)}
          </span>
        )}
        <div className="w-fit max-w-[75%] bg-blue-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words">
          {msg.message}
        </div>
      </div>
    )
  }

  // Bot message — distinct green/emerald gradient avatar + suggestions
  if (isBot) {
    const suggestions = msg.metadata?.suggestions || []
    return (
      <div className="flex justify-start items-end gap-2 group">
        {showAvatar ? (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <div className="w-7 flex-shrink-0" />
        )}
        <div className="flex flex-col gap-0.5 max-w-[80%]">
          {showAvatar && (
            <span className="text-[10px] text-emerald-500 ml-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {msg.senderName || 'SmartMall Bot'}
            </span>
          )}
          <div className="w-fit bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-emerald-100 dark:border-emerald-800/40 whitespace-pre-wrap break-words">
            {msg.isNew ? <TypewriterText text={msg.message} /> : msg.message}
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5 ml-1">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => onSuggestionClick?.(s)}
                  className="text-xs bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
          {formatTime(msg.createdAt)}
        </span>
      </div>
    )
  }

  // Agent message
  return (
    <div className="flex justify-start items-end gap-2 group">
      {showAvatar ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mb-0.5 overflow-hidden">
          {msg.senderAvatar
            ? <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" />
            : <Bot className="w-4 h-4 text-white" />
          }
        </div>
      ) : (
        <div className="w-7 flex-shrink-0" />
      )}
      <div className="flex flex-col gap-0.5 max-w-[80%]">
        {showAvatar && (
          <span className="text-[10px] text-gray-400 ml-1">{msg.senderName}</span>
        )}
        <div className="w-fit bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words">
          {msg.message}
        </div>
      </div>
      <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
        {formatTime(msg.createdAt)}
      </span>
    </div>
  )
}
