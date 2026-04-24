const CHECKOUT_DRAFT_KEY = 'sales_checkout_draft_v1'
const CHECKOUT_DRAFT_TTL_MS = 12 * 60 * 60 * 1000

const isBrowser = () => typeof window !== 'undefined'

export const normalizeCheckoutStep = value => {
  const parsedStep = Number.parseInt(value, 10)
  if (Number.isNaN(parsedStep)) return 1
  return Math.min(3, Math.max(1, parsedStep))
}

export const readCheckoutDraft = () => {
  if (!isBrowser()) return null

  try {
    const rawValue = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY)
    if (!rawValue) return null

    const parsedValue = JSON.parse(rawValue)
    if (!parsedValue?.savedAt || Date.now() - parsedValue.savedAt > CHECKOUT_DRAFT_TTL_MS) {
      window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
      return null
    }

    return parsedValue
  } catch {
    return null
  }
}

export const writeCheckoutDraft = draft => {
  if (!isBrowser()) return

  try {
    window.sessionStorage.setItem(
      CHECKOUT_DRAFT_KEY,
      JSON.stringify({
        ...draft,
        savedAt: Date.now()
      })
    )
  } catch {
    // Ignore sessionStorage write failures.
  }
}

export const clearCheckoutDraft = () => {
  if (!isBrowser()) return

  try {
    window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
  } catch {
    // Ignore sessionStorage clear failures.
  }
}
