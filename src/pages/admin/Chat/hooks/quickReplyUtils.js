export function resolveQuickReplyVariables(content, variables = {}) {
  return String(content || '').replace(/{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g, (match, key) => {
    const value = variables[key]
    return typeof value === 'string' && value.trim() ? value : match
  })
}
