import { faCartPlus, faStar, faStarHalfAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../../../stores/cart'
import { addToWishlistLocal, removeFromWishlistLocal } from '../../../stores/wishlist'
import { addToCart, getCart } from '@/services/cartsService'
import { toggleWishlist } from '@/services/wishlistService'
import { formatVND } from '../../../helpers/formatCurrency'
import { useState } from 'react'
import { Heart, BarChart2 } from 'lucide-react'
import { toggleCompareLocal } from '../../../stores/compare'

function ProductItem(props) {
  const { product, isDragging } = props
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  const wishlistItems = useSelector(state => state.wishlist.items)
  const compareItems = useSelector(state => state.compare.items)
  const isInWishlist = wishlistItems.some(i => i.productId === (product._id || product.id))
  const isInCompare = compareItems.some(i => i.productId === (product._id || product.id))

  const priceNew = formatVND(
    product.salePrice !== undefined && product.salePrice !== null
      ? product.salePrice
      : (product.price * (100 - (product.discountPercent || product.discountPercentage || 0))) / 100
  )
  const price = formatVND(product.price)

  const savings =
    product.savings !== undefined
      ? product.savings
      : product.price && (product.discountPercent || product.discountPercentage)
      ? product.price - (product.price * (100 - (product.discountPercent || product.discountPercentage))) / 100
      : 0

  const navigate = useNavigate()
  const dispatch = useDispatch()

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
      const cart = await getCart()
      const cartItem = cart.items.find(item => item.productId === (product._id || product.id))
      const currentQtyInCart = cartItem ? cartItem.quantity : 0
      const available = Math.max(0, product.stock - currentQtyInCart)

      if (available <= 0) {
        message.warning('Bạn đã thêm hết số lượng sản phẩm này vào giỏ hàng!')
        return
      }

      let body = {
        productId: product._id || product.id,
        quantity: 1
      }
      if (product.isFlashSale) {
        body = {
          ...body,
          salePrice: product.salePrice,
          discountPercent: product.discountPercent,
          flashSaleId: product.flashSaleId,
          isFlashSale: true
        }
      }
      await addToCart(body)
      const updatedCart = await getCart()
      dispatch(setCart(updatedCart.items))
      message.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      message.error('Thêm sản phẩm vào giỏ hàng thất bại!')
    } finally {
      setAddCartLoading(false)
    }
  }

  const handleToggleWishlist = async e => {
    e.preventDefault()
    e.stopPropagation()
    const isLoggedIn = Boolean(localStorage.getItem('clientAccessToken'))
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để thêm vào danh sách yêu thích!')
      navigate('/user/login')
      return
    }
    if (wishlistLoading) return

    // ✅ OPTIMISTIC UI: cập nhật Redux người dùng thấy liền
    const productId = product._id || product.id
    const wasInWishlist = isInWishlist
    if (wasInWishlist) {
      dispatch(removeFromWishlistLocal(productId))
    } else {
      dispatch(addToWishlistLocal({
        productId,
        name: product.title,
        price: product.price * (1 - (product.discountPercentage || 0) / 100),
        originalPrice: product.price,
        discountPercentage: product.discountPercentage || 0,
        image: product.thumbnail,
        slug: product.slug,
        stock: product.stock,
        inStock: product.stock > 0,
        rate: product.rate
      }))
    }

    setWishlistLoading(true)
    try {
      await toggleWishlist(productId)
      // Không cần dispatch lại — đã optimistic rồi
    } catch {
      // Revert nếu API lỗi
      if (wasInWishlist) {
        dispatch(addToWishlistLocal({
          productId,
          name: product.title,
          price: product.price * (1 - (product.discountPercentage || 0) / 100),
          originalPrice: product.price,
          discountPercentage: product.discountPercentage || 0,
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
      setWishlistLoading(false)
    }
  }

  let ribbonText = ''
  let ribbonColor = ''
  const discountVal = product.discountPercent || product.discountPercentage || 0
  if (discountVal > 0) {
    ribbonText = `Giảm ${discountVal}%`
    ribbonColor = '#E01020'
  }

  const badgesRight = []
  if (product.stock === 0) {
    badgesRight.push(
      <div
        key="soldout"
        className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow pointer-events-none select-none ml-2 mb-1"
      >
        Hết hàng
      </div>
    )
  } else if (product.stock <= 5) {
    badgesRight.push(
      <div
        key="stock"
        className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow pointer-events-none select-none ml-2 mb-1"
      >
        Chỉ còn {product.stock}
      </div>
    )
  }

  if (product.isTopDeal) {
    badgesRight.push(
      <div
        key="hotdeal"
        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow flex items-center pointer-events-none select-none ml-2 mb-1"
      >
        <span role="img" aria-label="hot" className="mr-1">
          🔥
        </span>
        Hot Deal
      </div>
    )
  }
  if (product.isFeatured) {
    badgesRight.push(
      <div
        key="featured"
        className="bg-gradient-to-r from-pink-500 to-red-400 text-white text-xs px-3 py-1 rounded-full font-semibold shadow flex items-center pointer-events-none select-none ml-2 mb-1"
      >
        <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-300" />
        Nổi bật
      </div>
    )
  }

  const rightBadgeGroup = badgesRight.length > 0 && <div className="absolute top-2 right-2 flex flex-col items-end z-30">{badgesRight}</div>

  const productContent = (
    <div className="group relative bg-white rounded-2xl overflow-hidden hover:border-blue-500 transition-all duration-300 transform border border-solid border-gray-200 flex flex-col h-full dark:bg-gray-800">
      {/* Badge phải */}
      {rightBadgeGroup}

      <Link
        to={`/products/${product.slug}`}
        state={{
          fromFlashSale: true,
          flashSaleInfo: {
            flashSaleId: product.flashSaleId,
            salePrice: product.salePrice,
            discountPercent: product.discountPercent,
            endAt: product.endAt
          }
        }}
        draggable={false}
        onClick={e => {
          if (isDragging) e.preventDefault()
        }}
        className="flex-1 flex flex-col"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square p-1">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            {/* 📊 Compare Button — góc DƯỚI-TRÁI (cạnh trái Wishlist) */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-20">
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200
                  ${isInWishlist
                    ? 'bg-pink-500 text-white scale-110'
                    : 'bg-white/90 dark:bg-gray-700/90 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100'
                  }`}
                title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                {wishlistLoading
                  ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <Heart className={`w-4 h-4 transition-transform duration-150 ${isInWishlist ? 'fill-white scale-110' : ''}`} />
                }
              </button>

              <button
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 dispatch(toggleCompareLocal({
                    productId: product._id || product.id,
                    name: product.title,
                    price: product.price * (1 - (product.discountPercentage || 0) / 100),
                    originalPrice: product.price,
                    discountPercentage: product.discountPercentage || 0,
                    image: product.thumbnail,
                    slug: product.slug,
                    rate: product.rate,
                    stock: product.stock,
                    inStock: product.stock > 0
                 }));
               }}
               className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200
                 ${isInCompare
                   ? 'bg-blue-500 text-white scale-110'
                   : 'bg-white/90 dark:bg-gray-700/90 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100'
                 }`}
               title="So sánh sản phẩm"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        {/* Product Info */}
        <div className="p-4 space-y-1 flex-1 flex flex-col">
          <h3
            className="dark:text-gray-300 font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
            style={{ minHeight: '40px' }}
          >
            {product.title}
          </h3>
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => {
                const rating = product.rate || 0
                if (i < Math.floor(rating)) {
                  return <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3" />
                } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                  return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="w-3 h-3" />
                } else {
                  return <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3 text-gray-300" />
                }
              })}
            </div>
            <span className="text-xs text-gray-500">({product.rate || 'Chưa có đánh giá'})</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">
              <b>Còn lại:</b> <span className={product.stock === 0 ? 'text-red-600' : 'text-blue-600'}>{product.stock}</span>
            </span>
            <span className="text-xs text-gray-500">
              <b>Đã bán:</b> <span className="text-orange-600">{product.soldQuantity || 0}</span>
            </span>
          </div>
          {/* Price */}
          <div className="space-y-1 h-15 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-red-600">{priceNew}₫</span>
              {discountVal > 0 && <span className="text-sm text-gray-400 line-through">{price}₫</span>}
            </div>
            <div className="h-8">
              <div>{savings > 0 && <span className="mt-0 text-green-600 font-medium text-xs">Tiết kiệm {formatVND(savings)}₫</span>}</div>
              <div>
                {product.deliveryEstimateDays > 0 && (
                  <p className="text-xs text-green-600 font-medium">🚚 Giao hàng trong {product.deliveryEstimateDays} ngày</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Add to Cart button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={addCartLoading || product.stock === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
        >
          {addCartLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCartPlus} className="w-4 h-4" />
              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div className="product mt-1 h-full">
      {ribbonText ? (
        <Badge.Ribbon placement="start" color={ribbonColor} text={ribbonText} className="custom-discount-ribbon">
          {productContent}
        </Badge.Ribbon>
      ) : (
        productContent
      )}
    </div>
  )
}

export default ProductItem
