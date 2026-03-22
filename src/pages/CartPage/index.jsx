import { Trash2, Plus, Minus, ShoppingBag, Star, ArrowRight, Package, Truck, Shield } from 'lucide-react'
import { getCart, updateCartItem, removeCartItem } from '@/services/cartsService'
import { useSelector, useDispatch } from 'react-redux'
import { setCart } from '@/stores/cart'
import { message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { validatePromoCode } from '@/services/promoCodesService'
import { useLocation, useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'

const CartPage = () => {

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items) || []

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingQty, setEditingQty] = useState({})
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [cartLoaded, setCartLoaded] = useState(false) // <-- NEW

  const availableIds = cartItems.filter(item => item.inStock).map(item => item.productId)
  const allAvailableSelected = availableIds.length > 0 && availableIds.every(id => selectedItems.has(id))

  const navigate = useNavigate()
  const location = useLocation()

  // Tải giỏ hàng
  useEffect(() => {
    async function fetchCart() {
      try {
        const cart = await getCart()
        const items = cart.items.map(item => ({ ...item, id: item.productId }))
        dispatch(setCart(items))

        const buyNowProductId = location.state?.buyNowProductId
        if (buyNowProductId) {
          setSelectedItems(new Set([buyNowProductId]))
          navigate(location.pathname, { replace: true, state: {} })
        } else {
          setSelectedItems(new Set(items.filter(i => i.inStock).map(i => i.productId)))
        }
      } catch (err) {
        message.error('Không lấy được giỏ hàng')
      } finally {
        setCartLoaded(true) // <-- đánh dấu đã tải giỏ
      }
    }
    fetchCart()
    // eslint-disable-next-line
  }, [])

  // Auto-apply coupon khi đi từ trang Coupon (chờ cartLoaded để subtotal có giá trị)
  useEffect(() => {
    const codeFromState = location.state?.autoApplyCoupon
    if (cartLoaded && codeFromState) {
      setPromoCode(codeFromState)
      handleApplyPromo(codeFromState) // truyền thẳng mã vào
      // Xóa state để F5 không áp lại
      navigate(location.pathname, { replace: true, state: {} })
    }
    // eslint-disable-next-line
  }, [cartLoaded, location.state?.autoApplyCoupon])

  // Cập nhật danh sách chọn sau khi giỏ đổi
  useEffect(() => {
    setSelectedItems(prev => {
      const newIds = cartItems.filter(item => item.inStock).map(item => item.productId)
      if (!prev.size || [...prev].filter(id => newIds.includes(id)).length === 0) {
        return new Set(newIds)
      }
      return new Set([...prev].filter(id => newIds.includes(id)))
    })
  }, [cartItems])

  const updateQuantity = async (id, newQuantity) => {
    const prevItems = cartItems
    if (newQuantity <= 0) {
      const updatedItems = cartItems.filter(item => item.productId !== id)
      dispatch(setCart(updatedItems))
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      try {
        await removeCartItem(id)
      } catch (err) {
        dispatch(setCart(prevItems))
        message.error('Xóa sản phẩm thất bại')
      }
      return
    }
    const updatedItems = cartItems.map(item => (item.productId === id ? { ...item, quantity: newQuantity } : item))
    dispatch(setCart(updatedItems))
    try {
      await updateCartItem({ productId: id, quantity: newQuantity })
    } catch (err) {
      dispatch(setCart(prevItems))
      message.error('Cập nhật số lượng thất bại')
    }
  }

  const handleQtyChange = (id, value) => {
    if (/^\d*$/.test(value)) setEditingQty(prev => ({ ...prev, [id]: value }))
  }

  const handleQtyBlur = (id, item) => {
    let valStr = editingQty[id]
    if (valStr === '' || valStr === undefined) {
      setEditingQty(prev => ({ ...prev, [id]: undefined }))
      return
    }
    let val = parseInt(valStr, 10)
    if (isNaN(val) || val < 1) {
      message.warning('Vui lòng nhập số lượng hợp lệ!')
      setEditingQty(prev => ({ ...prev, [id]: undefined }))
      return
    }
    if (item.stock && val > item.stock) {
      val = item.stock
      message.warning(`Chỉ còn tối đa ${item.stock} sản phẩm trong kho`)
    }
    if (val !== item.quantity) updateQuantity(id, val)
    setEditingQty(prev => ({ ...prev, [id]: undefined }))
  }

  const removeItem = async id => {
    Modal.confirm({
      title: <span className="text-gray-800 dark:text-gray-100">Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        const prevItems = cartItems
        const updatedItems = cartItems.filter(item => item.productId !== id)
        dispatch(setCart(updatedItems))
        setSelectedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        try {
          await removeCartItem(id)
          message.success('Đã xóa sản phẩm khỏi giỏ hàng')
        } catch (err) {
          dispatch(setCart(prevItems))
          message.error('Xóa sản phẩm thất bại')
        }
      }
    })
  }

  const handleSelectItem = id => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (allAvailableSelected) setSelectedItems(new Set())
    else setSelectedItems(new Set(availableIds))
  }

  // Cho phép truyền code từ ngoài vào
  const handleApplyPromo = async customCode => {
    try {
      setIsLoading(true)
      const codeToApply = customCode || promoCode
      const res = await validatePromoCode({ code: codeToApply, subtotal })
      if (res.valid) {
        setAppliedPromo({
          code: codeToApply,
          ...res,
          description: res.promoInfo
            ? res.promoInfo.discountType === 'percent'
              ? `Giảm ${res.promoInfo.discountValue}% (tối đa ${formatPrice(res.promoInfo.maxDiscount)} nếu có)`
              : `Giảm ${formatPrice(res.promoInfo.discountValue)}`
            : res.message || ''
        })
        setPromoCode(codeToApply) // giữ lại trong input
        message.success(res.message || 'Áp dụng mã thành công')
      } else {
        message.warning(res.message || 'Mã không hợp lệ')
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = () => {
    navigate('/checkout', { state: { orderItems: selectedCartItems, promo: appliedPromo, __fromCart: true } })
  }

  const selectedCartItems = cartItems.filter(item => item.inStock && selectedItems.has(item.productId))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedPromo?.discount || 0
  const shipping = appliedPromo?.freeShipping ? 0 : subtotal > 100000 ? 0 : 50000
  const total = subtotal - discount + shipping

  const formatPrice = price => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  const getSavings = (original, current) => {
    if (!original || !current || original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
        <SEO title="Giỏ hàng" noIndex />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 dark:text-gray-100">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-8 dark:text-gray-300">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title="Giỏ hàng của bạn" noIndex />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Bạn có {cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-2xl shadow-lg p-4 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allAvailableSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  Chọn tất cả ({selectedItems.size}/{cartItems.length})
                </span>
              </label>
            </div>

            {cartItems.map(item => (
              <div
                key={item.productId}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  selectedItems.has(item.productId) ? 'ring-2 ring-blue-500' : ''
                } dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid`}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.productId)}
                        onChange={() => handleSelectItem(item.productId)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-2"
                        disabled={!item.inStock}
                      />
                    </div>
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      {getSavings(item.originalPrice, item.price) > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{getSavings(item.originalPrice, item.price)}%
                        </div>
                      )}
                    </div>
                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
                            {item.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mb-1 dark:text-gray-100">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">({item.rating})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Price and Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatPrice(item.price)}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-lg text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                            )}
                          </div>
                          {item.inStock ? (
                            <span className="text-green-600 text-sm font-medium">✓ Còn hàng</span>
                          ) : (
                            <span className="text-red-600 text-sm font-medium">⚠ Hết hàng</span>
                          )}
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                            <button
                              onClick={() => {
                                setEditingQty(prev => ({ ...prev, [item.productId]: undefined }))
                                updateQuantity(item.productId, item.quantity - 1)
                              }}
                              className="p-3 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              className="qtyInput w-16 text-center bg-transparent border-none outline-none font-semibold px-2 py-3"
                              value={editingQty[item.productId] !== undefined ? editingQty[item.productId] : item.quantity}
                              onChange={e => handleQtyChange(item.productId, e.target.value)}
                              onBlur={() => handleQtyBlur(item.productId, item)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') e.target.blur()
                              }}
                            />
                            <button
                              onClick={() => {
                                setEditingQty(prev => ({ ...prev, [item.productId]: undefined }))
                                updateQuantity(item.productId, item.quantity + 1)
                              }}
                              className={`p-3 transition-colors duration-200 ${
                                item.quantity >= (item.stock || 1)
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'hover:bg-gray-200 text-blue-600'
                              }`}
                              disabled={item.quantity >= (item.stock || 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <div className="bg-white rounded-2xl shadow-lg p-6 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-gray-100">Mã giảm giá</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid dark:text-gray-100 dark:border-gray-700 dark:focus:ring-gray-500"
                  />
                  <button
                    onClick={() => handleApplyPromo()}
                    disabled={isLoading || !promoCode}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '...' : 'Áp dụng'}
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-green-800 font-medium">{appliedPromo.description}</span>
                    <button
                      onClick={() => {
                        setAppliedPromo(null)
                        setPromoCode('')
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              <h3 className="text-lg font-bold text-gray-800 mb-6 dark:text-gray-100">Tóm tắt đơn hàng</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span className="dark:text-gray-300">
                    Tạm tính ({selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm đã chọn)
                  </span>
                  <span className="dark:text-gray-300">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="dark:text-gray-300">Phí vận chuyển</span>
                  <span className="dark:text-gray-300">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span className="dark:text-gray-300">Tổng cộng</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="dark:text-gray-300">Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span className="dark:text-gray-300">Giao hàng nhanh 2-4h</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span className="dark:text-gray-300">Đóng gói cẩn thận</span>
                </div>
              </div>

              <button
                disabled={selectedCartItems.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleCheckout}
              >
                <span>Thanh toán {selectedCartItems.length > 0 ? `(${selectedCartItems.length} sản phẩm)` : ''}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
                  alt="Visa"
                  className="h-6"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
                  alt="Mastercard"
                  className="h-6"
                />
                <span>Thanh toán an toàn</span>

                {/* Suggested Items */}
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Có thể bạn quan tâm</h3>
              <div className="space-y-4">
                {[
                  {
                    name: 'Ốp lưng iPhone 15 Pro',
                    price: 590000,
                    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop'
                  },
                  {
                    name: 'Cáp sạc USB-C',
                    price: 290000,
                    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=100&h=100&fit=crop'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200 cursor-pointer"
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-blue-600 font-semibold text-sm">{formatPrice(item.price)}</p>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
