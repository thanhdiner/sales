import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Component imports
import Launcher from './Launcher'
import HomeView from './HomeView'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ChatResolved from './ChatResolved'
import OrderTrackingModal from './OrderTrackingModal'

// Helpers & Hooks
import { QUICK_ACTIONS } from '@/helpers/chatConstants'
import { groupMessages } from '@/utils/chatMessage'
import { useChatSession } from '@/hooks/useChatSession'
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
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false)

  // 2. Data State & Handlers
  const { 
    messages, setMessages, 
    historyLoaded, setHistoryLoaded, 
    conversation, setConversation, 
    isResolved, setIsResolved 
  } = useChatData(sessionId, open, view, setUnread)

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
  } = useChatInput({ sessionId, clientUser, setMessages })

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
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleStartNewConversation = () => {
    startNewConversation({ setMessages, setConversation, setIsResolved, setHistoryLoaded })
  }

  const ensureLoggedIn = () => {
    const hasToken = Boolean(getClientAccessToken() || getClientAccessTokenSession())
    const isLoggedIn = Boolean(clientUser?._id || clientUser?.id || hasToken)

    if (isLoggedIn) return true

    message.info('Vui lòng đăng nhập để sử dụng chat hỗ trợ!')
    setOpen(false)
    setView('home')
    navigate('/user/login')
    return false
  }

  const openChat = () => {
    if (!ensureLoggedIn()) return
    setOpen(true)
    setView('chat')
  }

  const handleOpenLauncher = () => {
    if (!ensureLoggedIn()) return
    setOpen(true)
  }

  const handleQuickAction = (qa) => {
    if (!ensureLoggedIn()) return

    if (qa.type === 'modal' && qa.actionId === 'order-tracking') {
      setOpen(false)
      setIsOrderTrackingOpen(true)
      return
    }

    openChat()
    setTimeout(() => sendMessage(qa.text), 200)
  }
  
  // 8. Derived Data
  const groupedMessages = groupMessages(messages)
  const assignedAgent = conversation?.assignedAgent?.agentName ? conversation.assignedAgent : null

  return (
    <>
      {/* ── Chat Launcher (Floating Button) ────────────────────────────────── */}
      {!open && (
        <Launcher 
          onClick={handleOpenLauncher}
          unread={unread} 
        />
      )}

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom left' }}
            className="fixed bottom-4 left-4 z-[1050] flex h-[530px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] dark:border-gray-800 dark:bg-gray-900 md:bottom-5 md:left-5 lg:bottom-6 lg:left-6"
          >
            {/* ── HOME VIEW ─────────────────────────────────────────────── */}
            {view === 'home' && (
              <HomeView 
                onClose={() => setOpen(false)}
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
                  onClose={() => setOpen(false)}
                  assignedAgent={assignedAgent}
                  isResolved={isResolved}
                />

                <MessageList 
                  historyLoaded={historyLoaded}
                  messages={messages}
                  quickActions={QUICK_ACTIONS}
                  onSendMessage={sendMessage}
                  groupedMessages={groupedMessages}
                  isTypingAgent={isTypingAgent}
                  isBotTyping={isBotTyping}
                  containerRef={containerRef}
                  bottomRef={bottomRef}
                  showScrollToBottom={showScrollToBottom}
                  onScrollToBottom={scrollToBottom}
                />

                {isResolved && (
                  <ChatResolved onStartNewConversation={handleStartNewConversation} />
                )}

                {!isResolved && (
                  <MessageInput 
                    input={input}
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onSendMessage={() => sendMessage()}
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

