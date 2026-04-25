import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Clock, Tag, Zap, Star, Flame, Heart, BarChart2, Bell, ShieldCheck, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { normalizeWishlistItems } from '@/lib/normalizeWishlistItems'
import { syncCartFromServer } from '@/lib/clientCache'
import { toggleCompareLocal } from '@/stores/compare'
import { getClientFlashSales } from '@/services/flashSaleService'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { message } from 'antd'
import { addToCart } from '@/services/cartsService'
import { getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cartLimits'
import { addToWishlistLocal, removeFromWishlistLocal } from '@/stores/wishlist'
import { toggleWishlist } from '@/services/wishlistService'
import SEO from '@/components/SEO'
import { motion } from 'framer-motion'
import { getStoredClientAccessToken } from '@/utils/auth'

const FLASH_SALE_PAGE_LIMIT = 10

const FlashSale = () => {
  const [flashSaleItems, setFlashSaleItems] = useState([])
  const [flashSaleCategories, setFlashSaleCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalFlashSaleItems, setTotalFlashSaleItems] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [buyNowLoading, setBuyNowLoading] = useState({})
  const [wishlistLoading, setWishlistLoading] = useState({})

  const cartItems = useSelector(state => state.cart.items) || []
  const compareItems = useSelector(state => state.compare.items)
  const wishlistItems = useSelector(state => normalizeWishlistItems(state.wishlist.items))

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tabsRef = useRef(null)
  const dragStateRef = useRef({ active: false, startX: 0, scrollLeft: 0, dragged: false })
  const [isDraggingTabs, setIsDraggingTabs] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'all'

  const normalizeFlashSaleResponse = res => {
    if (Array.isArray(res.items)) {
      return {
        items: res.items,
        categories: res.categories || [],
        total: res.total || 0,
        currentPage: res.currentPage || 1
      }
    }

    const categoryMap = new Map()
    const items = []

    ;(res.flashSales || []).forEach(sale => {
      ;(sale.products || []).forEach(product => {
        const category = product.productCategory
        const categoryKey = category?.slug || category?._id

        if (categoryKey && !categoryMap.has(categoryKey)) {
          categoryMap.set(categoryKey, {
            key: categoryKey,
            label: category.title || 'Chưa phân loại'
          })
        }

        const isCategoryMatched = selectedCategory === 'all' || category?.slug === selectedCategory || category?._id === selectedCategory
        if (!isCategoryMatched) return

        items.push({
          product,
          saleMeta: {
            flashSaleId: sale._id,
            name: sale.name,
            status: sale.status,
            discountPercent: sale.discountPercent,
            startAt: sale.startAt,
            endAt: sale.endAt,
            soldQuantity: sale.soldQuantity,
            maxQuantity: sale.maxQuantity
          }
        })
      })
    })

    return {
      items,
      categories: Array.from(categoryMap.values()),
      total: items.length,
      currentPage: res.currentPage || 1
    }
  }

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        setLoading(true)
        const res = await getClientFlashSales({
          mode: 'product',
          status: 'all',
          category: selectedCategory,
          page: 1,
          limit: FLASH_SALE_PAGE_LIMIT
        })
        const normalized = normalizeFlashSaleResponse(res)
        setFlashSaleItems(normalized.items)
        setFlashSaleCategories(normalized.categories)
        setCurrentPage(normalized.currentPage)
        setTotalFlashSaleItems(normalized.total)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashSales()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedCategory])

  const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.round(amount || 0))
  }

  const calculateTimeLeft = endTime => {
    const difference = new Date(endTime).getTime() - currentTime.getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  const getTimeUntilStart = startTime => {
    const difference = new Date(startTime).getTime() - currentTime.getTime()

    if (difference <= 0) return null

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  const formatDateTime = dt => dayjs(dt).format('DD/MM/YYYY HH:mm')

  const getProgressPercent = sale => {
    if (!sale?.maxQuantity || sale.maxQuantity <= 0) return 0
    return Math.min(100, Math.round((sale.soldQuantity / sale.maxQuantity) * 100))
  }

  const handleFlashSaleBuyNow = async (product, sale) => {
    const productId = product._id || product.id

    if (buyNowLoading[productId]) return

    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để mua sản phẩm!')
      navigate('/user/login')
      return
    }

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setBuyNowLoading(prev => ({ ...prev, [productId]: true }))

    try {
      await addToCart({
        productId,
        quantity: 1,
        flashSaleId: sale?._id,
        salePrice: Math.round(product.price * (1 - sale.discountPercent / 100)),
        isFlashSale: true
      })

      await syncCartFromServer(dispatch)

      message.success('Đã thêm vào giỏ hàng! Chuyển đến giỏ hàng...')

      navigate('/cart', {
        state: {
          buyNowProductId: productId
        }
      })
    } catch (err) {
      message.error(err.message || 'Mua ngay thất bại!')
    } finally {
      setBuyNowLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleToggleWishlist = async (e, product, salePrice) => {
    e.preventDefault()
    e.stopPropagation()

    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm vào danh sách yêu thích!')
      navigate('/user/login')
      return
    }

    const productId = product._id || product.id

    if (wishlistLoading[productId]) return

    const isInWishlist = wishlistItems.some(i => i.productId === productId)

    if (isInWishlist) {
      dispatch(removeFromWishlistLocal(productId))
    } else {
      dispatch(
        addToWishlistLocal({
          productId,
          name: product.title,
          price: salePrice,
          originalPrice: product.price,
          discountPercentage: 0,
          image: product.thumbnail,
          slug: product.slug,
          stock: product.stock,
          inStock: product.stock > 0,
          rate: product.rate
        })
      )
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }))

    try {
      await toggleWishlist(productId)
    } catch {
      if (isInWishlist) {
        dispatch(
          addToWishlistLocal({
            productId,
            name: product.title,
            price: salePrice,
            originalPrice: product.price,
            discountPercentage: 0,
            image: product.thumbnail,
            slug: product.slug,
            stock: product.stock,
            inStock: product.stock > 0,
            rate: product.rate
          })
        )
      } else {
        dispatch(removeFromWishlistLocal(productId))
      }

      message.error('Có lỗi xảy ra, thử lại!')
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const categories = useMemo(() => [
    { key: 'all', label: 'Tất cả', icon: Tag },
    ...flashSaleCategories.map(category => ({
      key: category.key,
      label: category.label,
      icon: Tag
    }))
  ], [flashSaleCategories])

  useEffect(() => {
    if (loading || selectedCategory === 'all') return
    if (!categories.some(category => category.key === selectedCategory)) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.delete('category')
        return next
      }, { replace: true })
    }
  }, [categories, loading, selectedCategory, setSearchParams])

  const handleCategoryChange = categoryKey => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)

      if (categoryKey === 'all') {
        next.delete('category')
      } else {
        next.set('category', categoryKey)
      }

      return next
    })
  }

  const handleScrollTabs = direction => {
    tabsRef.current?.scrollBy({
      left: direction === 'prev' ? -260 : 260,
      behavior: 'smooth'
    })
  }

  const handleTabsPointerDown = e => {
    if (!tabsRef.current) return

    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: tabsRef.current.scrollLeft,
      dragged: false
    }
    setIsDraggingTabs(true)
  }

  const handleTabsPointerMove = e => {
    const dragState = dragStateRef.current
    if (!dragState.active || !tabsRef.current) return

    const distance = e.clientX - dragState.startX
    if (Math.abs(distance) <= 8) return

    e.preventDefault()
    dragState.dragged = true
    tabsRef.current.scrollLeft = dragState.scrollLeft - distance
  }

  const handleTabsPointerUp = () => {
    dragStateRef.current.active = false
    setIsDraggingTabs(false)
  }

  const handleTabsClickCapture = e => {
    if (!dragStateRef.current.dragged) return

    e.preventDefault()
    e.stopPropagation()
    dragStateRef.current.dragged = false
  }

  const handleTabClick = categoryKey => {
    handleCategoryChange(categoryKey)
  }

  const handleLoadMore = async () => {
    if (loadingMore || flashSaleItems.length >= totalFlashSaleItems) return

    const nextPage = currentPage + 1
    setLoadingMore(true)

    try {
      const res = await getClientFlashSales({
        mode: 'product',
        status: 'all',
        category: selectedCategory,
        page: nextPage,
        limit: FLASH_SALE_PAGE_LIMIT
      })
      const normalized = normalizeFlashSaleResponse(res)
      setFlashSaleItems(prev => [...prev, ...normalized.items])
      setCurrentPage(normalized.currentPage || nextPage)
      setTotalFlashSaleItems(normalized.total)
    } finally {
      setLoadingMore(false)
    }
  }

  const filteredFlashSales = useMemo(() => {
    const saleMap = new Map()

    flashSaleItems.forEach(item => {
      const saleMeta = item.saleMeta || {}
      const saleId = saleMeta.flashSaleId || 'flash-sale'

      if (!saleMap.has(saleId)) {
        saleMap.set(saleId, {
          _id: saleId,
          name: saleMeta.name || 'Flash Sale',
          status: saleMeta.status || 'active',
          discountPercent: saleMeta.discountPercent || 0,
          startAt: saleMeta.startAt,
          endAt: saleMeta.endAt,
          soldQuantity: saleMeta.soldQuantity || 0,
          maxQuantity: saleMeta.maxQuantity || 0,
          products: []
        })
      }

      saleMap.get(saleId).products.push(item.product)
    })

    return Array.from(saleMap.values())
  }, [flashSaleItems])

  const hasMoreFlashSales = flashSaleItems.length < totalFlashSaleItems
  const activeFlashSales = filteredFlashSales.filter(sale => sale.status === 'active')
  const upcomingFlashSales = filteredFlashSales.filter(sale => sale.status === 'scheduled')

  const viewport = { once: true, amount: 0.16 }

  const SaleHeaderSkeleton = ({ upcoming = false }) => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`border-b p-4 sm:p-5 ${upcoming ? 'border-slate-200 bg-amber-50 dark:border-slate-800 dark:bg-amber-500/10' : 'border-red-100 bg-gradient-to-r from-red-50 to-orange-50 dark:border-red-500/20 dark:from-red-500/10 dark:to-orange-500/10'}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-full max-w-[320px] rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-4 w-full max-w-[280px] rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[...Array(upcoming ? 3 : 4)].map((_, i) => (
              <div key={i} className="h-[58px] w-[54px] rounded-lg bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>

        {!upcoming && (
          <div className="mt-4">
            <div className="mb-1.5 h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2 rounded-full bg-white dark:bg-slate-800" />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="aspect-square rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const TimeBox = ({ value, label }) => (
    <div className="min-w-[54px] rounded-lg bg-slate-900 px-2.5 py-2 text-center text-white shadow-sm dark:bg-white dark:text-slate-950">
      <div className="text-lg font-black leading-none">{String(value).padStart(2, '0')}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/65 dark:text-slate-500">
        {label}
      </div>
    </div>
  )

  const StatusBadge = ({ status }) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
          <Flame className="h-3.5 w-3.5" />
          Đang bán
        </span>
      )
    }

    if (status === 'scheduled') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
          <Clock className="h-3.5 w-3.5" />
          Sắp mở
        </span>
      )
    }

    return (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Đã kết thúc
      </span>
    )
  }

  const ProductCard = ({ product, sale }) => {
    const productId = product._id || product.id
    const salePrice = product.price * (1 - sale.discountPercent / 100)
    const savings = product.price - salePrice
    const inWishlist = wishlistItems.some(i => i.productId === productId)
    const inCompare = compareItems.some(i => i.productId === productId)

    return (
      <div className="h-full">
        <Link
          to={`/products/${product.slug}`}
          className="group block h-full"
          style={{ textDecoration: 'none', color: 'inherit' }}
          state={{
            flashSaleInfo: {
              salePrice: Math.round(product.price * (1 - sale.discountPercent / 100)),
              discountPercent: sale.discountPercent,
              flashSaleId: sale._id,
              endAt: sale.endAt
            }
          }}
        >
          <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-500/40">
            <div className="absolute left-2.5 top-2.5 z-20 flex flex-col items-start gap-1.5">
              <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-black text-white shadow-sm">
                -{sale.discountPercent}%
              </span>

              {product.soldQuantity > 10 && (
                <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  Bán chạy
                </span>
              )}
            </div>

            <div className="absolute right-2.5 top-2.5 z-20 flex flex-col gap-1.5">
              <button
                onClick={e => handleToggleWishlist(e, product, salePrice)}
                disabled={wishlistLoading[productId]}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm shadow-sm transition-all ${
                  inWishlist
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-slate-200 bg-white/95 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-400 dark:hover:bg-red-500/10'
                }`}
                title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                {wishlistLoading[productId] ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Heart className={`h-4 w-4 ${inWishlist ? 'fill-white' : ''}`} />
                )}
              </button>

              <button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()

                  dispatch(
                    toggleCompareLocal({
                      productId,
                      name: product.title,
                      price: salePrice,
                      originalPrice: product.price,
                      discountPercentage: sale.discountPercent || 0,
                      image: product.thumbnail,
                      slug: product.slug,
                      rate: product.rate,
                      stock: product.stock,
                      inStock: product.stock > 0
                    })
                  )
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm shadow-sm transition-all ${
                  inCompare
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950'
                    : 'border-slate-200 bg-white/95 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                title="So sánh sản phẩm"
              >
                <BarChart2 className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-2.5 dark:bg-slate-950">
              <div className="aspect-square overflow-hidden rounded-lg bg-white dark:bg-slate-900">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-3">
              <h4 className="line-clamp-2 h-10 text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
                {product.title}
              </h4>

              <div className="mt-2 flex h-4 items-center gap-1.5 overflow-hidden text-xs text-slate-500 dark:text-slate-400">
                <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />

                <span className="truncate">
                  {product.rating ? Number(product.rating).toFixed(1) : 'Chưa có đánh giá'}
                </span>

                {product.soldQuantity > 0 && (
                  <span className="shrink-0 whitespace-nowrap">
                    • Đã bán {product.soldQuantity}
                  </span>
                )}
              </div>

              <div className="mt-2 min-h-[48px]">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-lg font-black text-red-600 dark:text-red-400">
                    {formatCurrency(salePrice)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <p className="mt-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                  Tiết kiệm {formatCurrency(savings)}
                </p>
              </div>

              <div className="mt-2 mb-2 min-h-[30px] space-y-1.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                    style={{
                      width: `${Math.min(100, Math.max(12, product.soldQuantity ? product.soldQuantity * 5 : 20))}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="truncate">{product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</span>
                  {product.deliveryEstimateDays > 0 && (
                    <span className="shrink-0 whitespace-nowrap">Giao {product.deliveryEstimateDays} ngày</span>
                  )}
                </div>
              </div>

              <button
                className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] ${
                  product.stock === 0 ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={product.stock === 0 || buyNowLoading[productId]}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleFlashSaleBuyNow(product, sale)
                }}
              >
                {buyNowLoading[productId] && (
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}

                {product.stock === 0 ? 'Hết hàng' : 'Mua ngay'}
              </button>
            </div>
          </article>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <SEO
        title="Flash Sale – Giảm giá sốc"
        description="Flash Sale SmartMall – Giảm giá sốc mỗi ngày, số lượng có hạn. Nhanh tay sắm tài khoản game và phần mềm bản quyền giá tốt nhất!"
        url="https://smartmall.site/flash-sale"
      />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="sticky top-0 z-30 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex h-12 items-center gap-2">
              <button
                type="button"
                onClick={() => handleScrollTabs('prev')}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                aria-label="Xem danh mục trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={tabsRef}
                onPointerDown={handleTabsPointerDown}
                onPointerMove={handleTabsPointerMove}
                onPointerUp={handleTabsPointerUp}
                onPointerCancel={handleTabsPointerUp}
                onClickCapture={handleTabsClickCapture}
                className={`flex h-12 flex-1 touch-pan-y items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                  isDraggingTabs ? 'cursor-grabbing select-none' : 'cursor-grab'
                }`}
              >
                {categories.map(category => {
                  const Icon = category.icon
                  const active = selectedCategory === category.key

                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => handleTabClick(category.key)}
                      className={`inline-flex h-12 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-bold transition-all ${
                        active
                          ? 'border-red-600 bg-red-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => handleScrollTabs('next')}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                aria-label="Xem danh mục tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {loading && (
            <section className="mt-6 space-y-8 animate-pulse">
              <SaleHeaderSkeleton />
              <SaleHeaderSkeleton upcoming />
            </section>
          )}

          {!loading && activeFlashSales.length > 0 && (
            <section id="active-sale-section" className="mt-6 space-y-8">
              {activeFlashSales.map((sale, saleIndex) => {
                const timeLeft = calculateTimeLeft(sale.endAt)
                const progressPercent = getProgressPercent(sale)

                return (
                  <motion.article
                    key={sale._id}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: saleIndex * 0.06, ease: 'easeOut' }}
                    viewport={viewport}
                  >
                    <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-500/20 dark:bg-slate-900">
                      <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-4 dark:border-red-500/20 dark:from-red-500/10 dark:to-orange-500/10 sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <StatusBadge status={sale.status} />

                              <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-black text-red-600 shadow-sm dark:bg-slate-950 dark:text-red-300">
                                Giảm {sale.discountPercent}%
                              </span>
                            </div>

                            <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                              {sale.name}
                            </h2>

                            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                              <Clock className="h-4 w-4" />
                              {formatDateTime(sale.startAt)} - {formatDateTime(sale.endAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <TimeBox value={timeLeft.days} label="Ngày" />
                            <TimeBox value={timeLeft.hours} label="Giờ" />
                            <TimeBox value={timeLeft.minutes} label="Phút" />
                            <TimeBox value={timeLeft.seconds} label="Giây" />
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span>
                              Đã bán {sale.soldQuantity}/{sale.maxQuantity}
                            </span>
                            <span>{progressPercent}%</span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                            <span className="h-5 w-1 rounded-full bg-red-600" />
                            Sản phẩm đang giảm
                          </h3>

                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {sale.products?.length || 0} sản phẩm
                          </span>
                        </div>

                        <div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {(sale.products || []).map(product => (
                            <ProductCard key={product._id || product.id} product={product} sale={sale} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </section>
          )}

          {!loading && upcomingFlashSales.length > 0 && (
            <section id="upcoming-sale-section" className="mt-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Flash Sale sắp diễn ra
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {upcomingFlashSales.map((sale, saleIndex) => {
                  const timeUntilStart = getTimeUntilStart(sale.startAt)

                  return (
                    <motion.article
                      key={sale._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: saleIndex * 0.05, ease: 'easeOut' }}
                      viewport={viewport}
                    >
                      <div className="border-b border-slate-200 bg-amber-50 p-4 dark:border-slate-800 dark:bg-amber-500/10">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <StatusBadge status={sale.status} />

                          <span className="rounded-md bg-white px-2.5 py-1 text-xs font-black text-amber-700 shadow-sm dark:bg-slate-950 dark:text-amber-300">
                            Giảm {sale.discountPercent}%
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-slate-950 dark:text-white">{sale.name}</h3>

                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          Từ {formatDateTime(sale.startAt)} đến {formatDateTime(sale.endAt)}
                        </p>

                        {timeUntilStart && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <TimeBox value={timeUntilStart.days} label="Ngày" />
                            <TimeBox value={timeUntilStart.hours} label="Giờ" />
                            <TimeBox value={timeUntilStart.minutes} label="Phút" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {sale.products?.length || 0} sản phẩm tham gia
                          </p>

                          <span className="text-xs font-bold text-amber-600 dark:text-amber-300">Sắp mở bán</span>
                        </div>

                        <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 py-2.5 text-sm font-black text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/15">
                          <Bell className="h-4 w-4" />
                          Đặt nhắc nhở
                        </button>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </section>
          )}

          {!loading && filteredFlashSales.length === 0 && (
            <motion.div
              className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Clock className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="text-lg font-black text-slate-800 dark:text-white">Không có Flash Sale nào</h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Hãy quay lại sau để không bỏ lỡ các chương trình khuyến mãi hấp dẫn.
              </p>
            </motion.div>
          )}

          {!loading && hasMoreFlashSales && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-black text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                {loadingMore ? 'Đang tải...' : 'Xem thêm'}
              </button>
            </div>
          )}

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Sản phẩm chính hãng',
                  desc: 'Đầy đủ giấy phép, thông tin rõ ràng.'
                },
                {
                  icon: Zap,
                  title: 'Giao nhanh sau thanh toán',
                  desc: 'Nhận key hoặc tài khoản nhanh chóng.'
                },
                {
                  icon: Clock,
                  title: 'Hỗ trợ tận tâm',
                  desc: 'Luôn có hỗ trợ khi phát sinh vấn đề.'
                }
              ].map(item => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default FlashSale
