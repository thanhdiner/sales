export const CHAT_TABS = new Set(['unassigned', 'mine', 'open', 'resolved'])
export const CONVERSATION_PAGE_SIZE = 30
export const SEARCH_DEBOUNCE_MS = 300

export function getValidChatTab(tab) {
  return CHAT_TABS.has(tab) ? tab : 'unassigned'
}

export function getConversationStatusFilter(tab) {
  return tab === 'unassigned' || tab === 'resolved' ? tab : 'open'
}

export function getConversationTab(conversation, agentId) {
  if (conversation?.status === 'resolved') return 'resolved'
  if (conversation?.status === 'unassigned') return 'unassigned'
  if (conversation?.assignedAgent?.agentId === agentId) return 'mine'
  return 'open'
}

function getConversationSortTime(conversation) {
  return new Date(conversation?.lastMessageAt || conversation?.createdAt || 0).getTime()
}

export function sortConversationsByLatest(left, right) {
  return getConversationSortTime(right) - getConversationSortTime(left)
}

export function mergeConversationPages(currentConversations, nextConversations) {
  const conversationMap = new Map()

  currentConversations.forEach(conversation => {
    if (conversation?.sessionId) {
      conversationMap.set(conversation.sessionId, conversation)
    }
  })

  nextConversations.forEach(conversation => {
    if (conversation?.sessionId) {
      conversationMap.set(conversation.sessionId, conversation)
    }
  })

  return Array.from(conversationMap.values()).sort(sortConversationsByLatest)
}

export function conversationMatchesTab(conversation, tab, agentId) {
  if (tab === 'unassigned') return conversation?.status === 'unassigned'
  if (tab === 'mine') return conversation?.status === 'open' && conversation?.assignedAgent?.agentId === agentId
  if (tab === 'open') return conversation?.status === 'open'
  if (tab === 'resolved') return conversation?.status === 'resolved'
  return true
}

export function conversationMatchesSearch(conversation, search) {
  const normalizedSearch = search.trim().toLowerCase()
  if (!normalizedSearch) return true

  return [
    conversation?.customer?.name,
    conversation?.customer?.email,
    conversation?.customer?.currentPage,
    conversation?.sessionId,
    conversation?.lastMessage,
    conversation?.translations?.en?.lastMessage,
    conversation?.assignedAgent?.agentName
  ]
    .filter(Boolean)
    .some(value => String(value).toLowerCase().includes(normalizedSearch))
}

export function getPaginationTotal(response) {
  return Number.isFinite(response?.pagination?.total)
    ? response.pagination.total
    : (response?.data || []).length
}

export function hasPaginationTotal(response) {
  return Number.isFinite(response?.pagination?.total)
}
