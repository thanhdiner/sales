import React, { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
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
import ImagePreviewModal from './ImagePreviewModal'

// Helpers & Hooks
import { getQuickActions } from '@/helpers/chatConstants'
import { applyLocalChatReaction, groupMessages, mergeChatReactionUpdate } from '@/utils/chatMessage'
import { isSessionResolved, markSessionResolved, useChatSession } from '@/hooks/useChatSession'
import { useChatData } from '@/hooks/useChatData'
import { useChatInput } from '@/hooks/useChatInput'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { getClientAccessToken, getClientAccessTokenSession } from '@/utils/auth'
import { getSocket } from '@/services/socketService'
import { chatService } from '@/services/chatService'

const getAgentInitials = name =>
  String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'A'

export default function LiveChat() {
  const { t, i18n } = useTranslation('clientChat')
  const clientUser = useSelector(state => state.clientUser?.user)
  const navigate = useNavigate()
  const quickActions = useMemo(() => getQuickActions(t), [t, i18n.language])

  // 1. Session State
  const { open, setOpen, view, setView, sessionId, startNewConversation } = useChatSession()
  const [unread, setUnread] = useState(0)
  const [isMinimized, setIsMinimized] = useState(() => localStorage.getItem('chatVisible') === 'true')
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [isStartingNewConversation, setIsStartingNewConversation] = useState(false)
  const isChatViewVisible = open && !isMinimized && view === 'chat'

  // 2. Data State & Handlers
  const { 
    messages, setMessages, 
    historyLoaded, setHistoryLoaded, 
    conversation, setConversation, 
    isResolved, setIsResolved 
  } = useChatData(sessionId, isChatViewVisible, view, setUnread)
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
  const [botActivity, setBotActivity] = useState([])

  // 5. Connect Socket & Specific Actions
  const { requestHumanAgent, switchToBot } = useChatSocket({
    sessionId, open: isChatViewVisible, setMessages, setUnread, setIsBotTyping, setBotActivity, setConversation, setIsTypingAgent, setIsResolved
  })

  // 6. Scroll on new messages
  const {
    bottomRef,
    containerRef,
    handleScroll,
    showScrollToBottom,
    newIncomingCount,
    scrollToBottom
  } = useAutoScroll({
    messages,
    dependencies: [isTypingAgent, isBotTyping, botActivity],
    open: isChatViewVisible,
    view
  })

  // 7. Event Handlers
  const startNewConversationSession = () => {
    setUnread(0)
    return startNewConversation({ setMessages, setConversation, setIsResolved, setHistoryLoaded })
  }

  const resolveCurrentConversationBeforeNew = async (closingSessionId) => {
    if (currentConversationResolved || isSessionResolved(closingSessionId)) return null

    if (conversation?._id || messages.some(item => item.type !== 'system')) {
      return chatService.resolveConversation(closingSessionId)
    }

    if (historyLoaded) return null

    const loadedConversation = await chatService.getConversation(closingSessionId)
    if (!loadedConversation || loadedConversation.status === 'resolved') return null

    return chatService.resolveConversation(closingSessionId)
  }

  const handleStartNewConversation = async () => {
    if (isStartingNewConversation) return null

    const closingSessionId = sessionId
    setIsStartingNewConversation(true)

    try {
      const closedConversation = await resolveCurrentConversationBeforeNew(closingSessionId)
      if (closedConversation) {
        markSessionResolved(closingSessionId)
        setConversation(closedConversation)
        setIsResolved(true)
      }
      return startNewConversationSession()
    } catch (error) {
      message.error(error?.message || t('messages.newConversationFailed'))
      return null
    } finally {
      setIsStartingNewConversation(false)
    }
  }

  const sendMessageToActiveConversation = (text, currentPage = window.location.pathname) => {
    const targetSessionId = (currentConversationResolved || isSessionResolved(sessionId))
      ? startNewConversationSession()
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

    message.info(t('auth.loginRequired'))
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

  const handleOpenImagePreview = useCallback(image => {
    setPreviewImage(image)
  }, [])

  const handleCloseImagePreview = useCallback(() => {
    setPreviewImage(null)
  }, [])
  
  // 8. Derived Data
  const groupedMessages = groupMessages(messages)
  const assignedAgent = conversation?.assignedAgent?.agentName ? conversation.assignedAgent : null
  const reactionActor = useMemo(() => ({
    reactorType: 'customer',
    reactorId: String(clientUser?._id || clientUser?.id || sessionId)
  }), [clientUser?._id, clientUser?.id, sessionId])
  const reactorName = clientUser?.fullName || clientUser?.name || t('defaults.you')

  const handleReactToMessage = useCallback((targetMessage, emoji) => {
    if (!targetMessage?._id || targetMessage.isOptimistic) return

    let previousTargetMessage = null
    setMessages(prev => {
      previousTargetMessage = prev.find(message =>
        message?._id?.toString() === targetMessage._id?.toString()
      )
      return applyLocalChatReaction(prev, targetMessage, emoji, reactionActor, reactorName)
    })

    getSocket().emit('chat:reaction', {
      sessionId: targetMessage.sessionId || sessionId,
      messageId: targetMessage._id,
      emoji,
      reactorType: reactionActor.reactorType,
      reactorId: reactionActor.reactorId,
      reactorName
    }, response => {
      if (response?.success === false) {
        if (previousTargetMessage) {
          setMessages(prev => mergeChatReactionUpdate(prev, previousTargetMessage))
        }
        message.error(response.message || t('messages.reactionFailed'))
        return
      }

      if (response?.message) {
        setMessages(prev => mergeChatReactionUpdate(prev, response.message))
      }
    })
  }, [reactionActor, reactorName, sessionId, setMessages, t])

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
              aria-label={t('actions.restore')}
              title={t('actions.restore')}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                {assignedAgent?.agentAvatar
                  ? <img src={assignedAgent.agentAvatar} alt="" className="h-full w-full rounded-full object-cover" />
                  : assignedAgent
                    ? <span className="text-[11px] font-semibold text-white">{getAgentInitials(assignedAgent.agentName)}</span>
                    : <Bot className="h-4.5 w-4.5 text-white" />
                }
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {assignedAgent ? assignedAgent.agentName : t('agent.defaultName')}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {currentConversationResolved ? t('status.resolved') : t('status.active')}
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
              aria-label={t('actions.close')}
              title={t('actions.close')}
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
                quickActions={quickActions}
                onQuickAction={handleQuickAction}
                onStartNewConversation={handleStartNewConversation}
                isStartingNewConversation={isStartingNewConversation}
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
                  onStartNewConversation={handleStartNewConversation}
                  isStartingNewConversation={isStartingNewConversation}
                />

                <MessageList 
                  historyLoaded={historyLoaded}
                  messages={messages}
                  assignedAgent={assignedAgent}
                  quickActions={quickActions}
                  onSendMessage={sendMessageToActiveConversation}
                  groupedMessages={groupedMessages}
                  isTypingAgent={isTypingAgent}
                  isBotTyping={isBotTyping}
                  botActivity={botActivity}
                  containerRef={containerRef}
                  onScroll={handleScroll}
                  bottomRef={bottomRef}
                  showScrollToBottom={showScrollToBottom}
                  newIncomingCount={newIncomingCount}
                  onScrollToBottom={scrollToBottom}
                  onOpenImagePreview={handleOpenImagePreview}
                  reactionActor={reactionActor}
                  onReactToMessage={handleReactToMessage}
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

      <ImagePreviewModal image={previewImage} onClose={handleCloseImagePreview} />
    </>
  )
}

