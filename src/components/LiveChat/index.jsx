import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, Send, Bot, ChevronDown, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getSocket } from '@/services/socketService'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

function getSessionId() {
  let sid = localStorage.getItem('chatSessionId')
  if (!sid) {
    sid = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
    localStorage.setItem('chatSessionId', sid)
  }
  return sid
}

function newSessionId() {
  const sid = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
  localStorage.setItem('chatSessionId', sid)
  return sid
}

const QUICK_ACTIONS = [
  { label: '🛍️ Hỏi về sản phẩm', text: 'Tôi muốn hỏi về sản phẩm' },
  { label: '📦 Kiểm tra đơn hàng', text: 'Tôi cần kiểm tra đơn hàng của mình' },
  { label: '💳 Phương thức thanh toán', text: 'Các phương thức thanh toán được hỗ trợ?' },
  { label: '🔄 Đổi trả hàng', text: 'Chính sách đổi trả hàng như thế nào?' },
]

// ─── Component con: Bubble tin nhắn ─────────────────────────────────────────
function MessageBubble({ msg, showAvatar }) {
  const isCustomer = msg.sender === 'customer' || msg.sender === 'guest'
  const isSystem = msg.type === 'system' || msg.sender === 'system'

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
      <div className="flex justify-end items-end gap-2 group">
        <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
          {formatTime(msg.createdAt)}
        </span>
        <div className="max-w-[75%] bg-blue-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
          {msg.message}
        </div>
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
      <div className="flex flex-col gap-0.5">
        {showAvatar && (
          <span className="text-[10px] text-gray-400 ml-1">{msg.senderName}</span>
        )}
        <div className="max-w-[75%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-gray-100 dark:border-gray-700">
          {msg.message}
        </div>
      </div>
      <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
        {formatTime(msg.createdAt)}
      </span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LiveChat() {
  // ── Persist open/view state qua reload ──────────────────────────────────────
  const [open, setOpen] = useState(() => localStorage.getItem('chatOpen') === 'true')
  const [view, setView] = useState(() => localStorage.getItem('chatView') || 'home')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTypingAgent, setIsTypingAgent] = useState(false)
  const [unread, setUnread] = useState(0)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [conversation, setConversation] = useState(null)
  const [isResolved, setIsResolved] = useState(false)
  const [sessionId, setSessionId] = useState(getSessionId)

  // Sync open/view vào localStorage
  const handleSetOpen = (val) => { setOpen(val); localStorage.setItem('chatOpen', String(val)) }
  const handleSetView = (val) => { setView(val); localStorage.setItem('chatView', val) }

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimer = useRef(null)
  const typingSocketTimer = useRef(null)

  const clientUser = useSelector(state => state.clientUser?.user)
  const senderName = clientUser?.fullName || clientUser?.name || 'Khách'
  const senderAvatar = clientUser?.avatar || null
  const senderId = clientUser?._id || null

  // ─── Load history ──────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/history/${sessionId}?internal=false`, { credentials: 'include' })
      const data = await res.json()
      if (data?.success) {
        setMessages(data.data || [])
        setHistoryLoaded(true)
      }
    } catch { setHistoryLoaded(true) }
  }, [sessionId])

  const loadConversation = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversation/${sessionId}`, { credentials: 'include' })
      const data = await res.json()
      if (data?.success && data.data) {
        setConversation(data.data)
        setIsResolved(data.data.status === 'resolved')
      }
    } catch { /* skip */ }
  }, [sessionId])

  // ─── Socket ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()

    const joinRoom = () => socket.emit('chat:join', { sessionId })
    joinRoom()
    socket.on('connect', joinRoom)

    const onMessage = (msg) => {
      setMessages(prev => prev.some(m => m._id?.toString() === msg._id?.toString()) ? prev : [...prev, msg])
      if (msg.sender === 'agent' && !open) setUnread(u => u + 1)
      if (msg.type === 'system') setConversation(prev => prev ? { ...prev } : prev)
    }
    const onTyping = ({ isTyping }) => {
      setIsTypingAgent(isTyping)
      clearTimeout(typingTimer.current)
      if (isTyping) typingTimer.current = setTimeout(() => setIsTypingAgent(false), 3500)
    }
    const onResolved = () => setIsResolved(true)
    const onConvUpdated = (conv) => { if (conv.sessionId === sessionId) setConversation(conv) }

    socket.on('chat:message', onMessage)
    socket.on('chat:typing', onTyping)
    socket.on('chat:resolved', onResolved)
    socket.on('chat:conversation_updated', onConvUpdated)

    return () => {
      socket.off('connect', joinRoom)
      socket.off('chat:message', onMessage)
      socket.off('chat:typing', onTyping)
      socket.off('chat:resolved', onResolved)
      socket.off('chat:conversation_updated', onConvUpdated)
    }
  }, [sessionId, open])

  useEffect(() => {
    if (open && view === 'chat') {
      loadHistory()
      loadConversation()
      setUnread(0)
    }
  }, [open, view, loadHistory, loadConversation])

  useEffect(() => {
    if (open && view === 'chat') {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    }
  }, [messages, open, view, isTypingAgent])

  // ─── Gửi tin nhắn ──────────────────────────────────────────────────────────
  const sendMessage = (text) => {
    const t = (text || input).trim()
    if (!t) return
    const socket = getSocket()
    socket.emit('chat:join', { sessionId })
    socket.emit('chat:send', {
      sessionId,
      message: t,
      senderName,
      senderAvatar,
      senderId,
      currentPage: window.location.pathname
    })
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    inputRef.current?.focus()
  }

  // Bắt đầu cuộc trò chuyện MỚI (khi resolved)
  const startNewConversation = () => {
    const newSid = newSessionId()
    setSessionId(newSid)
    setMessages([])
    setConversation(null)
    setIsResolved(false)
    setHistoryLoaded(false)
    // Join room mới
    const socket = getSocket()
    socket.emit('chat:join', { sessionId: newSid })
    handleSetView('chat')
  }

  // Emit typing event debounced
  const handleInputChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'

    const socket = getSocket()
    socket.emit('chat:typing', { sessionId, isTyping: true, role: 'customer' })
    clearTimeout(typingSocketTimer.current)
    typingSocketTimer.current = setTimeout(() => {
      socket.emit('chat:typing', { sessionId, isTyping: false, role: 'customer' })
    }, 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  // Group messages để tránh hiện avatar liên tục
  const groupedMessages = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1]
    const showAvatar = !prev || prev.sender !== msg.sender || msg.type === 'system'
    return [...acc, { ...msg, showAvatar }]
  }, [])

  // ─── Assigned agent info ───────────────────────────────────────────────────
  const assignedAgent = conversation?.assignedAgent?.agentName
    ? conversation.assignedAgent
    : null

  // Wrapper để cả open và view thay đổi đồng thời persist vào localStorage
  const openChat = () => { handleSetOpen(true); handleSetView('chat') }

  return (
    <>
      {/* ── Trigger Button ──────────────────────────────────────────────── */}
      {!open && (
        <button
          onClick={() => handleSetOpen(true)}
          className="fixed bottom-8 left-6 z-[1000] w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center transition-all active:scale-95 hover:scale-110 hover:shadow-blue-500/50"
        >
          <MessageCircle className="w-6 h-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      )}

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-6 left-6 z-[1000] w-[360px] h-[530px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-200 dark:border-gray-800 overflow-hidden">

          {/* ── HOME VIEW ─────────────────────────────────────────────── */}
          {view === 'home' && (
            <>
              {/* Header gradient */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 pt-6 pb-16 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold text-base">SmartMall Support</span>
                  <button onClick={() => handleSetOpen(false)} className="text-white/70 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-white/90 text-sm">Xin chào! 👋</p>
                <p className="text-blue-100 text-xs mt-1">Chúng tôi thường trả lời trong vài phút.</p>
              </div>

              {/* Conversation card overlapping */}
              <div className="flex-1 overflow-y-auto px-4 -mt-10">
                {/* Start chat card */}
                <div
                  onClick={() => openChat()}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">
                        {assignedAgent ? assignedAgent.agentName : 'SmartMall Support'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                        {messages.length > 0
                          ? messages[messages.length - 1].message
                          : 'Bắt đầu cuộc trò chuyện...'
                        }
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">Câu hỏi thường gặp</p>
                <div className="space-y-2">
                  {QUICK_ACTIONS.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => { openChat(); setTimeout(() => sendMessage(qa.text), 200) }}
                      className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-sm text-gray-700 dark:text-gray-300 transition-colors border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom: new conversation button */}
              <div className="p-4 flex-shrink-0">
                <button
                  onClick={() => setView('chat')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Bắt đầu chat
                </button>
              </div>
            </>
          )}

          {/* ── CHAT VIEW ─────────────────────────────────────────────── */}
          {view === 'chat' && (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => handleSetView('home')}
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
                <button onClick={() => handleSetOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50 dark:bg-gray-950 min-h-0">
                {/* Welcome banner khi chưa có tin nhắn */}
                {historyLoaded && messages.filter(m => m.type !== 'system').length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-7 h-7 text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bắt đầu cuộc trò chuyện</p>
                    <p className="text-xs text-gray-400 mt-1">Đội ngũ hỗ trợ sẽ phản hồi sớm nhất có thể</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {QUICK_ACTIONS.slice(0, 3).map((qa, i) => (
                        <button key={i} onClick={() => sendMessage(qa.text)}
                          className="text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedMessages.map((msg, i) => (
                  <MessageBubble key={msg._id || i} msg={msg} showAvatar={msg.showAvatar} />
                ))}

                {/* Typing indicator */}
                {isTypingAgent && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Resolved banner + New conversation */}
              {isResolved && (
                <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-100 dark:border-green-800 flex-shrink-0">
                  <p className="text-xs text-green-700 dark:text-green-400 text-center mb-2">
                    ✅ Cuộc trò chuyện đã được giải quyết
                  </p>
                  <button
                    onClick={startNewConversation}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Bắt đầu cuộc trò chuyện mới
                  </button>
                </div>
              )}

              {/* Input */}
              {!isResolved && (
                <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                  <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-colors">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 leading-relaxed"
                      style={{ maxHeight: '80px', overflowY: 'auto' }}
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
