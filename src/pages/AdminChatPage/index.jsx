import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  MessageCircle, Send, Bot, User, Circle, RefreshCw, Search,
  CheckCircle, Clock, Inbox, UserCheck, AlertCircle,
  Lock, Globe, ArrowLeft, ImagePlus, Loader2, X
} from 'lucide-react'
import { message as antdMessage } from 'antd'
import { getSocket } from '@/services/socketService'
import { chatService } from '@/services/chatService'
import { createClientTempId, hasChatImages, isSameOptimisticImageMessage, revokeChatImageUrls } from '@/utils/chatMessage'
import { renderTextWithLinks } from '@/utils/renderTextWithLinks'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
dayjs.extend(relativeTime)
dayjs.locale('vi')

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}/${path}`, { credentials: 'include', ...options })
  return res.json()
}

const revokePreviewUrl = (url) => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

const getMessagePreview = (msg) => msg.type === 'image' || msg.imageUrl ? '[Ảnh]' : (msg.message || '')

const ChatImage = ({ src, alt }) => (
  <a href={src} target="_blank" rel="noreferrer" className="block">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="block max-h-80 w-auto max-w-[260px] rounded-2xl object-cover shadow-sm ring-1 ring-black/5"
    />
  </a>
)

const ImageMessageContent = ({ msg, captionClassName }) => (
  <div className="space-y-2">
    <ChatImage src={msg.imageUrl} alt={msg.message || 'Ảnh chat'} />
    {msg.message ? (
      <div className={captionClassName}>
        {renderTextWithLinks(msg.message, 'underline underline-offset-2 break-all')}
      </div>
    ) : null}
  </div>
)

// ─── Status badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    unassigned: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="w-3 h-3" /> },
    open: { label: 'Đang mở', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Circle className="w-3 h-3 fill-current" /> },
    resolved: { label: 'Đã giải quyết', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-3 h-3" /> }
  }
  const s = map[status] || map.unassigned
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  )
}

// ─── Conversation List Item ───────────────────────────────────────────────────
const ConversationItem = ({ conv, isSelected, onClick }) => {
  const name = conv.customer?.name || 'Khách ẩn danh'
  const initials = name.charAt(0).toUpperCase()
  const unread = conv.unreadByAgent || 0
  const isUnassigned = conv.status === 'unassigned'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50
        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold
          ${isUnassigned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
          {initials}
        </div>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
            {name}
          </span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{dayjs(conv.lastMessageAt || conv.createdAt).fromNow()}</span>
        </div>
        <p className={`text-xs truncate ${unread > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
          {conv.lastMessageSender === 'agent' ? '↩ ' : ''}{conv.lastMessage || 'Chưa có tin nhắn'}
        </p>
        {conv.assignedAgent?.agentName && (
          <p className="text-[10px] text-blue-500 truncate mt-0.5">● {conv.assignedAgent.agentName}</p>
        )}
      </div>
    </button>
  )
}

