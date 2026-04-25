import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bot, X } from 'lucide-react'

// Component imports
import FloatingButtons from '@/components/FloatingButtons'
import HomeView from './HomeView'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ChatResolved from './ChatResolved'
import OrderTrackingModal from './OrderTrackingModal'

// Helpers & Hooks
import { QUICK_ACTIONS } from '@/helpers/chatConstants'
import { groupMessages } from '@/utils/chatMessage'
import { isSessionResolved, markSessionResolved, useChatSession } from '@/hooks/useChatSession'
import { useChatData } from '@/hooks/useChatData'
import { useChatInput } from '@/hooks/useChatInput'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'

export default function LiveChat() {
  const clientUser = useSelector(state => state.clientUser?.user)
  const navigate = useNavigate()

  // 1. Session State
  const { open, setOpen, view, setView, sessionId, startNewConversation } = useChatSession()
  const [unread, setUnread] = useState(0)
  const [isMinimized, setIsMinimized] = useState(() => localStorage.getItem('chatVisible') === 'true')
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false)

  // 2. Data State & Handlers
  const { 
    messages, setMessages, 
    historyLoaded, setHistoryLoaded, 
    conversation, setConversation, 
    isResolved, setIsResolved 
  } = useChatData(sessionId, open, view, setUnread)
  const currentConversationResolved = isResolved || conversation?.status === 'resolved' || isSessionResolved(sessionId)

  const handleResolvedSendAttempt = (closedConversation) => {
    if (closedConversation) setConversation(closedConversation)
    markSessionResolved(closedConversation?.sessionId || sessionId)
    setIsResolved(true)
  }

  // 3. Input State & Handlers
  const { 
    input, 
    inputRef, 
    sendMessage, 
    handleInputChange,
    imageInputRef,
    handleImageChange,
    openImagePicker,
    clearPendingImages,
    removePendingImage,
    pendingImages,
    canSend,
    isUploadingImage,
    maxImages
  } = useChatInput({
    sessionId,
    clientUser,
    setMessages,
    isResolved: currentConversationResolved,
    onResolvedSendAttempt: handleResolvedSendAttempt
  })

  // 4. Socket State (Typing indicators)
  const [isTypingAgent, setIsTypingAgent] = useState(false)
  const [isBotTyping, setIsBotTyping] = useState(false)

  // 5. Connect Socket & Specific Actions
  const { requestHumanAgent, switchToBot } = useChatSocket({
    sessionId, open, setMessages, setUnread, setIsBotTyping, setConversation, setIsTypingAgent, setIsResolved
  })

  // 6. Scroll on new messages
  const {
    bottomRef,
    containerRef,
    showScrollToBottom,
    scrollToBottom
  } = useAutoScroll({
    dependencies: [messages, isTypingAgent, isBotTyping],
    open,
    view
  })

  // 7. Event Handlers
  const handleStartNewConversation = () => (
    startNewConversation({ setMessages, setConversation, setIsResolved, setHistoryLoaded })
  )

  const sendMessageToActiveConversation = (text, currentPage = window.location.pathname) => {
    const targetSessionId = (currentConversationResolved || isSessionResolved(sessionId))
      ? handleStartNewConversation()
      : sessionId
    return sendMessage(text, { currentPage, sessionId: targetSessionId })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessageToActiveConversation() }
  }

  const ensureLoggedIn = () => {
    const hasToken = Boolean(getClientAccessToken() || getClientAccessTokenSession())
    const isLoggedIn = Boolean(clientUser?._id || clientUser?.id || hasToken)

    if (isLoggedIn) return true

    message.info('Vui lòng đăng nhập để sử dụng chat hỗ trợ!')
    closeChat()
    setView('home')
    navigate('/user/login')
    return false
  }

  const openChat = () => {
    if (!ensureLoggedIn()) return
    setOpen(true)
    setIsMinimized(false)
    setView('chat')
  }

  const handleOpenLauncher = () => {
    if (!ensureLoggedIn()) return
    setOpen(true)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const restoreChat = () => {
    setIsMinimized(false)
  }

  const closeChat = () => {
    setIsMinimized(false)
    setOpen(false)
  }

  const handleQuickAction = (qa) => {
    if (!ensureLoggedIn()) return

    if (qa.type === 'modal' && qa.actionId === 'order-tracking') {
      closeChat()
      setIsOrderTrackingOpen(true)
      return
    }

    openChat()
    setTimeout(() => sendMessageToActiveConversation(qa.text), 200)
  }
  
  // 8. Derived Data
  const groupedMessages = groupMessages(messages)
  const assignedAgent = conversation?.assignedAgent?.agentName ? conversation.assignedAgent : null

  return (
    <>
      {/* ── Chat Launcher (Floating Button) ────────────────────────────────── */}
      {!open && (
        <FloatingButtons
          onOpenSupport={handleOpenLauncher}
          supportUnread={unread}
        />
      )}

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && isMinimized && (
          <motion.div
            key="chat-minimized"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-4 right-4 z-[1050] flex w-[calc(100vw-2rem)] max-w-[360px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.16)] dark:border-gray-800 dark:bg-gray-900 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6"
          >
            <button
              type="button"
              onClick={restoreChat}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              aria-label="Mở lại chat"
              title="Mở lại chat"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Bot className="h-4.5 w-4.5 text-white" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {assignedAgent ? assignedAgent.agentName : 'SmartMall Support'}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {currentConversationResolved ? 'Đã giải quyết' : 'Đang hoạt động'}
                </span>
              </span>

              {unread > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={closeChat}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Đóng chat"
              title="Đóng chat"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {open && !isMinimized && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-4 right-4 z-[1050] flex h-[530px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] dark:border-gray-800 dark:bg-gray-900 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6"
          >
            {/* ── HOME VIEW ─────────────────────────────────────────────── */}
            {view === 'home' && (
              <HomeView 
                onClose={closeChat}
                onMinimize={minimizeChat}
                onOpenChat={openChat}
                assignedAgent={assignedAgent}
                messages={messages}
                unread={unread}
                quickActions={QUICK_ACTIONS}
                onQuickAction={handleQuickAction}
              />
            )}

            {/* ── CHAT VIEW ─────────────────────────────────────────────── */}
            {view === 'chat' && (
              <>
                <ChatHeader 
                  onBack={() => setView('home')}
                  onMinimize={minimizeChat}
                  onClose={closeChat}
                  assignedAgent={assignedAgent}
                  isResolved={currentConversationResolved}
                />

                <MessageList 
                  historyLoaded={historyLoaded}
                  messages={messages}
                  quickActions={QUICK_ACTIONS}
                  onSendMessage={sendMessageToActiveConversation}
                  groupedMessages={groupedMessages}
                  isTypingAgent={isTypingAgent}
                  isBotTyping={isBotTyping}
                  containerRef={containerRef}
                  bottomRef={bottomRef}
                  showScrollToBottom={showScrollToBottom}
                  onScrollToBottom={scrollToBottom}
                />

                {currentConversationResolved && (
                  <ChatResolved onStartNewConversation={handleStartNewConversation} />
                )}

                {!currentConversationResolved && (
                  <MessageInput 
                    input={input}
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onSendMessage={() => sendMessageToActiveConversation()}
                    onImageChange={handleImageChange}
                    onOpenImagePicker={openImagePicker}
                    onRemovePendingImage={removePendingImage}
                    onClearPendingImages={clearPendingImages}
                    messages={messages}
                    conversation={conversation}
                    onSwitchToBot={switchToBot}
                    onRequestHuman={requestHumanAgent}
                    inputRef={inputRef}
                    imageInputRef={imageInputRef}
                    pendingImages={pendingImages}
                    canSend={canSend}
                    isUploadingImage={isUploadingImage}
                    maxImages={maxImages}
                  />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order Tracking Modal ────────────────────────────────────────── */}
      <OrderTrackingModal 
        isOpen={isOrderTrackingOpen} 
        onClose={() => setIsOrderTrackingOpen(false)} 
      />
    </>
  )
}

