import { Heart, ShoppingCart, Trash2, ShoppingBag, ArrowRight, Star, Package, Truck, Shield, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setWishlist, removeFromWishlistLocal, clearWishlistLocal } from '@/stores/wishlist'
import { setCart } from '@/stores/cart'
import { getWishlist, removeFromWishlist, clearWishlist } from '@/services/wishlistService'
import { addToCart, getCart } from '@/services/cartsService'
import { message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SEO from '@/components/SEO'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const wishlistItems = useSelector(state => state.wishlist.items)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState({})

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  // Fetch wishlist from server
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const res = await getWishlist()
        dispatch(setWishlist(res.items || []))
      } catch {
        message.error('Không tải được danh sách yêu thích')
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
    // eslint-disable-next-line
  }, [])

  const handleRemove = async productId => {
    Modal.confirm({
      title: <span className="text-gray-800 dark:text-gray-100">Xóa khỏi danh sách yêu thích?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeFromWishlist(productId)
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
          dispatch(clearWishlistLocal())
          message.success('Đã xóa toàn bộ danh sách yêu thích')
        } catch {
          message.error('Có lỗi xảy ra, vui lòng thử lại')
        }
      }
    })
  }

  const handleAddToCart = async item => {
    setAddingToCart(prev => ({ ...prev, [item.productId]: true }))
    try {
      await addToCart({ productId: item.productId, quantity: 1 })
      const updatedCart = await getCart()
      dispatch(setCart(updatedCart.items || []))
      message.success('Đã thêm vào giỏ hàng!')
    } catch {
      message.error('Thêm vào giỏ hàng thất bại!')
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.productId]: false }))
    }
  }

  const handleAddAllToCart = async () => {
    const inStockItems = wishlistItems.filter(i => i.inStock)
    if (inStockItems.length === 0) {
      message.warning('Không có sản phẩm nào còn hàng!')
      return
    }
    try {
      for (const item of inStockItems) {
        await addToCart({ productId: item.productId, quantity: 1 })
      }
      const updatedCart = await getCart()
      dispatch(setCart(updatedCart.items || []))
      message.success(`Đã thêm ${inStockItems.length} sản phẩm vào giỏ hàng!`)
    } catch {
      message.error('Có lỗi xảy ra khi thêm vào giỏ hàng!')
    }
  }

  // Skeleton loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl">
        <SEO title="Yêu thích" noIndex />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-64 mx-auto mb-3 animate-pulse" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl">
        <SEO title="Danh sách yêu thích" noIndex />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 rounded-3xl shadow-2xl p-16">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/30 dark:to-rose-800/30 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Chưa có sản phẩm yêu thích
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Hãy khám phá các sản phẩm tuyệt vời và nhấn ❤️ để lưu lại những món đồ bạn thích!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
              >
                <ShoppingBag className="w-5 h-5" />
                Khám phá sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const inStockCount = wishlistItems.filter(i => i.inStock).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl">
      <SEO title={`Yêu thích (${wishlistItems.length})`} noIndex />
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Yêu thích
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {wishlistItems.length} sản phẩm • {inStockCount} còn hàng
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 rounded-2xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="font-medium">Danh sách yêu thích của bạn</span>
          </div>
          <div className="flex items-center gap-3">
            {inStockCount > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Thêm tất cả vào giỏ ({inStockCount})
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-all duration-300 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <WishlistCard
              key={item.productId}
              item={item}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
              addingToCart={addingToCart[item.productId]}
              formatPrice={formatPrice}
            />
          ))}
        </div>

        {/* Perks */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Bảo hành chính hãng' },
            { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Giao hàng nhanh 2-4h' },
            { icon: Package, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'Đóng gói cẩn thận' }
          ].map(({ icon: Icon, color, bg, label }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const WishlistCard = ({ item, onRemove, onAddToCart, addingToCart, formatPrice }) => {
  const discountPct = item.discountPercentage || 0
  const savings = discountPct > 0 ? item.originalPrice - item.price : 0

  return (
    <div className="group bg-white dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700 aspect-square">
        <Link to={`/products/${item.slug}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Discount badge */}
        {discountPct > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            -{discountPct}%
          </div>
        )}

        {/* Stock badge */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-full">Hết hàng</span>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={() => onRemove(item.productId)}
          className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500"
          title="Xóa khỏi yêu thích"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${item.slug}`}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors duration-200 min-h-[40px]">
            {item.name}
          </h3>
        </Link>

        {/* Rating */}
        {item.rate > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(item.rate) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({item.rate})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-red-600">{formatPrice(item.price)}</span>
            {discountPct > 0 && (
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatPrice(item.originalPrice)}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="text-xs text-green-600 font-medium">Tiết kiệm {formatPrice(savings)}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-2">
          <button
            onClick={() => onAddToCart(item)}
            disabled={addingToCart || !item.inStock}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none shadow"
          >
            {addingToCart ? (
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang thêm...
              </span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {item.inStock ? 'Thêm giỏ hàng' : 'Hết hàng'}
              </>
            )}
          </button>
        </div>

        {/* View detail link */}
        <Link
          to={`/products/${item.slug}`}
          className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400 hover:text-pink-500 transition-colors duration-200"
        >
          Xem chi tiết <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

export default WishlistPage
