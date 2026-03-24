import { Heart, ShoppingCart, Trash2, ShoppingBag, ArrowRight, Star, Package, Truck, Shield, X, Eye } from 'lucide-react'
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
    <div className="min-h-screen rounded-xl bg-slate-50 dark:bg-gray-900">
      <SEO title={`Yêu thích (${wishlistItems.length})`} noIndex />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <section className="mb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                {wishlistItems.length} sản phẩm • {inStockCount} còn hàng
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100 md:text-5xl">
                Danh sách yêu thích của bạn
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleClearAll}
                className="rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-300 active:scale-95 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Xóa tất cả
              </button>
              {inStockCount > 0 && (
                <button
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:opacity-90 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Thêm tất cả vào giỏ ({inStockCount})
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-5 md:col-span-8">
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

          <aside className="md:col-span-4 md:sticky md:top-24">
            <div className="rounded-2xl bg-slate-100 p-6 dark:bg-gray-800/70">
              <div className="space-y-5">
                <h4 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100">Cam kết dịch vụ</h4>

                {[
                  {
                    icon: Shield,
                    title: 'Bảo hành chính hãng',
                    subtitle: 'Cam kết 100% bản quyền'
                  },
                  {
                    icon: Truck,
                    title: 'Giao hàng nhanh 2-4h',
                    subtitle: 'Nhận mã kích hoạt ngay'
                  },
                  {
                    icon: Package,
                    title: 'Hỗ trợ tận tình',
                    subtitle: 'Hướng dẫn cài đặt từ xa'
                  }
                ].map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-700">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-gray-100">{title}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                  Mỗi sản phẩm trong danh sách của bạn đều đang có ưu đãi tốt. Đừng bỏ lỡ cơ hội sở hữu phần mềm bản quyền với giá hời!
                </p>
              </div>

              <div className="relative mt-7 h-36 overflow-hidden rounded-xl bg-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.55),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.45),transparent_40%)]" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-lg font-bold text-white">Giảm thêm 5%</p>
                  <p className="text-sm text-white/80">Cho đơn hàng đầu tiên qua app</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-800/60">
          <p className="text-sm text-slate-600 dark:text-gray-300">Đang lưu {wishlistItems.length} sản phẩm yêu thích.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-300"
          >
            Tiếp tục mua sắm
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}

const WishlistCard = ({ item, onRemove, onAddToCart, addingToCart, formatPrice }) => {
  const discountPct = item.discountPercentage || 0
  const savings = discountPct > 0 ? item.originalPrice - item.price : 0

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-gray-700 sm:w-48">
          <Link to={`/products/${item.slug}`}>
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {discountPct > 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white shadow">
              -{discountPct}%
            </div>
          )}

          {!item.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700">Hết hàng</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link to={`/products/${item.slug}`}>
                <h3 className="text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                  {item.name}
                </h3>
              </Link>
              <button
                onClick={() => onRemove(item.productId)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="Xóa khỏi yêu thích"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Sản phẩm bản quyền chính hãng, kích hoạt nhanh chóng.</p>

            {item.rate > 0 && (
              <div className="mt-2 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.floor(item.rate) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-gray-600'}`}
                  />
                ))}
                <span className="ml-1 text-xs text-slate-500 dark:text-gray-400">({item.rate})</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-300">{formatPrice(item.price)}</span>
                {discountPct > 0 && (
                  <span className="text-sm text-slate-400 line-through dark:text-gray-500">{formatPrice(item.originalPrice)}</span>
                )}
              </div>
              {savings > 0 && <p className="mt-1 text-xs font-semibold text-orange-600">Tiết kiệm: {formatPrice(savings)}</p>}
            </div>

            <div className="flex gap-2">
              <Link
                to={`/products/${item.slug}`}
                className="inline-flex items-center justify-center rounded-lg bg-slate-200 p-3 text-slate-600 transition-colors hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-blue-300"
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Link>

              <button
                onClick={() => onAddToCart(item)}
                disabled={addingToCart || !item.inStock}
                className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
              >
                {addingToCart ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang thêm...
                  </span>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    {item.inStock ? 'Thêm giỏ hàng' : 'Hết hàng'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
