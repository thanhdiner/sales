export const groupMessages = (messages) => {
  return messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1]
    const showAvatar = !prev || prev.sender !== msg.sender || msg.type === 'system'
    return [...acc, { ...msg, showAvatar }]
  }, [])
}
