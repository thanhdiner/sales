import { Suspense } from 'react'
import RequireAuth from '@/components/route/RequireAuth'

export const ClientRouteFallback = () => (
  <div className="flex min-h-[240px] items-center justify-center text-sm text-gray-500 dark:text-gray-300">
    Loading...
  </div>
)

export const lazyElement = Component => (
  <Suspense fallback={<ClientRouteFallback />}>
    <Component />
  </Suspense>
)

export const protectedElement = Component => (
  <RequireAuth>
    {lazyElement(Component)}
  </RequireAuth>
)
