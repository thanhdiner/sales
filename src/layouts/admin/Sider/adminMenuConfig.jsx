import { toMenuConfig } from '@/routes/admin/helpers'
import { adminRouteRegistry } from '@/routes/admin/registry'

export const adminMenuConfig = adminRouteRegistry.map(toMenuConfig).filter(Boolean)
