export const filterMenuChildren = item => {
  if (!item.children) return item

  const filteredChildren = (item.children || []).filter(Boolean).reduce((children, child) => {
    const isDivider = child?.type === 'divider'
    const previousChild = children[children.length - 1]

    if (isDivider && (!previousChild || previousChild.type === 'divider')) return children

    children.push(child)
    return children
  }, [])

  while (filteredChildren[filteredChildren.length - 1]?.type === 'divider') {
    filteredChildren.pop()
  }

  if (filteredChildren.length === 0) return false

  return { ...item, children: filteredChildren }
}
