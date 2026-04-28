import { useCallback, useEffect, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'
import { useTranslation } from 'react-i18next'

import { getSocket } from '@/services/socketService'
import { chatService } from '@/services/chatService'
import { createClientTempId, revokeChatImageUrls } from '@/utils/chatMessage'

const MAX_CHAT_IMAGES = 10

const revokePreviewUrl = (url) => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

const createPendingImage = (file) => ({
  id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  file,
  name: file.name,
  previewUrl: URL.createObjectURL(file)
})

export function useChatInput({ sessionId, clientUser, setMessages, isResolved = false, onResolvedSendAttempt }) {
  const { t } = useTranslation('clientChat')
  const [input, setInput] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [pendingImages, setPendingImages] = useState([])
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const typingSocketTimer = useRef(null)
  const pendingImagesRef = useRef([])

  const senderName = clientUser?.fullName || clientUser?.name || t('defaults.guest')
  const senderAvatar = clientUser?.avatarUrl || clientUser?.avatar || null
  const senderId = clientUser?._id || null

  useEffect(() => {
    pendingImagesRef.current = pendingImages
  }, [pendingImages])

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach(image => revokePreviewUrl(image.previewUrl))
    }
  }, [])

  const emitMessage = (payload, targetSessionId = sessionId) => {
    const socket = getSocket()
    socket.emit('chat:join', { sessionId: targetSessionId })

    return new Promise((resolve, reject) => {
      let settled = false
      const timer = window.setTimeout(() => {
        settled = true
        resolve({ success: true, timeout: true })
      }, 10000)

      socket.emit('chat:send', {
        sessionId: targetSessionId,
        senderName,
        senderAvatar,
        senderId,
        ...payload
      }, (response = {}) => {
        if (settled) return

        settled = true
        window.clearTimeout(timer)

        if (response.success === false) {
          const err = new Error(response.message || t('messages.sendFailed'))
          err.code = response.code
          err.conversation = response.conversation
          reject(err)
          return
        }

        resolve(response)
      })
    })
  }

  const appendOptimisticMessage = (payload) => {
    const clientTempId = payload.clientTempId || createClientTempId()
    const tempId = `temp_${clientTempId}`
    setMessages(prev => [
      ...prev,
      {
        _id: tempId,
        clientTempId,
        sender: clientUser ? 'customer' : 'guest',
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        ...payload
      }
    ])

    return clientTempId
  }

  const resetComposer = () => {
    setInput('')
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.focus()
    }
  }

  const clearPendingImages = useCallback(({ revoke = true } = {}) => {
    setPendingImages(prev => {
      if (revoke) {
        prev.forEach(image => revokePreviewUrl(image.previewUrl))
      }
      return []
    })

    if (imageInputRef.current) imageInputRef.current.value = ''
  }, [])

  const removePendingImage = useCallback((imageId) => {
    setPendingImages(prev => {
      const next = []
      prev.forEach(image => {
        if (image.id === imageId) revokePreviewUrl(image.previewUrl)
        else next.push(image)
      })
      return next
    })
  }, [])

  useEffect(() => {
    setInput('')
    clearPendingImages()
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }, [sessionId, clearPendingImages])

  const removeOptimisticMessage = useCallback((clientTempId) => {
    if (!clientTempId) return

    setMessages(prev => prev.filter(msg => {
      const shouldRemove = msg.isOptimistic && msg.clientTempId === clientTempId
      if (shouldRemove) revokeChatImageUrls(msg)
      return !shouldRemove
    }))
  }, [setMessages])

  const resolveSendOptions = (currentPageOrOptions, sessionOverride) => {
    if (
      currentPageOrOptions &&
      typeof currentPageOrOptions === 'object' &&
      !Array.isArray(currentPageOrOptions)
    ) {
      return {
        currentPage: currentPageOrOptions.currentPage || window.location.pathname,
        targetSessionId: currentPageOrOptions.sessionId || sessionId
      }
    }

    return {
      currentPage: currentPageOrOptions || window.location.pathname,
      targetSessionId: sessionOverride || sessionId
    }
  }

  const handleSendError = (err) => {
    if (err?.code === 'CHAT_RESOLVED') {
      onResolvedSendAttempt?.(err.conversation)
      antdMessage.info(t('messages.conversationClosed'))
      return
    }

    antdMessage.error(err.message || t('messages.sendFailed'))
  }

  const sendMessage = async (text, currentPageOrOptions = window.location.pathname, sessionOverride = null) => {
    const { currentPage, targetSessionId } = resolveSendOptions(currentPageOrOptions, sessionOverride)
    const messageText = (text ?? input).trim()
    const imagesToSend = pendingImagesRef.current
    if (!messageText && imagesToSend.length === 0) return

    if (isResolved && targetSessionId === sessionId) {
      onResolvedSendAttempt?.()
      antdMessage.info(t('messages.conversationClosed'))
      return
    }

    try {
      if (imagesToSend.length > 0) {
        const clientTempId = createClientTempId()
        const previewUrls = imagesToSend.map(image => image.previewUrl)

        appendOptimisticMessage({
          clientTempId,
          type: 'image',
          imageUrl: previewUrls[0] || null,
          imageUrls: previewUrls,
          message: messageText
        })

        clearPendingImages({ revoke: false })
        resetComposer()
        setIsUploadingImage(true)

        try {
          const imageUrls = await chatService.uploadImages(imagesToSend.map(image => image.file))

          await emitMessage({
            clientTempId,
            type: 'image',
            imageUrl: imageUrls[0] || null,
            imageUrls,
            message: messageText,
            currentPage
          }, targetSessionId)
        } catch (err) {
          removeOptimisticMessage(clientTempId)
          throw err
        }
      } else {
        const clientTempId = appendOptimisticMessage({
          clientTempId: createClientTempId(),
          message: messageText
        })

        resetComposer()

        try {
          await emitMessage({
            clientTempId,
            type: 'text',
            message: messageText,
            currentPage
          }, targetSessionId)
        } catch (err) {
          removeOptimisticMessage(clientTempId)
          setInput(messageText)
          throw err
        }
      }
    } catch (err) {
      handleSendError(err)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []).filter(file => file.type?.startsWith('image/'))
    if (files.length === 0) return

    setPendingImages(prev => {
      const remainingSlots = MAX_CHAT_IMAGES - prev.length
      if (remainingSlots <= 0) {
        antdMessage.warning(t('messages.maxImagesPerSend', { count: MAX_CHAT_IMAGES }))
        return prev
      }

      const acceptedFiles = files.slice(0, remainingSlots)
      if (acceptedFiles.length < files.length) {
        antdMessage.warning(t('messages.maxImagesPerMessage', { count: MAX_CHAT_IMAGES }))
      }

      return [...prev, ...acceptedFiles.map(createPendingImage)]
    })

    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const openImagePicker = () => {
    if (!isUploadingImage) imageInputRef.current?.click()
  }

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

  return {
    input,
    setInput,
    inputRef,
    imageInputRef,
    sendMessage,
    handleInputChange,
    handleImageChange,
    openImagePicker,
    clearPendingImages,
    removePendingImage,
    pendingImages,
    canSend: !!input.trim() || pendingImages.length > 0,
    isUploadingImage,
    maxImages: MAX_CHAT_IMAGES
  }
}
