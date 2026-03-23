import React, { useState, useEffect } from 'react'
import { Clock, Tag, Timer, Zap, Star, Flame, Heart } from 'lucide-react'
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

const FlashSale = () => {

  const [flashSales, setFlashSales] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('all')
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 rounded-xl">
      <SEO
        title="Flash Sale – Giảm giá sốc"
        description="Flash Sale SmartMall – Giảm giá sốc mỗi ngày, số lượng có hạn. Nhanh tay sắm tài khoản game và phần mềm bản quyền giá tốt nhất!"
        url="https://smartmall.site/flash-sale"
      />
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-8 rounded-tl-xl rounded-tr-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
              <Zap className="w-8 h-8 mr-2 animate-bounce" />
              FLASH SALE
            </h1>
            <p className="text-xl opacity-90">Giảm giá sốc - Số lượng có hạn!</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {[
            { key: 'all', label: 'Tất cả', icon: Tag },
            { key: 'electronics', label: 'Điện tử', icon: Zap },
            { key: 'fashion', label: 'Thời trang', icon: Star },
            { key: 'home', label: 'Gia dụng', icon: Clock }
          ].map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category.key
                  ? 'bg-red-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Active Flash Sales */}
        {activeFlashSales.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center dark:text-gray-100">
              <Flame className="w-6 h-6 mr-2 text-red-600" />
              Flash Sale Đang Diễn Ra
            </h2>

            <div className="space-y-8">
              {activeFlashSales.map(sale => {
                const timeLeft = calculateTimeLeft(sale.endAt)
                return (
                  <div key={sale._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-200">
                    {/* Sale Header */}
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-2xl font-bold mb-2">{sale.name}</h3>
                          <p className="text-sm mt-1 opacity-80">
                            {`Từ ${formatDateTime(sale.startAt)} đến ${formatDateTime(sale.endAt)}`}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            {getStatusBadge(sale.status)}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                              -{sale.discountPercent}%
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                          <div className="text-center mb-2">
                            <Timer className="w-5 h-5 mx-auto mb-1" />
                            <p className="text-sm font-medium">Kết thúc sau</p>
                          </div>
                          <div className="flex space-x-2">
                            {[
                              { label: 'Ngày', value: timeLeft.days },
                              { label: 'Giờ', value: timeLeft.hours },
                              { label: 'Phút', value: timeLeft.minutes },
                              { label: 'Giây', value: timeLeft.seconds }
                            ].map(item => (
                              <div key={item.label} className="text-center">
                                <div className="bg-white text-red-600 rounded-lg px-2 py-1 font-bold text-lg min-w-[40px]">
                                  {item.value.toString().padStart(2, '0')}
                                </div>
                                <p className="text-xs mt-1">{item.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            Đã bán: {sale.soldQuantity}/{sale.maxQuantity}
                          </span>
                          <span>{Math.round((sale.soldQuantity / sale.maxQuantity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div
                            className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(sale.soldQuantity / sale.maxQuantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="p-6 dark:bg-gray-800 dark:border-gray-600 dark:border-solid dark:border-2 dark:border-t-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sale.products.map(product => {
                          const salePrice = product.price * (1 - sale.discountPercent / 100)
                          const savings = product.price - salePrice
                          return (
                            <Link
                              to={`/products/${product.slug}`}
                              key={product._id}
                              className="block group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
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
                              <div
                                key={product._id}
                                className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-solid dark:border-gray-600 dark:border-1"
                              >
                                <div className="relative">
                                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={product.thumbnail}
                                      alt={product.title}
                                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                  {/* Badge giảm gía */}
                                  <div className="absolute top-3 left-3">
                                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                                      -{sale.discountPercent}%
                                    </span>
                                  </div>
                                  {/* ❤️ Wishlist button */}
                                  {(() => {
                                    const productId = product._id || product.id
                                    const inWishlist = wishlistItems.some(i => i.productId === productId)
                                    return (
                                      <button
                                        onClick={e => handleToggleWishlist(e, product, salePrice)}
                                        disabled={wishlistLoading[productId]}
                                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 z-30
                                          ${inWishlist
                                            ? 'bg-pink-500 text-white border-pink-500 scale-110'
                                            : 'bg-white/95 text-gray-400 border-white/70 hover:text-pink-500 opacity-0 group-hover:opacity-100'
                                          }`}
                                        title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                      >
                                        {wishlistLoading[productId]
                                          ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                          : <Heart className={`w-4 h-4 transition-all duration-150 ${inWishlist ? 'fill-white' : ''}`} />
                                        }
                                      </button>
                                    )
                                  })()}
                                  {product.soldQuantity > 10 && (
                                    <div className="absolute bottom-3 right-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                                      Bán chạy
                                    </div>
                                  )}
                                  {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
                                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow animate-pulse">
                                      Sắp hết hàng
                                    </div>
                                  )}
                                  {product.stock === 0 && (
                                    <div className="absolute bottom-3 left-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                                      Hết hàng
                                    </div>
                                  )}
                                </div>
                                <div className="p-4 flex flex-col h-full">
                                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-base min-h-[50px] dark:text-gray-200">{product.title}</h4>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {product.rating ? Number(product.rating).toFixed(1) : 'Chưa có đánh giá'}
                                    </span>
                                    {product.soldQuantity > 0 && (
                                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{product.soldQuantity} đã bán</span>
                                    )}
                                  </div>
                                  <div className="min-h-[110px]">
                                    <div className="flex items-baseline gap-2 mb-1">
                                      <span className="text-2xl font-bold text-red-600">{formatCurrency(salePrice)}</span>
                                      <span className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
                                    </div>
                                    <div className="text-xs text-green-600 font-medium mb-1">Tiết kiệm {formatCurrency(savings)}</div>
                                    {product.stock > 0 && product.stock <= 10 && (
                                      <div className="text-xs text-orange-600 font-bold mb-1">Chỉ còn {product.stock} sản phẩm</div>
                                    )}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {product.deliveryEstimateDays > 0 && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                          🚚 Giao {product.deliveryEstimateDays} ngày
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center
    ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={product.stock === 0 || buyNowLoading[product._id || product.id]}
                                    style={{
                                      fontSize: '16px',
                                      letterSpacing: '0.5px'
                                    }}
                                    onClick={() => handleFlashSaleBuyNow(product, sale)}
                                  >
                                    {buyNowLoading[product._id || product.id] ? (
                                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                      </svg>
                                    ) : null}
                                    {product.stock === 0 ? 'Hết hàng' : 'Mua Ngay'}
                                  </button>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {upcomingFlashSales.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Flash Sale Sắp Diễn Ra
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingFlashSales.map(sale => {
                const timeUntilStart = getTimeUntilStart(sale.startAt)
                return (
                  <div key={sale._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
                      <h3 className="text-xl font-bold mb-2">{sale.name}</h3>
                      <p className="text-sm mt-1 opacity-80">{`Từ ${formatDateTime(sale.startAt)} đến ${formatDateTime(sale.endAt)}`}</p>
                      <div className="flex items-center space-x-4 mb-4 mt-2">
                        {getStatusBadge(sale.status)}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                          Giảm {sale.discountPercent}%
                        </span>
                      </div>
                      {timeUntilStart && (
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                          <p className="text-sm font-medium mb-2 text-center">Bắt đầu sau</p>
                          <div className="flex justify-center space-x-2">
                            {[
                              { label: 'Ngày', value: timeUntilStart.days },
                              { label: 'Giờ', value: timeUntilStart.hours },
                              { label: 'Phút', value: timeUntilStart.minutes }
                            ].map(item => (
                              <div key={item.label} className="text-center">
                                <div className="bg-white text-blue-600 rounded px-2 py-1 font-bold text-sm min-w-[30px]">
                                  {item.value.toString().padStart(2, '0')}
                                </div>
                                <p className="text-xs mt-1">{item.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-3">{sale.products.length} sản phẩm tham gia</p>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                        Đặt Nhắc Nhở
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {filteredFlashSales.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2 dark:text-gray-100">Không có Flash Sale nào</h3>
            <p className="text-gray-500 dark:text-gray-400">Hãy quay lại sau để không bỏ lỡ các chương trình khuyến mãi hấp dẫn!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlashSale
