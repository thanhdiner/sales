import { useCallback, useEffect, useRef, useState } from 'react'
import { message as antdMessage } from 'antd'

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

export function useChatInput({ sessionId, clientUser, setMessages }) {
  const [input, setInput] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [pendingImages, setPendingImages] = useState([])
  const inputRef = useRef(null)
  const imageInputRef = useRef(null)
  const typingSocketTimer = useRef(null)
  const pendingImagesRef = useRef([])

  const senderName = clientUser?.fullName || clientUser?.name || 'Khách'
  const senderAvatar = clientUser?.avatar || null
  const senderId = clientUser?._id || null

  useEffect(() => {
    pendingImagesRef.current = pendingImages
  }, [pendingImages])

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach(image => revokePreviewUrl(image.previewUrl))
    }
  }, [])

  const emitMessage = (payload) => {
    const socket = getSocket()
    socket.emit('chat:join', { sessionId })
    socket.emit('chat:send', {
      sessionId,
      senderName,
      senderAvatar,
      senderId,
      ...payload
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

  const sendMessage = async (text, currentPage = window.location.pathname) => {
    const t = (text ?? input).trim()
    const imagesToSend = pendingImagesRef.current
    if (!t && imagesToSend.length === 0) return

    try {
      if (imagesToSend.length > 0) {
        const clientTempId = createClientTempId()
        const previewUrls = imagesToSend.map(image => image.previewUrl)

        appendOptimisticMessage({
          clientTempId,
          type: 'image',
          imageUrl: previewUrls[0] || null,
          imageUrls: previewUrls,
          message: t
        })

        clearPendingImages({ revoke: false })
        resetComposer()
        setIsUploadingImage(true)

        try {
          const imageUrls = await chatService.uploadImages(imagesToSend.map(image => image.file))

          emitMessage({
            clientTempId,
            type: 'image',
            imageUrl: imageUrls[0] || null,
            imageUrls,
            message: t,
            currentPage
          })
        } catch (err) {
          removeOptimisticMessage(clientTempId)
          throw err
        }
      } else {
        const clientTempId = appendOptimisticMessage({
          clientTempId: createClientTempId(),
          message: t
        })

        emitMessage({
          clientTempId,
          type: 'text',
          message: t,
          currentPage
        })

        resetComposer()
      }
    } catch (err) {
      antdMessage.error(err.message || 'Không thể tải ảnh lên')
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
        antdMessage.warning(`Tối đa ${MAX_CHAT_IMAGES} ảnh mỗi lần gửi`)
        return prev
      }

      const acceptedFiles = files.slice(0, remainingSlots)
      if (acceptedFiles.length < files.length) {
        antdMessage.warning(`Chỉ giữ tối đa ${MAX_CHAT_IMAGES} ảnh trong một tin nhắn`)
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
