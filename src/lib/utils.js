export function cn(...inputs) {
  return inputs
    .flatMap(input => {
      if (!input) return []
      if (Array.isArray(input)) return input
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
      }
      return [input]
    })
    .join(' ')
}
