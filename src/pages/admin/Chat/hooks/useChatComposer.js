import { useCallback, useEffect, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'

import { chatService } from '@/services/client/support/chat'
import { getSocket } from '@/services/realtime/socket'
import {
  createClientTempId,
  revokeChatImageUrls
} from '@/utils/chatMessage'

import { revokePreviewUrl } from '../utils'

export function useChatComposer({
  selectedSession,
  selectedSessionRef,
  agentTypingTimerRef,
  agentId,
  agentName,
  agentAvatar,
  canReplyToConversation,
  isResolved,
  inputRef,
  imageInputRef,
  setMessages,
  t
}) {
  const [input, setInput] = useState('')
  const [isNote, setIsNote] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)
  const pendingImageRef = useRef(null)

  const emitAgentTyping = useCallback((isTyping, sessionId = selectedSessionRef.current) => {
    if (!sessionId) return

    getSocket().emit('chat:typing', {
      sessionId,
      isTyping,
      role: 'agent'
    })
  }, [selectedSessionRef])

  const stopAgentTyping = useCallback((sessionId = selectedSessionRef.current) => {
    clearTimeout(agentTypingTimerRef.current)
    emitAgentTyping(false, sessionId)
  }, [agentTypingTimerRef, emitAgentTyping, selectedSessionRef])

  useEffect(() => {
    pendingImageRef.current = pendingImage
  }, [pendingImage])

  useEffect(() => () => {
    revokePreviewUrl(pendingImageRef.current?.previewUrl)
  }, [])

  useEffect(() => () => {
    stopAgentTyping()
  }, [stopAgentTyping])

  const clearPendingImage = useCallback(({ revoke = true } = {}) => {
    setPendingImage(prevImage => {
      if (revoke) {
        revokePreviewUrl(prevImage?.previewUrl)
      }

      return null
    })

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }, [imageInputRef])

  const focusInputWithoutScroll = useCallback(() => {
    const currentInput = inputRef.current
    if (!currentInput) {
      return
    }

    try {
      currentInput.focus({ preventScroll: true })
    } catch {
      currentInput.focus()
    }
  }, [inputRef])

  const appendOptimisticAgentMessage = useCallback((payload) => {
    const clientTempId = payload.clientTempId || createClientTempId()
    const tempId = `temp_${clientTempId}`

    setMessages(prevMessages => [
      ...prevMessages,
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
  }, [agentAvatar, agentId, agentName, selectedSession, setMessages])

  const removeOptimisticAgentMessage = useCallback((clientTempId) => {
    if (!clientTempId) {
      return
    }

    setMessages(prevMessages =>
      prevMessages.filter(message => {
        const shouldRemove = message.isOptimistic && message.clientTempId === clientTempId
        if (shouldRemove) {
          revokeChatImageUrls(message)
        }

        return !shouldRemove
      })
    )
  }, [setMessages])

  const emitAgentReply = useCallback((payload) => {
    const socket = getSocket()

    socket.emit('chat:agent_reply', {
      sessionId: selectedSession,
      agentId,
      agentName,
      agentAvatar,
      ...payload
    })
  }, [agentAvatar, agentId, agentName, selectedSession])

  const canSend = (!!input.trim() || !!pendingImage) && canReplyToConversation && !isResolved

  const scheduleAgentTyping = useCallback((value) => {
    const sessionId = selectedSessionRef.current

    if (!sessionId || isNote || isResolved || !canReplyToConversation || !String(value || '').trim()) {
      stopAgentTyping(sessionId)
      return
    }

    emitAgentTyping(true, sessionId)
    clearTimeout(agentTypingTimerRef.current)
    agentTypingTimerRef.current = window.setTimeout(() => {
      emitAgentTyping(false, sessionId)
    }, 2000)
  }, [
    agentTypingTimerRef,
    canReplyToConversation,
    emitAgentTyping,
    isNote,
    isResolved,
    selectedSessionRef,
    stopAgentTyping
  ])

  useEffect(() => {
    if (isNote || isResolved || !canReplyToConversation) {
      stopAgentTyping()
    }
  }, [canReplyToConversation, isNote, isResolved, stopAgentTyping])

  const sendReply = useCallback(async () => {
    const text = input.trim()
    if ((!text && !pendingImage) || !selectedSession || isUploadingImage || !canReplyToConversation || isResolved) {
      return
    }

    stopAgentTyping(selectedSession)

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

        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
        }

        focusInputWithoutScroll()
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
        } catch (error) {
          removeOptimisticAgentMessage(clientTempId)
          throw error
        }
      } else {
        const clientTempId = appendOptimisticAgentMessage({
          clientTempId: createClientTempId(),
          message: text,
          type: isNote ? 'note' : 'text',
          isInternal: isNote
        })

        emitAgentReply({
          clientTempId,
          message: text,
          type: 'text',
          isInternal: isNote
        })

        setInput('')

        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
        }

        focusInputWithoutScroll()
      }
    } catch (error) {
      antdMessage.error(error.message || t('errors.uploadImageFailed'))
    } finally {
      setIsUploadingImage(false)
    }
  }, [
    appendOptimisticAgentMessage,
    canReplyToConversation,
    clearPendingImage,
    emitAgentReply,
    focusInputWithoutScroll,
    input,
    inputRef,
    isNote,
    isResolved,
    isUploadingImage,
    pendingImage,
    removeOptimisticAgentMessage,
    selectedSession,
    stopAgentTyping,
    t
  ])

  const handleImageChange = useCallback((event) => {
    const [file] = Array.from(event.target.files || [])
    if (!file || isNote) {
      return
    }

    setPendingImage(prevImage => {
      revokePreviewUrl(prevImage?.previewUrl)
      return {
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file)
      }
    })

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }, [imageInputRef, isNote])

  const openImagePicker = useCallback(() => {
    if (!isNote && !isUploadingImage && canReplyToConversation) {
      imageInputRef.current?.click()
    }
  }, [canReplyToConversation, imageInputRef, isNote, isUploadingImage])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendReply()
    }
  }, [sendReply])

  const handleComposerChange = useCallback((event) => {
    const nextValue = event.target.value

    setInput(nextValue)
    event.target.style.height = 'auto'
    event.target.style.height = `${Math.min(event.target.scrollHeight, 100)}px`
    scheduleAgentTyping(nextValue)
  }, [scheduleAgentTyping])

  const switchToReplyMode = useCallback(() => {
    setIsNote(false)
  }, [])

  const switchToNoteMode = useCallback(() => {
    clearPendingImage()
    setIsNote(true)
  }, [clearPendingImage])

  return {
    input,
    setInput,
    isNote,
    isUploadingImage,
    pendingImage,
    canSend,
    emitAgentTyping,
    stopAgentTyping,
    focusInputWithoutScroll,
    clearPendingImage,
    handleComposerChange,
    handleImageChange,
    handleKeyDown,
    openImagePicker,
    sendReply,
    switchToNoteMode,
    switchToReplyMode
  }
}
