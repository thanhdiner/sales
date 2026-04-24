import { useEffect, useState } from 'react'
import { fetchVietnamAddressTree } from '@/lib/vietnamAddress'

export default function useVietnamAddress() {
  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchVietnamAddressTree()
      .then(data => {
        if (cancelled) return
        setTree(data)
        setError('')
      })
      .catch(err => {
        if (cancelled) return
        setError(err?.message || 'Khong tai duoc danh sach dia chi')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { tree, loading, error }
}
