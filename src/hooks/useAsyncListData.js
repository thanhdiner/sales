import { useCallback, useEffect, useRef, useState } from 'react'

export function useAsyncListData(fetcher, deps = []) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const latestRequestRef = useRef(0)

  const refetch = useCallback(async () => {
    const requestId = latestRequestRef.current + 1
    latestRequestRef.current = requestId
    setLoading(true)

    try {
      const result = await fetcher()

      if (requestId !== latestRequestRef.current) return null

      setItems(Array.isArray(result?.items) ? result.items : [])
      setTotal(Number(result?.total) || 0)
      return result
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false)
      }
    }

    return null
  }, deps)

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    items,
    setItems,
    total,
    setTotal,
    loading,
    setLoading,
    refetch
  }
}
