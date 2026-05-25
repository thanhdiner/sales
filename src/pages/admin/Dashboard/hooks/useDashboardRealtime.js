import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/services/realtime/socket'

const DASHBOARD_EVENT_KEY_MAP = {
  summary: key => key[0] === 'adminDashboard' && key[1] === 'summary',
  statGroup: key => key[0] === 'adminDashboard' && key[1] === 'statGroup',
  charts: key => key[0] === 'adminDashboard' && key[1] === 'charts',
  recentOrders: key => key[0] === 'adminDashboard' && key[1] === 'recentOrders',
  topCustomers: key => key[0] === 'adminDashboard' && key[1] === 'topCustomers',
  bestSellingProducts: key => key[0] === 'adminDashboard' && key[1] === 'bestSellingProducts',
  lowStockProducts: key => key[0] === 'adminDashboard' && key[1] === 'lowStockProducts'
}

const EVENT_AFFECTED_KEYS = {
  'dashboard:order_created': ['summary', 'statGroup', 'recentOrders', 'lowStockProducts'],
  'dashboard:order_updated': ['summary', 'statGroup', 'recentOrders', 'lowStockProducts'],
  'dashboard:review_created': ['summary'],
  'dashboard:review_updated': ['summary'],
  'dashboard:stock_updated': ['summary', 'statGroup', 'lowStockProducts']
}

function invalidateAffected(queryClient, affected = []) {
  const affectedSet = new Set(affected)

  queryClient.invalidateQueries({
    predicate: query => {
      const key = query.queryKey || []
      return [...affectedSet].some(name => DASHBOARD_EVENT_KEY_MAP[name]?.(key))
    },
    refetchType: 'active'
  })
}

export default function useDashboardRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSocket()

    const handlers = Object.entries(EVENT_AFFECTED_KEYS).map(([event, fallbackAffected]) => {
      const handler = payload => {
        invalidateAffected(queryClient, payload?.affected || fallbackAffected)
      }

      socket.on(event, handler)
      return [event, handler]
    })

    const invalidatedHandler = payload => {
      invalidateAffected(queryClient, payload?.affected || Object.keys(DASHBOARD_EVENT_KEY_MAP))
    }

    socket.on('dashboard:invalidated', invalidatedHandler)

    return () => {
      handlers.forEach(([event, handler]) => socket.off(event, handler))
      socket.off('dashboard:invalidated', invalidatedHandler)
    }
  }, [queryClient])
}
