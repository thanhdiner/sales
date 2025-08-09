import { useEffect, useState } from 'react'
import { Star, ShoppingCart, Zap, Heart, Share2, Minus, Plus, Shield, Truck, RotateCcw, Award, Eye, Clock } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { message, Spin } from 'antd'
import { getProductDetail } from '@/services/productService'
import { addToCart, getCart } from '@/services/cartsService'
import { useDispatch } from 'react-redux'
import { setCart } from '@/stores/cart'
import Error404 from '@/pages/Error404'
import titles from '@/utils/titles'

function ProductsDetail() {
  titles('Chi tiết sản phẩm')
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const [maxAvailable, setMaxAvailable] = useState(0)
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  // Helper: format price
  const formatPrice = price => {
    if (!price && price !== 0) return '0₫'
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  // Get flashSaleInfo nếu vào từ flash sale (truyền qua state)
  const flashSaleInfo = location.state?.flashSaleInfo || null

  // Tính giá, discountPercent, priceNew, savings
  let priceOrigin = 0,
    priceNew = 0,
    discountPercent = 0,
    savings = 0,
    isFlashSale = false
  if (product) {
    if (flashSaleInfo && flashSaleInfo.salePrice) {
      // Đang ở flash sale
      priceOrigin = Number(product.price) || 0
      priceNew = Number(flashSaleInfo.salePrice) || priceOrigin
      discountPercent = Number(flashSaleInfo.discountPercent) || 0
      isFlashSale = true
    } else {
      // Không flash sale, lấy giá mặc định
      priceOrigin = Number(product.price) || 0
      discountPercent = Number(product.discountPercentage) || 0
      priceNew = Math.round((priceOrigin * (100 - discountPercent)) / 100)
      isFlashSale = false
    }
    savings = priceOrigin - priceNew
  }

  // Cập nhật maxAvailable theo cart
  const updateMaxAvailable = async (product, setMaxAvailable, setQuantity) => {
    if (!product) {
      setMaxAvailable(null)
      return
    }
    try {
      const cart = await getCart()
      const cartItem = cart.items.find(item => item.productId === (product._id || product.id))
      const qtyInCart = cartItem ? cartItem.quantity : 0
      const available = Math.max(0, product.stock - qtyInCart)
      setMaxAvailable(available)
      if (+quantity > available && available > 0) setQuantity(String(available))
    } catch {
      setMaxAvailable(product.stock)
    }
  }

  useEffect(() => {
    setMaxAvailable(null)
    updateMaxAvailable(product, setMaxAvailable, setQuantity)
    // eslint-disable-next-line
  }, [product])

  const handleQtyInputChange = e => {
    const val = e.target.value
    if (/^\d*$/.test(val)) setQuantity(val)
  }

  const handleQtyBlur = () => {
    let num = parseInt(quantity, 10)
    if (isNaN(num) || num < 1) num = 1
    if (num > product.stock) num = product.stock
    setQuantity(String(num))
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        setNotFound(false)
        const productData = await getProductDetail(params.slug)
        if (!productData) {
          setNotFound(true)
          return
        }
        setProduct(productData)
      } catch (err) {
        setError('Có lỗi xảy ra khi tải sản phẩm.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Spin tip="Đang tải sản phẩm..." size="large" />
      </div>
    )
  }
  if (notFound) return <Error404 />
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    )
  }
  if (!product) return null

  const handleAddToCart = async () => {
    if (addCartLoading) return

    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!')
      navigate('/user/login')
      return
    }

    setAddCartLoading(true)

    try {
      if (+quantity > maxAvailable) {
        message.warning(`Chỉ có thể thêm tối đa ${maxAvailable} sản phẩm này vào giỏ hàng!`)
        return
      }

      let body = {
        productId: product._id || product.id,
        quantity: Number(quantity)
      }
      if (isFlashSale && flashSaleInfo) {
        body = {
          ...body,
          salePrice: flashSaleInfo.salePrice,
          discountPercent: flashSaleInfo.discountPercent,
          flashSaleId: flashSaleInfo.flashSaleId,
          isFlashSale: true
        }
      }
      await addToCart(body)
      const cart = await getCart()
      dispatch(setCart(cart.items))
      await updateMaxAvailable(product, setMaxAvailable, setQuantity)
      setQuantity('1')
      message.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      message.error('Thêm sản phẩm vào giỏ hàng thất bại!')
    } finally {
      setAddCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (buyNowLoading) return

    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để mua sản phẩm vào giỏ hàng!')
      navigate('/user/login')
      return
    }

    setBuyNowLoading(true)
    try {
      if (+quantity > maxAvailable) {
        navigate('/cart', { state: { buyNowProductId: product._id || product.id } })
        return
      }

      let body = {
        productId: product._id || product.id,
        quantity: Number(quantity)
      }
      if (isFlashSale && flashSaleInfo) {
        body = {
          ...body,
          salePrice: flashSaleInfo.salePrice,
          discountPercent: flashSaleInfo.discountPercent,
          flashSaleId: flashSaleInfo.flashSaleId,
          isFlashSale: true
        }
      }
      await addToCart(body)
      const cart = await getCart()
      dispatch(setCart(cart.items))
      navigate('/cart', { state: { buyNowProductId: product._id || product.id } })
    } catch (err) {
      message.error('Mua ngay thất bại!')
    } finally {
      setBuyNowLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <span className="dark:text-gray-300">Trang chủ</span>
          <span>/</span>
          <span className="dark:text-gray-300">Sản phẩm</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <img
                  src={product.images?.[selectedImage] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{discountPercent}%
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 group"
                  >
                    <Heart className={`h-5 w-5 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-3 ring-purple-500 shadow-lg scale-105'
                        : 'hover:ring-2 ring-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                {product.isTopDeal && (
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    Top Deal
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    Nổi bật
                  </span>
                )}
                {product.productCategory && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.productCategory.title}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rate || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  {product.rate && product.rate > 0 ? (
                    <span className="text-gray-600 ml-2">({product.rate}/5)</span>
                  ) : (
                    <span className="text-gray-500 ml-2 italic dark:text-gray-400">Chưa có đánh giá</span>
                  )}
                </div>

                <div className="text-sm text-gray-500 flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span className="dark:text-gray-300">Còn {product.stock} sản phẩm</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-purple-600">{formatPrice(priceNew)}</span>
                {discountPercent > 0 && priceOrigin > 0 && (
                  <span className="text-lg text-gray-500 line-through">{formatPrice(priceOrigin)}</span>
                )}
              </div>
              {savings > 0 && priceOrigin > 0 && <p className="text-green-600 font-medium mt-1">Tiết kiệm {formatPrice(savings)}</p>}
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium dark:text-gray-300">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(q => String(Math.max(1, +q - 1)))}
                  className="p-2 hover:bg-gray-100 transition-colors rounded-l-xl"
                  disabled={+quantity <= 1 || maxAvailable <= 0}
                >
                  <Minus className="h-4 w-4 dark:text-gray-300" />
                </button>
                <input
                  type="number"
                  className="qtyInput w-14 text-center border-0 outline-none dark:text-gray-300 dark:bg-gray-800"
                  value={quantity}
                  onChange={handleQtyInputChange}
                  onBlur={handleQtyBlur}
                  min={1}
                  max={maxAvailable}
                  disabled={maxAvailable <= 0}
                />
                <button
                  onClick={() => setQuantity(q => String(Math.min(maxAvailable, +q + 1)))}
                  className="p-2 hover:bg-gray-100 transition-colors rounded-r-xl"
                  disabled={+quantity >= maxAvailable}
                >
                  <Plus className="h-4 w-4 dark:text-gray-300" />
                </button>
              </div>
              {maxAvailable !== null && maxAvailable <= 0 && (
                <span className="text-xs text-red-500 ml-3">Bạn đã thêm hết số lượng còn lại vào giỏ</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={handleBuyNow}
                disabled={buyNowLoading || maxAvailable <= 0}
              >
                {buyNowLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <Zap className="h-5 w-5" />
                )}
                <span>Mua ngay</span>
              </button>
              <button
                className="flex-1 bg-white text-gray-900 py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
                onClick={handleAddToCart}
                disabled={addCartLoading || maxAvailable <= 0}
              >
                {addCartLoading ? (
                  <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                <span>Thêm vào giỏ</span>
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && product.features.some(f => !!f && f.trim() !== '') && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tính năng nổi bật</h3>
                <ul className="space-y-2">
                  {product.features
                    .filter(f => !!f && f.trim() !== '')
                    .map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Service Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bảo hành</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trọn gói</p>
              </div>
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Giao hàng</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Miễn phí</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-white/20 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <RotateCcw className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hỗ trợ khách hàng</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tư vấn 24/7</p>
              </div>
            </div>

            {product.timeStart && product.timeFinish && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center space-x-2 text-orange-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Thời gian khuyến mãi</span>
                </div>
                <div className="mt-2 text-sm text-orange-600">
                  Từ {new Date(product.timeStart).toLocaleDateString('vi-VN')}
                  {' đến '}
                  {new Date(product.timeFinish).toLocaleDateString('vi-VN')}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></div>
              </div>
            )}
            {product.content && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết sản phẩm</h3>
                <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: product.content }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsDetail
