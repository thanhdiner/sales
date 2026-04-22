import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MINUTE,
      gcTime: HOUR,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

const storage =
  typeof window !== 'undefined'
    ? {
        getItem: key => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
        removeItem: key => Promise.resolve(window.localStorage.removeItem(key))
      }
    : undefined

export const queryPersister = storage
  ? createAsyncStoragePersister({
      storage,
      key: 'sales-react-query-cache',
      throttleTime: 1000
    })
  : undefined

export const queryPersistOptions = queryPersister
  ? {
      persister: queryPersister,
      maxAge: HOUR,
      buster: 'sales-react-query-v1'
    }
  : undefined
