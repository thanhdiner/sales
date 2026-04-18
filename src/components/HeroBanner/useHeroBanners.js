import { useState, useEffect } from 'react'
import { getActiveBanners } from '@/services/bannersService'

export function useHeroBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await getActiveBanners()
        setBanners(res.data || [])
      } catch (err) {
        console.error('Failed to fetch banners', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  return { banners, loading }
}