// ─── Message Bubble (Agent View) ─────────────────────────────────────────────
const AgentMessageBubble = ({ msg }) => {
  const isAgent = msg.sender === 'agent'
  const isCustomer = msg.sender === 'customer' || msg.sender === 'guest'
  const isSystem = msg.type === 'system' || msg.sender === 'system'
  const isNote = msg.type === 'note' || msg.isInternal
  const isImage = msg.type === 'image' && hasChatImages(msg)
  const noteLinkClassName = 'underline underline-offset-2 decoration-amber-400 break-all hover:text-amber-700 dark:hover:text-amber-200'
  const customerLinkClassName = 'underline underline-offset-2 decoration-blue-300 break-all text-blue-600 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-200'
  const agentLinkClassName = 'underline underline-offset-2 decoration-white/70 break-all hover:text-blue-100'

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
          {msg.message}
        </span>
      </div>
    )
  }

  const time = dayjs(msg.createdAt).format('HH:mm')

  if (isNote) {
    return (
      <div className={`flex justify-end ${msg.isOptimistic ? 'opacity-60' : ''}`}>
        <div className="max-w-[70%] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap break-words">
          <div className="flex items-center gap-1 mb-1 text-[10px] text-amber-500 font-medium">
            <Lock className="w-3 h-3" /> Ghi chú nội bộ {!msg.isOptimistic && `· ${time}`}
          </div>
          {renderTextWithLinks(msg.message, noteLinkClassName)}
        </div>
      </div>
    )
  }

  if (isCustomer) {
    return (
      <div className="flex items-end gap-2 group">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mb-0.5">
          {(msg.senderName || 'K')[0].toUpperCase()}
        </div>
        <div className="max-w-[65%]">
          <p className="text-[10px] text-gray-400 mb-0.5 ml-1">{msg.senderName}</p>
          {isImage ? (
            <ImageMessageContent
              msg={msg}
              captionClassName="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm shadow-sm border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words"
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm shadow-sm border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words">
              {renderTextWithLinks(msg.message, customerLinkClassName)}
            </div>
          )}
        </div>
        <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-0.5">{time}</span>
      </div>
    )
  }

  if (isAgent) {
    return (
      <div className={`flex items-end gap-2 justify-end group ${msg.isOptimistic ? 'opacity-60' : ''}`}>
        {!msg.isOptimistic && (
          <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-0.5">{time}</span>
        )}
        <div className="max-w-[65%]">
          {isImage ? (
            <ImageMessageContent
              msg={msg}
              captionClassName="w-fit bg-blue-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm shadow-sm whitespace-pre-wrap break-words"
            />
          ) : (
            <div className="w-fit bg-blue-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm shadow-sm whitespace-pre-wrap break-words">
              {renderTextWithLinks(msg.message, agentLinkClassName)}
            </div>
          )}
        </div>
        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mb-0.5">
          <Bot className="w-4 h-4" />
        </div>
      </div>
    )
  }
  return null
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'unassigned', label: 'Chờ xử lý', icon: <Inbox className="w-3.5 h-3.5" /> },
  { key: 'mine', label: 'Của tôi', icon: <UserCheck className="w-3.5 h-3.5" /> },
  { key: 'open', label: 'Tất cả', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { key: 'resolved', label: 'Đã xong', icon: <CheckCircle className="w-3.5 h-3.5" /> },
]

