import { clientRoutes } from './client'
import { authRoutes } from './auth'
import { adminRoutes } from './admin'

export const routes = [
  ...clientRoutes,
  ...authRoutes,
  ...adminRoutes
]
