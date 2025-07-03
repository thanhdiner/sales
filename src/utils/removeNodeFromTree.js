export const removeNodeFromTree = (tree, id) => {
  return tree
    .filter(node => node.value !== id)
    .map(node => ({
      ...node,
      children: node.children ? removeNodeFromTree(node.children, id) : undefined
    }))
}