export default function AdminChatPage() {
  const [activeTab, setActiveTab] = useState('unassigned')
  const [conversations, setConversations] = useState([])
  const [counts, setCounts] = useState({})
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isNote, setIsNote] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customerTyping, setCustomerTyping] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const typingTimerRef = useRef(null)
  const pendingImageRef = useRef(null)
  // Refs để socket handlers có thể đọc giá trị mới nhất mà không cần re-register
  const selectedSessionRef = useRef(null)
  const activeTabRef = useRef('unassigned')
  const agentIdRef = useRef(null)

  const admin = useSelector(s => s.user?.user)
  const agentId = admin?._id || null
  const agentName = admin?.fullName || admin?.name || 'Agent'
  const agentAvatar = admin?.avatar || null

  // Sync refs với state
  useEffect(() => { selectedSessionRef.current = selectedSession }, [selectedSession])
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])
  useEffect(() => { agentIdRef.current = agentId }, [agentId])
  useEffect(() => { pendingImageRef.current = pendingImage }, [pendingImage])
  useEffect(() => () => { revokePreviewUrl(pendingImageRef.current?.previewUrl) }, [])

  // ─── Load conversations ───────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      let statusFilter = activeTab
      if (activeTab === 'mine') statusFilter = 'open'

      const data = await apiFetch(`chat/conversations?status=${statusFilter === 'unassigned' || statusFilter === 'resolved' ? statusFilter : 'open'}`)
      let list = data.data || []

      if (activeTab === 'mine') {
        list = list.filter(c => c.assignedAgent?.agentId === agentId)
      }

      setConversations(list)
    } catch { /* skip */ }
  }, [activeTab, agentId])

  const loadCounts = useCallback(async () => {
    try {
      const [u, o, r] = await Promise.all([
        apiFetch('chat/conversations?status=unassigned&limit=1000'),
        apiFetch('chat/conversations?status=open&limit=1000'),
        apiFetch('chat/conversations?status=resolved&limit=1000')
      ])
      const openList = o.data || []
      const mine = openList.filter(c => c.assignedAgent?.agentId === agentId).length
      setCounts({
        unassigned: (u.data || []).length,
        mine,
        open: openList.length,
        resolved: (r.data || []).length
      })
    } catch { /* skip */ }
  }, [agentId])

  const loadHistory = useCallback(async (sessionId) => {
    try {
      const data = await apiFetch(`chat/history/${sessionId}?internal=true`)
      setMessages(data.data || [])
    } catch { /* skip */ }
  }, [])

  useEffect(() => { loadConversations() }, [loadConversations])
  useEffect(() => { loadCounts() }, [loadCounts])

  // ─── Socket: chỉ setup 1 lần khi mount ───────────────────────────────────
  useEffect(() => {
    // LayoutAdmin đã gọi connectSocket(role:'admin') — chỉ cần getSocket
    const socket = getSocket()
    // Đảm bảo đang trong agents room
    if (socket.connected) {
      socket.emit('join', { role: 'admin' })
    } else {
      socket.once('connect', () => socket.emit('join', { role: 'admin' }))
    }

    const onNewConv = (conv) => {
      // Chỉ add vào list nếu đang ở tab unassigned
      if (activeTabRef.current === 'unassigned') {
        setConversations(prev => {
          if (prev.find(c => c.sessionId === conv.sessionId)) return prev
          return [conv, ...prev]
        })
      }
      loadCounts()
    }

    const handleUpdateMessages = (msg) => {
      // Thêm vào chat nếu đang xem session này
      if (selectedSessionRef.current === msg.sessionId) {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev
          if (msg.sender === 'agent' || msg.type === 'note' || msg.isInternal) {
            const index = prev.findIndex(m =>
              m.isOptimistic &&
              (
                (msg.clientTempId && m.clientTempId === msg.clientTempId) ||
                (msg.type === 'image' && m.type === 'image' && m.imageUrl === msg.imageUrl) ||
                (msg.type === 'image' && m.type === 'image' && isSameOptimisticImageMessage(m, msg)) ||
                ((msg.type !== 'image' || !msg.imageUrl) && m.message === msg.message)
              )
            )
            if (index !== -1) {
              const clone = [...prev]
              revokeChatImageUrls(clone[index])
              clone[index] = msg
              return clone
            }
          }
          return [...prev, msg]
        })
      }
    }

    const onNewMsg = (msg) => {
      // Cập nhật lastMessage trong list
      setConversations(prev =>
        prev.map(c => c.sessionId === msg.sessionId
          ? { ...c, lastMessage: getMessagePreview(msg), lastMessageAt: msg.createdAt, lastMessageSender: msg.sender, unreadByAgent: selectedSessionRef.current === msg.sessionId ? 0 : (c.unreadByAgent || 0) + (msg.sender === 'customer' ? 1 : 0) }
          : c
        ).sort((a, b) => new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt))
      )
      handleUpdateMessages(msg)
    }

    const onMessage = (msg) => {
      handleUpdateMessages(msg)
      if (msg.sender !== 'customer') {
        setConversations(prev =>
          prev.map(c => c.sessionId === msg.sessionId
            ? { ...c, lastMessage: getMessagePreview(msg), lastMessageAt: msg.createdAt, lastMessageSender: msg.sender }
            : c
          ).sort((a, b) => new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt))
        )
      }
      if (selectedSessionRef.current !== msg.sessionId && msg.sender === 'customer') {
        // Cập nhật unread count trong list
        setConversations(prev =>
          prev.map(c => c.sessionId === msg.sessionId
            ? { ...c, unreadByAgent: (c.unreadByAgent || 0) + 1 }
            : c
          )
        )
      }
    }

    const onConvUpdated = (conv) => {
      setConversations(prev => {
        const tab = activeTabRef.current
        const aid = agentIdRef.current
        const updated = prev.map(c => c.sessionId === conv.sessionId ? { ...c, ...conv } : c)
        // Lọc theo tab hiện tại
        return updated.filter(c => {
          if (tab === 'unassigned') return c.status === 'unassigned'
          if (tab === 'mine') return c.status === 'open' && c.assignedAgent?.agentId === aid
          if (tab === 'open') return c.status === 'open'
          if (tab === 'resolved') return c.status === 'resolved'
          return true
        })
      })
      setSelectedConv(prev => prev?.sessionId === conv.sessionId ? { ...prev, ...conv } : prev)
      loadCounts()
    }

    const onCustomerTyping = ({ sessionId, isTyping }) => {
      if (selectedSessionRef.current === sessionId) {
        setCustomerTyping(isTyping)
        clearTimeout(typingTimerRef.current)
        if (isTyping) typingTimerRef.current = setTimeout(() => setCustomerTyping(false), 3500)
      }
    }

    socket.on('chat:new_conversation', onNewConv)
    socket.on('chat:new_message', onNewMsg)
    socket.on('chat:message', onMessage)
    socket.on('chat:conversation_updated', onConvUpdated)
    socket.on('chat:customer_typing', onCustomerTyping)

    return () => {
      socket.off('chat:new_conversation', onNewConv)
      socket.off('chat:new_message', onNewMsg)
      socket.off('chat:message', onMessage)
      socket.off('chat:conversation_updated', onConvUpdated)
      socket.off('chat:customer_typing', onCustomerTyping)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // chỉ chạy 1 lần khi mount

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, customerTyping])

  // ─── Actions ──────────────────────────────────────────────────────────────
  const selectConversation = async (conv) => {
    clearPendingImage()
    setSelectedSession(conv.sessionId)
    setSelectedConv(conv)
    setMessages([])
    setCustomerTyping(false)
    await loadHistory(conv.sessionId)
    const socket = getSocket()
    socket.emit('chat:join', { sessionId: conv.sessionId })
    // Mark read
    await apiFetch(`chat/read/${conv.sessionId}`, { method: 'PATCH', body: JSON.stringify({ reader: 'agent' }), headers: { 'Content-Type': 'application/json' } })
    setConversations(prev => prev.map(c => c.sessionId === conv.sessionId ? { ...c, unreadByAgent: 0 } : c))
  }

  const handleAssign = () => {
    if (!selectedSession) return
    const socket = getSocket()
    socket.emit('chat:assign', { sessionId: selectedSession, agentId, agentName, agentAvatar })
    setSelectedConv(prev => prev ? { ...prev, status: 'open', assignedAgent: { agentId, agentName, agentAvatar, assignedAt: new Date() } } : prev)
  }

  const handleResolve = () => {
    if (!selectedSession) return
    const socket = getSocket()
    socket.emit('chat:resolve', { sessionId: selectedSession, agentName })
    setSelectedConv(prev => prev ? { ...prev, status: 'resolved' } : prev)
  }

  const clearPendingImage = useCallback(({ revoke = true } = {}) => {
    setPendingImage(prev => {
      if (revoke) revokePreviewUrl(prev?.previewUrl)
      return null
    })
    if (imageInputRef.current) imageInputRef.current.value = ''
  }, [])

  const appendOptimisticAgentMessage = (payload) => {
    const clientTempId = payload.clientTempId || createClientTempId()
    const tempId = `temp_${clientTempId}`
    setMessages(prev => [
      ...prev,
      {
        _id: tempId,
        clientTempId,
        sessionId: selectedSession,
        sender: 'agent',
        agentId,
        agentName,
        agentAvatar,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        ...payload
      }
    ])

    return clientTempId
  }

  const removeOptimisticAgentMessage = useCallback((clientTempId) => {
    if (!clientTempId) return

    setMessages(prev => prev.filter(msg => {
      const shouldRemove = msg.isOptimistic && msg.clientTempId === clientTempId
      if (shouldRemove) revokeChatImageUrls(msg)
      return !shouldRemove
    }))
  }, [])

  const emitAgentReply = (payload) => {
    const socket = getSocket()
    socket.emit('chat:agent_reply', {
      sessionId: selectedSession,
      agentId,
      agentName,
      agentAvatar,
      ...payload
    })
  }

  const sendReply = async () => {
    const text = input.trim()
    if ((!text && !pendingImage) || !selectedSession || isUploadingImage) return

    try {
      if (pendingImage) {
        const clientTempId = createClientTempId()

        appendOptimisticAgentMessage({
          clientTempId,
          type: 'image',
          imageUrl: pendingImage.previewUrl,
          message: text,
          isInternal: false
        })

        clearPendingImage({ revoke: false })
        setInput('')
        if (inputRef.current) inputRef.current.style.height = 'auto'
        inputRef.current?.focus()
        setIsUploadingImage(true)

        try {
          const imageUrl = await chatService.uploadImage(pendingImage.file)

          emitAgentReply({
            clientTempId,
            type: 'image',
            imageUrl,
            message: text,
            isInternal: false
          })
        } catch (err) {
          removeOptimisticAgentMessage(clientTempId)
          throw err
        }
      } else {
        const clientTempId = appendOptimisticAgentMessage({
          clientTempId: createClientTempId(),
          message: text,
          type: isNote ? 'note' : 'text',
          isInternal: isNote
        })

        emitAgentReply({ clientTempId, message: text, type: 'text', isInternal: isNote })

        setInput('')
        if (inputRef.current) inputRef.current.style.height = 'auto'
        inputRef.current?.focus()
      }
    } catch (err) {
      antdMessage.error(err.message || 'Không thể tải ảnh lên')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageChange = (e) => {
    const [file] = Array.from(e.target.files || [])
    if (!file || isNote) return

    setPendingImage(prev => {
      revokePreviewUrl(prev?.previewUrl)
      return {
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file)
      }
    })

    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const openImagePicker = () => {
    if (!isNote && !isUploadingImage) imageInputRef.current?.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() }
  }

  const filteredConversations = conversations.filter(c =>
    c.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sessionId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isAssignedToMe = selectedConv?.assignedAgent?.agentId === agentId
  const isResolved = selectedConv?.status === 'resolved'
  const canSend = !!input.trim() || !!pendingImage

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 overflow-hidden relative">

      {/* ── COL 1: Conversation List ──────────────────────────────────────────── */}
      <div className={`${selectedSession ? 'hidden md:flex' : 'flex'} w-full md:w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-800 absolute md:relative h-full z-10 bg-white dark:bg-gray-900`}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 dark:text-white text-base flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Hộp thư
            </h2>
            <button onClick={() => { loadConversations(); loadCounts() }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 outline-none focus:border-blue-400 transition-colors" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-[11px] font-medium flex flex-col items-center gap-0.5 transition-colors relative
                ${activeTab === tab.key ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {counts[tab.key] > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {counts[tab.key] > 99 ? '99+' : counts[tab.key]}
                </span>
              )}
              {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Không có cuộc trò chuyện</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <ConversationItem
                key={conv.sessionId}
                conv={conv}
                isSelected={selectedSession === conv.sessionId}
                onClick={() => selectConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── COL 2: Chat Content ───────────────────────────────────────────────── */}
      {selectedSession ? (
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-100 dark:border-gray-800 h-full">
          {/* Chat Header */}
          <div className="px-3 md:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => setSelectedSession(null)} 
                className="md:hidden p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs md:text-sm font-bold flex items-center justify-center flex-shrink-0">
                {(selectedConv?.customer?.name || 'K')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {selectedConv?.customer?.name || 'Khách ẩn danh'}
                </p>
                <StatusBadge status={selectedConv?.status} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {selectedConv?.status === 'unassigned' && (
                <button onClick={handleAssign}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Nhận chat
                </button>
              )}
              {isAssignedToMe && !isResolved && (
                <button onClick={handleResolve}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Giải quyết
                </button>
              )}
              {isResolved && (
                <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg border border-green-200 dark:border-green-700 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Đã giải quyết
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/50 dark:bg-gray-950 min-h-0">
            {messages.map((msg, i) => <AgentMessageBubble key={msg._id || i} msg={msg} />)}
            {customerTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Note/Reply Toggle + Input */}
          {!isResolved && (
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              {/* Mode toggle */}
              <div className="flex gap-1 mb-3">
                <button onClick={() => setIsNote(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${!isNote ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Send className="w-3 h-3" /> Phản hồi
                </button>
                <button onClick={() => { clearPendingImage(); setIsNote(true) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${isNote ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Lock className="w-3 h-3" /> Ghi chú nội bộ
                </button>
              </div>

              {pendingImage && !isNote && (
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 dark:border-blue-900/40 dark:bg-blue-950/30">
                  <div className="h-16 w-16 overflow-hidden rounded-lg ring-1 ring-black/5">
                    <img src={pendingImage.previewUrl} alt={pendingImage.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                      Ảnh đính kèm
                    </p>
                    <p className="truncate text-xs text-gray-600 dark:text-gray-300">{pendingImage.name}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                      Ảnh sẽ được gửi khi bấm Send
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearPendingImage}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-white hover:text-red-500 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-red-400 transition-colors"
                    title="Xóa ảnh đính kèm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className={`flex items-end gap-3 rounded-xl px-4 py-3 border transition-colors
                ${isNote ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-within:border-blue-400'}`}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={openImagePicker}
                  disabled={isNote || isUploadingImage}
                  title={isNote ? 'Chỉ gửi ảnh ở chế độ phản hồi' : (pendingImage ? 'Đổi ảnh đính kèm' : 'Đính kèm ảnh')}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-600 transition-colors"
                >
                  {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                </button>
                <textarea ref={inputRef} rows={1} value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
                  onKeyDown={handleKeyDown}
                  placeholder={isNote ? '📝 Ghi chú (chỉ agent thấy)...' : (pendingImage ? 'Thêm lời nhắn cho ảnh... (Enter để gửi)' : 'Nhập phản hồi... (Enter để gửi)')}
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 leading-relaxed"
                  style={{ maxHeight: '100px', overflowY: 'auto' }}
                />
                <button onClick={sendReply} disabled={!canSend || isUploadingImage}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:cursor-not-allowed
                    ${isNote ? 'bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400'}`}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {!isAssignedToMe && selectedConv?.status === 'unassigned' && (
                <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Nhận chat trước khi phản hồi khách hàng
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-blue-300" />
            </div>
            <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 mb-1">Chọn cuộc trò chuyện</h3>
            <p className="text-sm text-gray-400">Chọn một cuộc hội thoại từ danh sách để bắt đầu</p>
          </div>
        </div>
      )}

      {/* ── COL 3: Customer Info ──────────────────────────────────────────────── */}
      {selectedConv && (
        <div className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0 overflow-y-auto bg-white dark:bg-gray-900 h-full">
          {/* Customer Profile */}
          <div className="px-5 py-6 border-b border-gray-100 dark:border-gray-800 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
              {(selectedConv.customer?.name || 'K')[0].toUpperCase()}
            </div>
            <p className="font-bold text-gray-800 dark:text-white">{selectedConv.customer?.name || 'Khách ẩn danh'}</p>
            <StatusBadge status={selectedConv.status} />
          </div>

          {/* Info Sections */}
          <div className="p-4 space-y-4">
            {/* Conversation Info */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Thông tin hội thoại</p>
              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400">Bắt đầu</p>
                    <p className="text-gray-700 dark:text-gray-300">{dayjs(selectedConv.createdAt).format('DD/MM HH:mm')}</p>
                  </div>
                </div>
                {selectedConv.firstReplyAt && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400">Phản hồi đầu tiên</p>
                      <p className="text-gray-700 dark:text-gray-300">{dayjs(selectedConv.firstReplyAt).format('DD/MM HH:mm')}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400">Số tin nhắn</p>
                    <p className="text-gray-700 dark:text-gray-300">{selectedConv.messageCount || messages.length}</p>
                  </div>
                </div>
                {selectedConv.customer?.currentPage && (
                  <div className="flex items-start gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-400">Trang hiện tại</p>
                      <p className="text-gray-700 dark:text-gray-300 text-[11px] break-all line-clamp-2" title={selectedConv.customer.currentPage}>
                        {selectedConv.customer.currentPage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Agent */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Agent phụ trách</p>
              {selectedConv.assignedAgent?.agentName ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {selectedConv.assignedAgent.agentName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{selectedConv.assignedAgent.agentName}</p>
                    <p className="text-[10px] text-gray-400">{dayjs(selectedConv.assignedAgent.assignedAt).fromNow()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs">Chưa được phân công</span>
                </div>
              )}
            </div>

            {/* Quick Actions for Agent */}
            {!isResolved && (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Hành động nhanh</p>
                {selectedConv.status === 'unassigned' && (
                  <button onClick={handleAssign} className="w-full text-left px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                    <UserCheck className="w-3.5 h-3.5" /> Nhận cuộc trò chuyện
                  </button>
                )}
                {isAssignedToMe && (
                  <button onClick={handleResolve} className="w-full text-left px-3 py-2.5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" /> Đánh dấu đã giải quyết
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
