import { flattenRoutes, toMenuConfig } from './helpers'
import { adminRouteRegistry } from './registry'

export { adminRouteRegistry }

export const adminPageRoutes = flattenRoutes(adminRouteRegistry)
export const adminMenuConfig = adminRouteRegistry.map(toMenuConfig).filter(Boolean)
