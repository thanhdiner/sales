import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getAdminWebsiteConfig } from '@/services/adminWebsiteConfigService'
import { getCart } from '@/services/cartsService'
import { getProductCategoryTree } from '@/services/clientProductCategoryService'
import { getClientMe } from '@/services/userService'
import { getWishlist } from '@/services/wishlistService'
import { normalizeCartItems } from '@/lib/clientCache'
import { GUEST_QUERY_SCOPE, queryKeys } from '@/lib/queryKeys'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

export function useWebsiteConfigQuery(options = {}) {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: queryKeys.websiteConfig(language),
    queryFn: getAdminWebsiteConfig,
    placeholderData: previousData => previousData,
    staleTime: 30 * MINUTE,
    gcTime: 2 * HOUR,
    ...options
  })
}

export function useCategoriesQuery(options = {}) {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: queryKeys.categories(language),
    queryFn: async () => {
      const response = await getProductCategoryTree()
      return response?.data || []
    },
    placeholderData: previousData => previousData,
    staleTime: 30 * MINUTE,
    gcTime: 2 * HOUR,
    ...options
  })
}

export function useClientMeQuery({ scope, ...options } = {}) {
  return useQuery({
    queryKey: queryKeys.clientUser(scope || GUEST_QUERY_SCOPE),
    queryFn: getClientMe,
    staleTime: 10 * MINUTE,
    gcTime: HOUR,
    retry: false,
    ...options
  })
}

export function useClientCartQuery({ scope, ...options } = {}) {
  return useQuery({
    queryKey: queryKeys.clientCart(scope || GUEST_QUERY_SCOPE),
    queryFn: async () => {
      const cart = await getCart()
      return normalizeCartItems(cart?.items || [])
    },
    staleTime: 5 * MINUTE,
    gcTime: HOUR,
    retry: false,
    ...options
  })
}

export function useClientWishlistQuery({ scope, page = 1, limit = 12, ...options } = {}) {
  return useQuery({
    queryKey: ['client-wishlist', scope || GUEST_QUERY_SCOPE, page, limit, 'paged-v1'],
    queryFn: async () => {
      const wishlist = await getWishlist({ page, limit })
      return {
        items: wishlist?.items || [],
        pagination: wishlist?.pagination || null
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    retry: false,
    ...options
  })
}

export function useClientWishlistInfiniteQuery({ scope, limit = 12, ...options } = {}) {
  return useInfiniteQuery({
    queryKey: ['client-wishlist-infinite', scope || GUEST_QUERY_SCOPE, limit, 'v1'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return getWishlist({ page: pageParam, limit })
    },
    getNextPageParam: lastPage => {
      const pagination = lastPage?.pagination

      if (!pagination?.hasMore) return undefined

      return pagination.page + 1
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    retry: false,
    ...options
  })
}
