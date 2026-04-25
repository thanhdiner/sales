import React from 'react'
import { Bot, ChevronDown, Minus, X } from 'lucide-react'

export default function ChatHeader({ onBack, onClose, onMinimize, assignedAgent, isResolved }) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
      <button
        type="button"
        onClick={onBack}
        aria-label="Quay lại"
        title="Quay lại"
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <ChevronDown className="w-4 h-4 rotate-90" />
      </button>
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {assignedAgent?.agentAvatar
            ? <img src={assignedAgent.agentAvatar} alt="" className="w-full h-full object-cover" />
            : <Bot className="w-4 h-4 text-white" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {assignedAgent ? assignedAgent.agentName : 'SmartMall Support'}
          </p>
          <p className="text-[11px] text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
            {isResolved ? 'Đã giải quyết' : 'Đang hoạt động'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onMinimize}
        aria-label="Thu gọn chat"
        title="Thu gọn chat"
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng chat"
        title="Đóng chat"
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
