import { clientRoutes } from './clientRoutes'
import { authRoutes } from './authRoutes'
import { adminRoutes } from './adminRoutes'

export const routes = [
  ...clientRoutes,
  ...authRoutes,
  ...adminRoutes
]
