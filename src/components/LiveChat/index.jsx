import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'

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

export default function LiveChat() {
  const clientUser = useSelector(state => state.clientUser?.user)
  const bottomRef = useRef(null)

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
    handleInputChange 
  } = useChatInput({ sessionId, clientUser, setMessages })

  // 4. Socket State (Typing indicators)
  const [isTypingAgent, setIsTypingAgent] = useState(false)
  const [isBotTyping, setIsBotTyping] = useState(false)

  // 5. Connect Socket & Specific Actions
  const { requestHumanAgent, switchToBot } = useChatSocket({
    sessionId, open, setMessages, setUnread, setIsBotTyping, setConversation, setIsTypingAgent, setIsResolved
  })

  // 6. Scroll on new messages
  useAutoScroll({
    bottomRef,
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

  const openChat = () => { setOpen(true); setView('chat') }
  
  // 8. Derived Data
  const groupedMessages = groupMessages(messages)
  const assignedAgent = conversation?.assignedAgent?.agentName ? conversation.assignedAgent : null

  return (
    <>
      {/* ── Chat Launcher (Floating Button) ────────────────────────────────── */}
      {!open && (
        <Launcher 
          onClick={() => setOpen(true)} 
          unread={unread} 
        />
      )}

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-6 left-6 z-[1000] w-[360px] h-[530px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-200 dark:border-gray-800 overflow-hidden">

          {/* ── HOME VIEW ─────────────────────────────────────────────── */}
          {view === 'home' && (
            <HomeView 
              onClose={() => setOpen(false)}
              onOpenChat={openChat}
              assignedAgent={assignedAgent}
              messages={messages}
              unread={unread}
              quickActions={QUICK_ACTIONS}
              onQuickAction={(qa) => { 
                if (qa.type === 'modal' && qa.actionId === 'order-tracking') {
                  setOpen(false)
                  setIsOrderTrackingOpen(true)
                } else {
                  openChat(); 
                  setTimeout(() => sendMessage(qa.text), 200) 
                }
              }}
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
                bottomRef={bottomRef}
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
                  messages={messages}
                  conversation={conversation}
                  onSwitchToBot={switchToBot}
                  onRequestHuman={requestHumanAgent}
                  inputRef={inputRef}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ── Order Tracking Modal ────────────────────────────────────────── */}
      <OrderTrackingModal 
        isOpen={isOrderTrackingOpen} 
        onClose={() => setIsOrderTrackingOpen(false)} 
      />
    </>
  )
}

