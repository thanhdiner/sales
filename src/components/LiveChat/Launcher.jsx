import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function Launcher({ onClick, unread }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-6 z-[1000] w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center transition-all active:scale-95 hover:scale-110 hover:shadow-blue-500/50"
    >
      <MessageCircle className="w-6 h-6" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  )
}
