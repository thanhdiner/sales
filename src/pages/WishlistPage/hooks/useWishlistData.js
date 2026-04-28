import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { message } from 'antd'
import { useClientWishlistInfiniteQuery } from '@/hooks/queries/useSharedAppQueries'
import { PAGE_SIZE } from '../constants'
import { getWishlistInfiniteQueryKey, isWishlistItemInStock } from '../utils/wishlistPageUtils'

export function useWishlistData({ isLoggedIn, queryClient, queryScope, t }) {
  const didTrimInitialPagesRef = useRef(false)
  const [visiblePageCount, setVisiblePageCount] = useState(1)

  const {
    data: wishlistData,
    isLoading: loading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useClientWishlistInfiniteQuery({
    scope: queryScope,
    limit: PAGE_SIZE,
    enabled: isLoggedIn
  })

  useEffect(() => {
    if (didTrimInitialPagesRef.current || !wishlistData?.pages?.length) return

    didTrimInitialPagesRef.current = true

    if (wishlistData.pages.length <= 1) return

    queryClient.setQueryData(getWishlistInfiniteQueryKey(queryScope), old => {
      if (!old?.pages?.length) return old

      return {
        ...old,
        pages: [old.pages[0]],
        pageParams: old.pageParams?.length ? [old.pageParams[0]] : [1]
      }
    })
  }, [queryClient, queryScope, wishlistData])

  const visibleWishlistPages = useMemo(() => wishlistData?.pages?.slice(0, visiblePageCount) || [], [visiblePageCount, wishlistData])
  const wishlistItems = useMemo(() => visibleWishlistPages.flatMap(page => page?.items || []), [visibleWishlistPages])
  const totalItems = wishlistData?.pages?.[0]?.pagination?.totalItems ?? wishlistItems.length
  const inStockCount = wishlistItems.filter(isWishlistItemInStock).length

  const handleLoadMore = useCallback(async () => {
    if (isFetchingNextPage) return

    const cachedPageCount = wishlistData?.pages?.length || 0

    if (visiblePageCount < cachedPageCount) {
      setVisiblePageCount(prev => prev + 1)
      return
    }

    if (!hasNextPage) return

    try {
      await fetchNextPage()
      setVisiblePageCount(prev => prev + 1)
    } catch {
      message.error(t('message.loadMoreFailed'))
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, t, visiblePageCount, wishlistData])

  const resetVisiblePageCount = useCallback(() => {
    setVisiblePageCount(1)
  }, [])

  return {
    handleLoadMore,
    hasNextPage,
    inStockCount,
    isFetchingNextPage,
    loading,
    resetVisiblePageCount,
    totalItems,
    wishlistItems
  }
}
