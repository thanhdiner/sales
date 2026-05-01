import ClientLayout from '@/layouts/client'
import { clientRouteRegistry } from './registry'

export const clientRoutes = [
  {
    path: '/',
    element: <ClientLayout />,
    children: clientRouteRegistry
  }
]
