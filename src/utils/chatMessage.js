const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

const getLocalizedChatField = (item, field, language, fallback = '') => {
  if (!item) return fallback

  const baseValue = item[field]
  const translatedValue = isEnglishLanguage(language) ? item.translations?.en?.[field] : null

  if (hasText(translatedValue)) return translatedValue
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedChatMessageText = (msg, language, fallback = '') =>
  getLocalizedChatField(msg, 'message', language, fallback)

export const getLocalizedChatConversationLastMessage = (conversation, language, fallback = '') =>
  getLocalizedChatField(conversation, 'lastMessage', language, fallback)

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

export const CHAT_REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

export const getChatMessageReactions = (msg) => Array.isArray(msg?.reactions)
  ? msg.reactions.filter(reaction =>
      reaction &&
      CHAT_REACTION_OPTIONS.includes(reaction.emoji) &&
      ['customer', 'agent'].includes(reaction.reactorType)
    )
  : []

export const getChatReactionActorKey = (actor = {}) =>
  `${actor.reactorType || ''}:${actor.reactorId || ''}`

export const getChatReactionGroups = (msg, actor = {}) => {
  const activeActorKey = getChatReactionActorKey(actor)
  const groups = new Map()

  getChatMessageReactions(msg).forEach(reaction => {
    const current = groups.get(reaction.emoji) || {
      emoji: reaction.emoji,
      count: 0,
      active: false
    }

    current.count += 1
    if (activeActorKey && getChatReactionActorKey(reaction) === activeActorKey) {
      current.active = true
    }

    groups.set(reaction.emoji, current)
  })

  return CHAT_REACTION_OPTIONS
    .map(emoji => groups.get(emoji))
    .filter(Boolean)
}

export const mergeChatReactionUpdate = (messages, updatedMessage) => {
  if (!updatedMessage?._id) return messages

  return messages.map(message =>
    message?._id?.toString() === updatedMessage._id?.toString()
      ? { ...message, reactions: updatedMessage.reactions || [] }
      : message
  )
}

export const applyLocalChatReaction = (messages, targetMessage, emoji, actor = {}, actorName = '') => {
  if (!targetMessage?._id || !CHAT_REACTION_OPTIONS.includes(emoji)) return messages

  const targetId = targetMessage._id.toString()
  const actorKey = getChatReactionActorKey(actor)
  if (!actorKey || actorKey === ':') return messages

  return messages.map(message => {
    if (message?._id?.toString() !== targetId) return message

    const reactions = getChatMessageReactions(message)
    const existingIndex = reactions.findIndex(reaction =>
      getChatReactionActorKey(reaction) === actorKey
    )

    if (existingIndex !== -1 && reactions[existingIndex].emoji === emoji) {
      return {
        ...message,
        reactions: reactions.filter((_reaction, index) => index !== existingIndex)
      }
    }

    const nextReaction = {
      emoji,
      reactorType: actor.reactorType,
      reactorId: actor.reactorId,
      reactorName: actorName,
      createdAt: new Date().toISOString()
    }

    if (existingIndex === -1) {
      return { ...message, reactions: [...reactions, nextReaction] }
    }

    return {
      ...message,
      reactions: reactions.map((reaction, index) =>
        index === existingIndex ? nextReaction : reaction
      )
    }
  })
}

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

const LEGACY_SYSTEM_MESSAGE_MATCHERS = [
  {
    pattern: /^(.*?)\s+đã tham gia cuộc trò chuyện$/i,
    getMessage: (match, t) => t('system.agentJoined', { agentName: match[1] })
  },
  {
    pattern: /^(.*?)\s+đã đánh dấu cuộc trò chuyện là đã giải quyết$/i,
    getMessage: (match, t) => t('system.agentResolved', { agentName: match[1] })
  },
  {
    pattern: /^Trợ lý AI SmartMall Bot đã quay trở lại\. Bạn cần tôi giúp gì\?$/i,
    getMessage: (_match, t) => t('system.botReturned')
  },
  {
    pattern: /^Khách hàng yêu cầu nói chuyện với nhân viên hỗ trợ$/i,
    getMessage: (_match, t) => t('system.requestedHuman')
  },
  {
    pattern: /^Cuộc trò chuyện đã được đánh dấu giải quyết$/i,
    getMessage: (_match, t) => t('system.resolved')
  },
  {
    pattern: /^Cuộc trò chuyện được mở lại$/i,
    getMessage: (_match, t) => t('system.reopened')
  }
]

export const getLocalizedSystemMessage = (msg, t, language) => {
  const key = msg?.metadata?.i18nKey
  if (key && typeof t === 'function') {
    return t(key, msg.metadata?.i18nValues || {})
  }

  const text = typeof msg?.message === 'string' ? msg.message.trim() : ''
  if (isEnglishLanguage(language)) {
    const translatedText = getLocalizedChatMessageText(msg, language, '')
    if (hasText(translatedText)) return translatedText
  }

  if (typeof t === 'function') {
    for (const matcher of LEGACY_SYSTEM_MESSAGE_MATCHERS) {
      const match = text.match(matcher.pattern)
      if (match) return matcher.getMessage(match, t)
    }
  }

  return text
}

export const getLocalizedChatConversationPreview = (conversation, t, language, fallback = '') => {
  if (!conversation) return fallback

  if (conversation.lastMessageSender === 'system' || conversation.lastMessageMetadata?.i18nKey) {
    return getLocalizedSystemMessage(
      {
        message: conversation.lastMessage,
        metadata: conversation.lastMessageMetadata,
        translations: {
          en: {
            message: conversation.translations?.en?.lastMessage || ''
          }
        }
      },
      t,
      language
    )
  }

  return getLocalizedChatConversationLastMessage(conversation, language, fallback)
}

export const getChatMessagePreview = (msg, options = {}) => {
  const emptyText = options.emptyText || 'Bắt đầu cuộc trò chuyện...'
  const imageText = options.imageText || '[Ảnh]'

  if (!msg) return emptyText
  if ((msg.type === 'system' || msg.sender === 'system') && typeof options.systemText === 'function') {
    return options.systemText(msg)
  }
  if (msg.type === 'system' || msg.sender === 'system') {
    return getLocalizedSystemMessage(msg, options.t, options.language)
  }
  if (msg.type === 'image' || hasChatImages(msg)) return imageText

  const rawMessage = getLocalizedChatMessageText(msg, options.language, '')
  const text = rawMessage.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()

  return text || emptyText
}
