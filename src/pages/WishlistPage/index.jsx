import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { message, Modal, Select } from 'antd'
import { Heart, ShoppingBag, ShoppingCart, SlidersHorizontal, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import SEO from '@/components/SEO'
import { useClientWishlistInfiniteQuery } from '@/hooks/queries/useSharedAppQueries'
import { hasClientToken, syncCartFromServer } from '@/lib/clientCache'
import { MAX_CART_UNIQUE_ITEMS, getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cartLimits'
import { AUTHENTICATED_QUERY_SCOPE, GUEST_QUERY_SCOPE } from '@/lib/queryKeys'
import { addToCart } from '@/services/cartsService'
import { clearWishlist, removeFromWishlist } from '@/services/wishlistService'
import { clearWishlistLocal, removeFromWishlistLocal } from '@/stores/wishlist'

const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'inStock', label: 'Còn hàng' },
  { id: 'deal', label: 'Đang giảm giá' },
  { id: 'outStock', label: 'Hết hàng' }
]

const SORTS = [
  { id: 'newest', label: 'Mới lưu nhất' },
  { id: 'priceAsc', label: 'Giá thấp đến cao' },
  { id: 'priceDesc', label: 'Giá cao đến thấp' },
  { id: 'discountDesc', label: 'Giảm giá nhiều nhất' }
]

const SALE = '#ff424e'
const PAGE_SIZE = 12

const OUTLINE_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#0b74e5] bg-white font-semibold text-[#0b74e5] transition-all hover:bg-[#0b74e5] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-white disabled:text-slate-300 dark:bg-gray-800 dark:hover:bg-[#0b74e5]'

const getWishlistInfiniteQueryKey = scope => ['client-wishlist-infinite', scope, PAGE_SIZE, 'v1']

const getWishlistTotalPages = (totalItems, limit) => {
  if (totalItems <= 0) return 0
  return Math.ceil(totalItems / Math.max(limit || PAGE_SIZE, 1))
}

const decrementWishlistPagination = pagination => {
  if (!pagination) return pagination

  const limit = Math.max(Number(pagination.limit) || PAGE_SIZE, 1)
  const totalItems = Math.max(Number(pagination.totalItems) - 1 || 0, 0)
  const totalPages = getWishlistTotalPages(totalItems, limit)

  return {
    ...pagination,
    totalItems,
    totalPages,
    hasMore: pagination.page < totalPages
  }
}

const clearWishlistPagination = pagination => {
  if (!pagination) return pagination

  return {
    ...pagination,
    totalItems: 0,
    totalPages: 0,
    hasMore: false
  }
}

const removeWishlistItemFromCache = (queryClient, scope, productId) => {
  queryClient.setQueriesData({ queryKey: ['client-wishlist', scope] }, old => {
    if (!old || Array.isArray(old) || !Array.isArray(old.items)) return old

    return {
      ...old,
      items: old.items.filter(item => item.productId !== productId),
      pagination: decrementWishlistPagination(old.pagination)
    }
  })

  queryClient.setQueryData(getWishlistInfiniteQueryKey(scope), old => {
    if (!old?.pages?.length) return old

    return {
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        items: Array.isArray(page?.items)
          ? page.items.filter(item => item.productId !== productId)
          : [],
        pagination: decrementWishlistPagination(page?.pagination)
      }))
    }
  })
}

const clearWishlistCache = (queryClient, scope) => {
  queryClient.setQueriesData({ queryKey: ['client-wishlist', scope] }, old => {
    if (!old || Array.isArray(old) || !Array.isArray(old.items)) return old

    return {
      ...old,
      items: [],
      pagination: clearWishlistPagination(old.pagination)
    }
  })

  queryClient.setQueryData(getWishlistInfiniteQueryKey(scope), old => {
    if (!old?.pages?.length) return old

    return {
      ...old,
      pages: [
        {
          ...old.pages[0],
          items: [],
          pagination: clearWishlistPagination(old.pages[0]?.pagination)
        }
      ],
      pageParams: old.pageParams?.length ? [old.pageParams[0]] : [1]
    }
  })
}

function WishlistPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const didTrimInitialPagesRef = useRef(false)
  const cartItems = useSelector(state => state.cart.items) || []

  const isLoggedIn = hasClientToken()
  const queryScope = isLoggedIn ? AUTHENTICATED_QUERY_SCOPE : GUEST_QUERY_SCOPE

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

  const [addingToCart, setAddingToCart] = useState({})
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [visiblePageCount, setVisiblePageCount] = useState(1)

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

  const visibleWishlistPages = useMemo(
    () => wishlistData?.pages?.slice(0, visiblePageCount) || [],
    [visiblePageCount, wishlistData]
  )

  const wishlistItems = useMemo(
    () => visibleWishlistPages.flatMap(page => page?.items || []),
    [visibleWishlistPages]
  )

  const totalItems = wishlistData?.pages?.[0]?.pagination?.totalItems ?? wishlistItems.length

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

  const filteredWishlist = useMemo(() => {
    let result = [...wishlistItems]

    if (activeFilter === 'inStock') {
      result = result.filter(item => item.inStock)
    }

    if (activeFilter === 'deal') {
      result = result.filter(item => Number(item.discountPercentage || 0) > 0)
    }

    if (activeFilter === 'outStock') {
      result = result.filter(item => !item.inStock)
    }

    result.sort((a, b) => {
      if (sortBy === 'priceAsc') return Number(a.price || 0) - Number(b.price || 0)
      if (sortBy === 'priceDesc') return Number(b.price || 0) - Number(a.price || 0)

      if (sortBy === 'discountDesc') {
        return Number(b.discountPercentage || 0) - Number(a.discountPercentage || 0)
      }

      return 0
    })

    return result
  }, [activeFilter, sortBy, wishlistItems])

  const inStockCount = wishlistItems.filter(item => item.inStock).length
  const loadedItemsLabel =
    wishlistItems.length < totalItems
      ? `${wishlistItems.length}/${totalItems} sản phẩm đã tải`
      : `${totalItems} sản phẩm`

  const handleChangeFilter = filterId => {
    setActiveFilter(filterId)
  }

  const handleChangeSort = value => {
    setSortBy(value)
  }

  const handleLoadMore = async () => {
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
      message.error('Tải thêm sản phẩm thất bại')
    }
  }

  const handleRemove = productId => {
    Modal.confirm({
      title: <span className="text-gray-800 dark:text-gray-100">Xóa khỏi danh sách yêu thích?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeFromWishlist(productId)
          removeWishlistItemFromCache(queryClient, queryScope, productId)
          dispatch(removeFromWishlistLocal(productId))
          message.success('Đã xóa khỏi danh sách yêu thích')
        } catch {
          message.error('Xóa thất bại, vui lòng thử lại')
        }
      }
    })
  }

  const handleClearAll = () => {
    Modal.confirm({
      title: <span className="text-gray-800 dark:text-gray-100">Xóa toàn bộ danh sách yêu thích?</span>,
      content: 'Tất cả sản phẩm sẽ bị xóa khỏi danh sách.',
      okText: 'Xóa tất cả',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await clearWishlist()
          clearWishlistCache(queryClient, queryScope)
          dispatch(clearWishlistLocal())
          setVisiblePageCount(1)
          message.success('Đã xóa toàn bộ danh sách yêu thích')
        } catch {
          message.error('Có lỗi xảy ra, vui lòng thử lại')
        }
      }
    })
  }

  const handleAddToCart = async item => {
    if (!item.inStock) {
      message.warning('Sản phẩm đã hết hàng')
      return
    }

    if (hasReachedCartUniqueItemLimit(cartItems, item.productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setAddingToCart(prev => ({ ...prev, [item.productId]: true }))

    try {
      await addToCart({ productId: item.productId, quantity: 1 })
      await syncCartFromServer(dispatch)
      message.success('Đã thêm vào giỏ hàng')
    } catch (err) {
      message.error(err.message || 'Thêm vào giỏ hàng thất bại')
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.productId]: false }))
    }
  }

  const handleAddAllToCart = async () => {
    const inStockItems = filteredWishlist.filter(item => item.inStock)

    if (inStockItems.length === 0) {
      message.warning('Không có sản phẩm nào còn hàng')
      return
    }

    const nextCartProductIds = new Set(cartItems.map(item => item.productId))
    const itemsToAdd = []
    let skippedDueToLimit = 0

    for (const item of inStockItems) {
      if (nextCartProductIds.has(item.productId)) {
        itemsToAdd.push(item)
        continue
      }

      if (nextCartProductIds.size < MAX_CART_UNIQUE_ITEMS) {
        nextCartProductIds.add(item.productId)
        itemsToAdd.push(item)
      } else {
        skippedDueToLimit += 1
      }
    }

    if (itemsToAdd.length === 0) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    try {
      for (const item of itemsToAdd) {
        await addToCart({ productId: item.productId, quantity: 1 })
      }

      await syncCartFromServer(dispatch)
      if (skippedDueToLimit > 0) {
        message.warning(
          `Đã thêm ${itemsToAdd.length} sản phẩm. ${skippedDueToLimit} sản phẩm còn lại vượt giới hạn ${MAX_CART_UNIQUE_ITEMS} sản phẩm khác nhau trong giỏ hàng.`
        )
        return
      }

      message.success(`Đã thêm ${itemsToAdd.length} sản phẩm vào giỏ hàng`)
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng')
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-slate-50 px-4 py-8 dark:bg-gray-900">
        <SEO title="Yêu thích" noIndex />

        <div className="mx-auto max-w-5xl">
          <div className="mb-5 h-12 animate-pulse rounded-2xl bg-white dark:bg-gray-800" />

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-gray-800">
            <div className="mx-auto my-7 h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-0">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[56px_1fr_120px_120px] items-center gap-3 border-t border-slate-100 px-5 py-3 dark:border-gray-700"
                >
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!totalItems) {
    return (
      <div className="rounded-xl bg-slate-50 px-4 py-10 dark:bg-gray-900">
        <SEO title="Danh sách yêu thích" noIndex />

        <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm dark:bg-gray-800">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
            <Heart className="h-12 w-12 text-[#ff424e]" fill={SALE} />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-gray-100">
            Chưa có sản phẩm yêu thích
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-gray-400">
            Hãy khám phá sản phẩm và nhấn trái tim để lưu lại những món bạn quan tâm.
          </p>

          <button
            onClick={() => navigate('/products')}
            className={`mx-auto mt-8 h-11 px-7 text-sm ${OUTLINE_BUTTON}`}
          >
            <ShoppingBag className="h-4 w-4" />
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-slate-50 px-4 py-8 dark:bg-gray-900">
      <SEO title={`Yêu thích (${totalItems})`} noIndex />

      <main className="mx-auto w-full max-w-6xl">
        <section className="mb-5 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(filter => {
              const isActive = activeFilter === filter.id

              return (
                <button
                  key={filter.id}
                  onClick={() => handleChangeFilter(filter.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#0b74e5] text-white shadow-md shadow-blue-500/15'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-500 dark:text-gray-400" />

              <Select
                value={sortBy}
                onChange={handleChangeSort}
                options={SORTS.map(sort => ({
                  value: sort.id,
                  label: sort.label
                }))}
                className="wishlist-sort-select"
                popupClassName="wishlist-sort-dropdown"
              />
            </div>

            <button
              onClick={handleClearAll}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-red-50 hover:text-[#ff424e] active:scale-95 dark:bg-gray-700 dark:text-gray-300"
            >
              Xóa tất cả
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white shadow-sm dark:bg-gray-800">
          <div className="flex flex-col items-center px-6 pb-5 pt-7 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-gray-100">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-gray-400">
              {loadedItemsLabel} • {inStockCount} còn hàng
            </p>
          </div>

          <div className="hidden border-y border-slate-200 bg-slate-50 px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400 md:grid md:grid-cols-[1.8fr_0.8fr_0.8fr_0.8fr_36px] md:items-center md:gap-4">
            <span>Product name</span>
            <span>Unit price</span>
            <span>Stock status</span>
            <span className="text-center">Action</span>
            <span />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {filteredWishlist.length > 0 ? (
              filteredWishlist.map(item => (
                <WishlistTableRow
                  key={item.productId}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  addingToCart={addingToCart[item.productId]}
                  formatPrice={formatPrice}
                />
              ))
            ) : (
              <div className="p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700">
                  <Heart className="h-8 w-8 text-slate-400" />
                </div>

                <h3 className="text-lg font-extrabold text-slate-950 dark:text-gray-100">
                  Không có sản phẩm phù hợp
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                  Hãy đổi bộ lọc hoặc tiếp tục khám phá thêm sản phẩm mới.
                </p>

                <button
                  onClick={() => handleChangeFilter('all')}
                  className={`mt-5 h-10 px-6 text-sm ${OUTLINE_BUTTON}`}
                >
                  Xem tất cả
                </button>
              </div>
            )}
          </div>

          {hasNextPage && (
            <div className="flex justify-center border-t border-slate-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className={`h-10 px-8 text-sm ${OUTLINE_BUTTON}`}
              >
                {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
              </button>
            </div>
          )}

          {filteredWishlist.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">
                Đang hiển thị {filteredWishlist.length} sản phẩm • Đã tải {wishlistItems.length}/
                {totalItems}
              </p>

              <button
                onClick={handleAddAllToCart}
                disabled={filteredWishlist.filter(item => item.inStock).length === 0}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0b74e5] px-6 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-[#0969d8] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white"
              >
                <ShoppingCart className="h-4 w-4" />
                Add all to cart
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function WishlistTableRow({ item, onRemove, onAddToCart, addingToCart, formatPrice }) {
  const discountPct = Number(item.discountPercentage || 0)
  const price = Number(item.price || 0)
  const originalPrice = Number(item.originalPrice || 0)

  return (
    <div className="grid gap-3 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/40 md:grid-cols-[1.8fr_0.8fr_0.8fr_0.8fr_36px] md:items-center md:gap-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <Link
          to={`/products/${item.slug}`}
          className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-gray-700"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {discountPct > 0 && (
            <span className="absolute left-0.5 top-0.5 rounded bg-[#ff424e] px-1 py-0.5 text-[7px] font-bold leading-none text-white">
              -{discountPct}%
            </span>
          )}
        </Link>

        <div className="min-w-0">
          <Link to={`/products/${item.slug}`}>
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-950 transition-colors hover:text-[#0b74e5] dark:text-gray-100 dark:hover:text-blue-300">
              {item.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 md:hidden">
            {item.inStock ? 'Còn hàng' : 'Hết hàng'} • {formatPrice(price)}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[13px] font-bold text-slate-950 dark:text-gray-100">
          {formatPrice(price)}
        </p>

        {discountPct > 0 && originalPrice > price && (
          <p className="mt-0.5 text-[11px] font-medium text-slate-400 line-through dark:text-gray-500">
            {formatPrice(originalPrice)}
          </p>
        )}
      </div>

      <div>
        <span
          className={`inline-flex rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${
            item.inStock
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-red-50 text-[#ff424e] dark:bg-red-500/10'
          }`}
        >
          {item.inStock ? 'In Stock' : 'Out Stock'}
        </span>
      </div>

      <button
        onClick={() => onAddToCart(item)}
        disabled={addingToCart || !item.inStock}
        className={`h-8 min-w-[112px] px-4 text-[12px] md:mx-auto ${OUTLINE_BUTTON}`}
      >
        {addingToCart ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0b74e5] border-t-transparent" />
        ) : (
          'Add to Cart'
        )}
      </button>

      <button
        onClick={() => onRemove(item.productId)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-[#ff424e] dark:hover:bg-red-900/20"
        title="Xóa khỏi yêu thích"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default WishlistPage
