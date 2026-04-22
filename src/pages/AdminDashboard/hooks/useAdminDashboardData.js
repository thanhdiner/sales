import { useEffect, useState } from 'react'
import { getAdminDashboard } from '@/services/adminDashboardService'
import { normalizeDashboardPayload } from '../utils/dashboardTransforms'

export function useAdminDashboardData(dateRange) {
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(() => normalizeDashboardPayload({}))

  useEffect(() => {
    let isMounted = true

    const fetchDashboard = async () => {
      setLoading(true)

      try {
        const res = await getAdminDashboard(dateRange)

        if (!isMounted) return

        setDashboardData(normalizeDashboardPayload(res?.data))
      } catch (err) {
        if (isMounted) {
          console.error('Lỗi lấy dashboard:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      isMounted = false
    }
  }, [dateRange])

  return { loading, ...dashboardData }
}

export function useDashboardMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakpoint])

  return isMobile
}
