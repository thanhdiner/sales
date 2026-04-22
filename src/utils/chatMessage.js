export const getChatImageUrls = (msg) => {
  const imageUrls = Array.isArray(msg?.imageUrls)
    ? msg.imageUrls.filter(url => typeof url === 'string' && url.trim())
    : []

  if (imageUrls.length > 0) return imageUrls
  if (typeof msg?.imageUrl === 'string' && msg.imageUrl.trim()) return [msg.imageUrl]
  return []
}

export const hasChatImages = (msg) => getChatImageUrls(msg).length > 0

export const createClientTempId = () => `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

export const revokeChatImageUrls = (msg) => {
  getChatImageUrls(msg).forEach(url => {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
}

export const isSameImagePayload = (a, b) => {
  const left = getChatImageUrls(a)
  const right = getChatImageUrls(b)

  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return false
  }

  return left.every((url, index) => url === right[index])
}

export const isSameOptimisticImageMessage = (a, b) => {
  const left = getChatImageUrls(a)
  const right = getChatImageUrls(b)

  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return false
  }

  const leftMessage = typeof a?.message === 'string' ? a.message.trim() : ''
  const rightMessage = typeof b?.message === 'string' ? b.message.trim() : ''

  return leftMessage === rightMessage
}

export const groupMessages = (messages) => {
  return messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1]
    const showAvatar = !prev || prev.sender !== msg.sender || msg.type === 'system'
    return [...acc, { ...msg, showAvatar }]
  }, [])
}

export const getChatMessagePreview = (msg) => {
  if (!msg) return 'Bắt đầu cuộc trò chuyện...'
  if (msg.type === 'image' || hasChatImages(msg)) return '[Ảnh]'

  const rawMessage = typeof msg.message === 'string' ? msg.message : ''
  const text = rawMessage.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()

  return text || 'Bắt đầu cuộc trò chuyện...'
}
