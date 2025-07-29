export const filterMenuChildren = item => {
  if (!item.children) return item

  const filteredChildren = (item.children || []).filter(Boolean)
  if (filteredChildren.length === 0) return false 

  return { ...item, children: filteredChildren }
}
