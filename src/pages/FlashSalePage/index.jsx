import React, { useState, useEffect } from 'react'
import { Clock, Tag, Timer, Zap, Star, Flame, Heart, BarChart2 } from 'lucide-react'
import { toggleCompareLocal } from '@/stores/compare'
import { getClientFlashSales } from '@/services/flashSaleService'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { addToCart, getCart } from '@/services/cartsService'
import { setCart } from '@/stores/cart'
import { addToWishlistLocal, removeFromWishlistLocal } from '@/stores/wishlist'
import { toggleWishlist } from '@/services/wishlistService'
import SEO from '@/components/SEO'
import { motion } from 'framer-motion'

const FlashSale = () => {

  const [flashSales, setFlashSales] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const compareItems = useSelector(state => state.compare.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [buyNowLoading, setBuyNowLoading] = useState({})
  const [wishlistLoading, setWishlistLoading] = useState({})

  const wishlistItems = useSelector(state => state.wishlist.items)

  useEffect(() => {
    const fetchFlashSales = async () => {
      const res = await getClientFlashSales({ status: 'all', limit: 10 })
      setFlashSales(res.flashSales || [])
    }
    fetchFlashSales()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
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
    if (difference <= 0) {
      return null
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  const getStatusBadge = status => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
          <Flame className="w-3 h-3 mr-1" />
          ĐANG DIỄN RA
        </span>
      )
    } else if (status === 'scheduled') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          SẮP DIỄN RA
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">ĐÃ KẾT THÚC</span>
      )
    }
  }

  const handleFlashSaleBuyNow = async (product, sale) => {
    if (buyNowLoading[product._id || product.id]) return

    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để mua sản phẩm!')
      navigate('/user/login')
      return
    }

    setBuyNowLoading(prev => ({ ...prev, [product._id || product.id]: true }))

    try {
      await addToCart({
        productId: product._id || product.id,
        quantity: 1,
        flashSaleId: sale?._id,
        salePrice: Math.round(product.price * (1 - sale.discountPercent / 100)),
        isFlashSale: true
      })
      const cart = await getCart()
      dispatch(setCart(cart.items))
      message.success('Đã thêm vào giỏ hàng! Chuyển đến giỏ hàng...')

      navigate('/cart', {
        state: {
          buyNowProductId: product._id || product.id
        }
      })
    } catch (err) {
      message.error('Mua ngay thất bại!')
    } finally {
      setBuyNowLoading(prev => ({ ...prev, [product._id || product.id]: false }))
    }
  }

  const handleToggleWishlist = async (e, product, salePrice) => {
    e.preventDefault()
    e.stopPropagation()

    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm vào danh sách yêu thích!')
      navigate('/user/login')
      return
    }

    const productId = product._id || product.id
    if (wishlistLoading[productId]) return

    const isInWishlist = wishlistItems.some(i => i.productId === productId)

    // ✅ OPTIMISTIC UI
    if (isInWishlist) {
      dispatch(removeFromWishlistLocal(productId))
    } else {
      dispatch(addToWishlistLocal({
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
      }))
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }))
    try {
      await toggleWishlist(productId)
    } catch {
      // Revert nếu lỗi
      if (isInWishlist) {
        dispatch(addToWishlistLocal({
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
        }))
      } else {
        dispatch(removeFromWishlistLocal(productId))
      }
      message.error('Có lỗi xảy ra, thử lại!')
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const filteredFlashSales = flashSales.filter(sale => {
    if (selectedCategory === 'all') return true
    return sale.products.some(product => product.category === selectedCategory)
  })

  const activeFlashSales = filteredFlashSales.filter(sale => sale.status === 'active')
  const upcomingFlashSales = filteredFlashSales.filter(sale => sale.status === 'scheduled')

  const formatDateTime = dt => dayjs(dt).format('DD/MM/YYYY HH:mm')

  const getProgressPercent = sale => {
    if (!sale?.maxQuantity || sale.maxQuantity <= 0) return 0
    return Math.min(100, Math.round((sale.soldQuantity / sale.maxQuantity) * 100))
  }

  const categories = [
    { key: 'all', label: 'Tất cả', icon: Tag },
    { key: 'electronics', label: 'Điện tử', icon: Zap },
    { key: 'fashion', label: 'Thời trang', icon: Star },
    { key: 'home', label: 'Gia dụng', icon: Clock }
  ]

  const highestDiscount = flashSales.length > 0 ? Math.max(...flashSales.map(sale => sale.discountPercent || 0)) : 0

  const featuredSale = activeFlashSales[0] || upcomingFlashSales[0]
  const featuredImage = featuredSale?.products?.[0]?.thumbnail
  const viewport = { once: true, amount: 0.2 }

  const statsCards = [
    {
      label: 'Đang diễn ra',
      value: activeFlashSales.length,
      icon: Flame,
      iconWrapClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
      valueClass: 'text-slate-900 dark:text-gray-100'
    },
    {
      label: 'Sắp bắt đầu',
      value: upcomingFlashSales.length,
      icon: Clock,
      iconWrapClass: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
      valueClass: 'text-slate-900 dark:text-gray-100'
    },
    {
      label: 'Mức giảm cao nhất',
      value: `-${highestDiscount}%`,
      icon: Timer,
      iconWrapClass: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
      valueClass: 'text-rose-600 dark:text-rose-300'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <SEO
        title="Flash Sale – Giảm giá sốc"
        description="Flash Sale SmartMall – Giảm giá sốc mỗi ngày, số lượng có hạn. Nhanh tay sắm tài khoản game và phần mềm bản quyền giá tốt nhất!"
        url="https://smartmall.site/flash-sale"
      />

      <main className="min-h-screen">
        <motion.section
          className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <motion.div
              className="z-10"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              viewport={viewport}
            >
              <motion.span
                className="mb-6 inline-flex rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.02, ease: 'easeOut' }}
                viewport={viewport}
              >
                EXCLUSIVE EVENT
              </motion.span>

              <motion.h1
                className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-slate-900 dark:text-gray-100 sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
                viewport={viewport}
              >
                FLASH <span className="text-blue-600 dark:text-blue-400">SALE</span>
              </motion.h1>
              <motion.p
                className="mt-4 text-xl font-bold text-slate-700 dark:text-gray-300"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                viewport={viewport}
              >
                Deal giới hạn mỗi ngày
              </motion.p>
              <motion.p
                className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-gray-400 sm:text-lg"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.14, ease: 'easeOut' }}
                viewport={viewport}
              >
                Giảm giá sốc – số lượng có hạn. Mua nhanh để không lỡ deal tốt!
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
                viewport={viewport}
              >
                <button
                  onClick={() => document.getElementById('active-sale-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3.5 text-base font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
                >
                  Săn Deal Ngay
                </button>
                <button
                  onClick={() => document.getElementById('upcoming-sale-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="rounded-xl bg-slate-200 px-7 py-3.5 text-base font-bold text-slate-800 transition-colors hover:bg-slate-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  Xem Lịch Hẹn
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative aspect-square max-h-[520px] w-full"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-500/20 blur-3xl" />
              <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt="Flash Sale"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/20 text-center">
                    <Zap className="mb-3 h-12 w-12 text-blue-600" />
                    <p className="px-6 text-sm font-medium text-slate-600 dark:text-gray-300">
                      Flash Sale đang cập nhật sản phẩm mới, quay lại trong giây lát nhé!
                    </p>
                  </div>
                )}
              </div>

              <motion.div
                className="absolute -bottom-6 -left-6 max-w-[220px] rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl dark:border-gray-600 dark:bg-gray-800/80"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
                viewport={viewport}
              >
                <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-300">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-bold">License Verified</span>
                </div>
                <p className="text-xs leading-tight text-slate-600 dark:text-gray-300">Sản phẩm chính hãng, giao key nhanh, hỗ trợ tận tâm.</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="border-y border-slate-200/70 bg-slate-100/70 px-4 py-10 dark:border-gray-700 dark:bg-gray-800/50 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {statsCards.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                  viewport={viewport}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconWrapClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{item.label}</p>
                    <p className={`text-2xl font-extrabold ${item.valueClass}`}>{item.value}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={viewport}
        >
          <motion.div
            className="mb-12 flex gap-3 overflow-x-auto pb-2"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            {categories.map(category => (
              <motion.button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {activeFlashSales.length > 0 && (
            <motion.section
              id="active-sale-section"
              className="space-y-10"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              viewport={viewport}
            >
              {activeFlashSales.map((sale, saleIndex) => {
                const timeLeft = calculateTimeLeft(sale.endAt)
                const progressPercent = getProgressPercent(sale)

                return (
                  <motion.article
                    key={sale._id}
                    className="space-y-8"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: saleIndex * 0.08, ease: 'easeOut' }}
                    viewport={viewport}
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100/80 p-7 dark:border-gray-700 dark:bg-gray-800/60 md:p-10"
                      initial={{ opacity: 0, scale: 0.99 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      viewport={viewport}
                    >
                      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <motion.div
                          initial={{ opacity: 0, x: -14 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          viewport={viewport}
                        >
                          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100 md:text-4xl">{sale.name}</h2>
                          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-300">
                            <Clock className="h-4 w-4" />
                            {`${formatDateTime(sale.startAt)} - ${formatDateTime(sale.endAt)}`}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            {getStatusBadge(sale.status)}
                            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                              Giảm {sale.discountPercent}%
                            </span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex flex-wrap justify-center gap-3"
                          initial={{ opacity: 0, x: 14 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
                          viewport={viewport}
                        >
                          {[
                            { label: 'Ngày', value: timeLeft.days },
                            { label: 'Giờ', value: timeLeft.hours },
                            { label: 'Phút', value: timeLeft.minutes },
                            { label: 'Giây', value: timeLeft.seconds }
                          ].map((item, timerIndex) => (
                            <motion.div
                              key={item.label}
                              className="text-center"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35, delay: 0.06 + timerIndex * 0.04, ease: 'easeOut' }}
                              viewport={viewport}
                            >
                              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-300">
                                {item.value.toString().padStart(2, '0')}
                              </div>
                              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{item.label}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>

                      <motion.div
                        className="relative z-10 mt-6"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
                        viewport={viewport}
                      >
                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-gray-300">
                          <span>
                            Đã bán: {sale.soldQuantity}/{sale.maxQuantity}
                          </span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>

                    <motion.h3
                      className="flex items-center gap-3 text-2xl font-extrabold text-slate-900 dark:text-gray-100"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      viewport={viewport}
                    >
                      <span className="h-9 w-1.5 rounded-full bg-blue-600" />
                      Flash Sale Đang Diễn Ra
                    </motion.h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                      {(sale.products || []).map((product, productIndex) => {
                        const salePrice = product.price * (1 - sale.discountPercent / 100)
                        const savings = product.price - salePrice
                        const productId = product._id || product.id
                        const inWishlist = wishlistItems.some(i => i.productId === productId)
                        const inCompare = compareItems.some(i => i.productId === productId)

                        return (
                          <motion.div
                            key={productId}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: Math.min(productIndex * 0.05, 0.25), ease: 'easeOut' }}
                            viewport={viewport}
                          >
                            <Link
                              to={`/products/${product.slug}`}
                              className="group block"
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
                              <article className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                                <div className="absolute left-4 top-4 z-20 flex gap-2">
                                  <span className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">-{sale.discountPercent}%</span>
                                  {product.soldQuantity > 10 && (
                                    <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">Bán chạy</span>
                                  )}
                                </div>

                                <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
                                  <button
                                    onClick={e => handleToggleWishlist(e, product, salePrice)}
                                    disabled={wishlistLoading[productId]}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-all ${
                                      inWishlist
                                        ? 'scale-110 border-pink-500 bg-pink-500 text-white'
                                        : 'border-slate-200 bg-white/95 text-slate-400 hover:text-pink-500 dark:border-gray-600 dark:bg-gray-800'
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
                                      dispatch(toggleCompareLocal({
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
                                      }))
                                    }}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-all ${
                                      inCompare
                                        ? 'scale-110 border-blue-500 bg-blue-500 text-white'
                                        : 'border-slate-200 bg-white/95 text-slate-400 hover:text-blue-500 dark:border-gray-600 dark:bg-gray-800'
                                    }`}
                                    title="So sánh sản phẩm"
                                  >
                                    <BarChart2 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="mb-5 mt-8 aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-gray-700/40">
                                  <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>

                                <h4 className="mb-2 line-clamp-2 min-h-[56px] text-lg font-bold text-slate-900 dark:text-gray-100">{product.title}</h4>

                                <div className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{product.rating ? Number(product.rating).toFixed(1) : 'Chưa có đánh giá'}</span>
                                  {product.soldQuantity > 0 && <span className="text-xs">• {product.soldQuantity} đã bán</span>}
                                </div>

                                <div className="mb-4">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-300">{formatCurrency(salePrice)}</span>
                                    <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
                                  </div>
                                  <p className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-300">Tiết kiệm {formatCurrency(savings)}</p>

                                  {product.stock > 0 && product.stock <= 10 && (
                                    <p className="mt-1 text-xs font-semibold text-orange-600">Chỉ còn {product.stock} sản phẩm</p>
                                  )}

                                  {product.deliveryEstimateDays > 0 && (
                                    <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                      🚚 Giao {product.deliveryEstimateDays} ngày
                                    </span>
                                  )}
                                </div>

                                <button
                                  className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 ${
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
                                    <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                  )}
                                  {product.stock === 0 ? 'Hết hàng' : 'Mua ngay'}
                                </button>
                              </article>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.article>
                )
              })}
            </motion.section>
          )}

          {upcomingFlashSales.length > 0 && (
            <motion.section
              id="upcoming-sale-section"
              className="mt-14 space-y-6"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              viewport={viewport}
            >
              <motion.h2
                className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-gray-100"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                viewport={viewport}
              >
                <Clock className="h-6 w-6 text-blue-600" />
                Flash Sale Sắp Diễn Ra
              </motion.h2>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {upcomingFlashSales.map((sale, saleIndex) => {
                  const timeUntilStart = getTimeUntilStart(sale.startAt)

                  return (
                    <motion.article
                      key={sale._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: saleIndex * 0.08, ease: 'easeOut' }}
                      viewport={viewport}
                    >
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        viewport={viewport}
                      >
                        <h3 className="mb-2 text-xl font-bold">{sale.name}</h3>
                        <p className="text-sm text-white/90">{`Từ ${formatDateTime(sale.startAt)} đến ${formatDateTime(sale.endAt)}`}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {getStatusBadge(sale.status)}
                          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                            Giảm {sale.discountPercent}%
                          </span>
                        </div>

                        {timeUntilStart && (
                          <div className="mt-4 rounded-xl bg-white/10 p-3">
                            <p className="mb-2 text-center text-sm font-semibold">Bắt đầu sau</p>
                            <div className="flex justify-center gap-2">
                              {[
                                { label: 'Ngày', value: timeUntilStart.days },
                                { label: 'Giờ', value: timeUntilStart.hours },
                                { label: 'Phút', value: timeUntilStart.minutes }
                              ].map(item => (
                                <div key={item.label} className="text-center">
                                  <div className="min-w-[34px] rounded bg-white px-2 py-1 text-sm font-bold text-blue-600">
                                    {item.value.toString().padStart(2, '0')}
                                  </div>
                                  <p className="mt-1 text-xs">{item.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        className="p-5"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
                        viewport={viewport}
                      >
                        <p className="mb-3 text-sm text-slate-600 dark:text-gray-300">{sale.products.length} sản phẩm tham gia</p>
                        <button className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700">
                          Đặt Nhắc Nhở
                        </button>
                      </motion.div>
                    </motion.article>
                  )
                })}
              </div>
            </motion.section>
          )}

          {filteredFlashSales.length === 0 && (
            <motion.div
              className="rounded-2xl border border-slate-200 bg-white py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              viewport={viewport}
            >
              <Clock className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-100">Không có Flash Sale nào</h3>
              <p className="text-gray-500 dark:text-gray-400">Hãy quay lại sau để không bỏ lỡ các chương trình khuyến mãi hấp dẫn!</p>
            </motion.div>
          )}
        </motion.section>

        <motion.section
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={viewport}
        >
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white md:p-12"
            initial={{ opacity: 0, scale: 0.985 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                viewport={viewport}
              >
                <h2 className="mb-5 text-3xl font-extrabold leading-tight md:text-4xl">Cam kết bảo mật & Bản quyền 100%</h2>
                <ul className="space-y-3 text-sm leading-relaxed md:text-base">
                  <li className="flex items-start gap-3">
                    <Star className="mt-0.5 h-5 w-5 text-blue-100" />
                    <span>Sản phẩm chính hãng, đầy đủ giấy phép sử dụng.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-5 w-5 text-blue-100" />
                    <span>Giao hàng tự động, nhận key nhanh sau thanh toán.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-blue-100" />
                    <span>Hỗ trợ kỹ thuật tận tâm khi có vấn đề phát sinh.</span>
                  </li>
                </ul>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '10k+', label: 'Khách hàng' },
                  { value: '99%', label: 'Hài lòng' },
                  { value: '24/7', label: 'Hỗ trợ' },
                  { value: '0%', label: 'Rủi ro' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
                    viewport={viewport}
                  >
                    <p className="text-3xl font-extrabold">{item.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-blue-100">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}

export default FlashSale
