import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { syncCartState } from '@/lib/clientCache'
import { getCart, updateCartItem, removeCartItem } from '@/services/cartsService'
import { useSelector, useDispatch } from 'react-redux'
import { message, Modal } from 'antd'
import { useEffect, useState, useMemo } from 'react'
import { validatePromoCode } from '@/services/promoCodesService'
import { useLocation, useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'

const CartPage = () => {
  const dispatch = useDispatch()
  const rawCartItems = useSelector(state => state.cart.items)
  const cartItems = useMemo(() => rawCartItems || [], [rawCartItems])

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingQty, setEditingQty] = useState({})
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [cartLoaded, setCartLoaded] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const availableIds = cartItems.filter(item => item.inStock).map(item => item.productId)
  const allAvailableSelected = availableIds.length > 0 && availableIds.every(id => selectedItems.has(id))

  const selectedCartItems = cartItems.filter(item => item.inStock && selectedItems.has(item.productId))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedPromo?.discount || 0
  const shipping = appliedPromo?.freeShipping ? 0 : subtotal > 100000 ? 0 : 50000
  const total = subtotal - discount + shipping

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0)

  const getSavings = (original, current) => {
    if (!original || !current || original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  useEffect(() => {
    async function fetchCart() {
      try {
        const cart = await getCart()
        const items = syncCartState(dispatch, cart.items || [])

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
        setCartLoaded(true)
      }
    }

    fetchCart()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const codeFromState = location.state?.autoApplyCoupon

    if (cartLoaded && codeFromState) {
      setPromoCode(codeFromState)
      handleApplyPromo(codeFromState)
      navigate(location.pathname, { replace: true, state: {} })
    }

    // eslint-disable-next-line
  }, [cartLoaded, location.state?.autoApplyCoupon])

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
      syncCartState(dispatch, updatedItems)

      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })

      try {
        await removeCartItem(id)
      } catch (err) {
        syncCartState(dispatch, prevItems)
        message.error('Xóa sản phẩm thất bại')
      }

      return
    }

    const updatedItems = cartItems.map(item =>
      item.productId === id ? { ...item, quantity: newQuantity } : item
    )

    syncCartState(dispatch, updatedItems)

    try {
      await updateCartItem({ productId: id, quantity: newQuantity })
    } catch (err) {
      syncCartState(dispatch, prevItems)
      message.error('Cập nhật số lượng thất bại')
    }
  }

  const handleQtyChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setEditingQty(prev => ({ ...prev, [id]: value }))
    }
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

    if (val !== item.quantity) {
      updateQuantity(id, val)
    }

    setEditingQty(prev => ({ ...prev, [id]: undefined }))
  }

  const removeItem = async id => {
    Modal.confirm({
      title: <span className="text-gray-900 dark:text-gray-100">Xóa sản phẩm khỏi giỏ hàng?</span>,
      content: <span className="text-gray-500 dark:text-gray-400">Sản phẩm này sẽ được xóa khỏi danh sách giỏ hàng của bạn.</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        const prevItems = cartItems
        const updatedItems = cartItems.filter(item => item.productId !== id)

        syncCartState(dispatch, updatedItems)

        setSelectedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })

        try {
          await removeCartItem(id)
          message.success('Đã xóa sản phẩm khỏi giỏ hàng')
        } catch (err) {
          syncCartState(dispatch, prevItems)
          message.error('Xóa sản phẩm thất bại')
        }
      }
    })
  }

  const handleSelectItem = id => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)

      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }

      return newSet
    })
  }

  const handleSelectAll = () => {
    if (allAvailableSelected) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(availableIds))
    }
  }

  const handleApplyPromo = async customCode => {
    try {
      setIsLoading(true)

      const codeToApply = customCode || promoCode

      if (!codeToApply?.trim()) {
        message.warning('Vui lòng nhập mã giảm giá')
        return
      }

      const res = await validatePromoCode({ code: codeToApply, subtotal })

      if (res.valid) {
        setAppliedPromo({
          code: codeToApply,
          ...res,
          description: res.promoInfo
            ? res.promoInfo.discountType === 'percent'
              ? `Giảm ${res.promoInfo.discountValue}%${
                  res.promoInfo.maxDiscount ? `, tối đa ${formatPrice(res.promoInfo.maxDiscount)}` : ''
                }`
              : `Giảm ${formatPrice(res.promoInfo.discountValue)}`
            : res.message || ''
        })

        setPromoCode(codeToApply)
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
    navigate('/checkout?step=1', {
      state: {
        orderItems: selectedCartItems,
        promo: appliedPromo,
        __fromCart: true
      }
    })
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <SEO title="Giỏ hàng" noIndex />

        <div className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="container mx-auto px-4 py-10">
            <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
                <ShoppingBag className="h-11 w-11 text-blue-600" />
              </div>

              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Giỏ hàng trống
              </h2>

              <p className="mb-7 text-gray-500 dark:text-gray-400">
                Bạn chưa có sản phẩm nào trong giỏ hàng.
              </p>

              <button
                onClick={() => navigate('/products')}
                className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO title="Giỏ hàng của bạn" noIndex />

      <div className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="mb-6 rounded-xl bg-white px-5 py-5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 lg:text-3xl">
              Giỏ hàng
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Có {cartItems.length} sản phẩm trong giỏ hàng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allAvailableSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Chọn tất cả
                  </span>

                  <span className="text-sm text-gray-400">
                    ({selectedItems.size}/{availableIds.length} sản phẩm khả dụng)
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                {cartItems.map(item => {
                  const savingPercent = getSavings(item.originalPrice, item.price)
                  const isSelected = selectedItems.has(item.productId)

                  return (
                    <div
                      key={item.productId}
                      className={`rounded-lg border bg-white p-4 shadow-sm transition dark:bg-gray-950 ${
                        isSelected
                          ? 'border-blue-300 dark:border-blue-900'
                          : 'border-gray-200 dark:border-gray-800'
                      } ${!item.inStock ? 'opacity-70' : ''}`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="pt-8 sm:pt-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectItem(item.productId)}
                            disabled={!item.inStock}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </div>

                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-28 sm:w-28 dark:border-gray-800 dark:bg-gray-900">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                          {savingPercent > 0 && (
                            <div className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                              -{savingPercent}%
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex gap-3">
                            <div className="min-w-0 flex-1">
                              {item.category && (
                                <p className="mb-1 text-xs font-medium text-gray-400">
                                  {item.category}
                                </p>
                              )}

                              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 dark:text-gray-100 sm:text-base">
                                {item.name}
                              </h3>

                              <div className="mt-2">
                                {item.inStock ? (
                                  <span className="text-xs font-medium text-emerald-600">
                                    Còn hàng
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium text-red-500">
                                    Hết hàng
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId)}
                              className="h-9 w-9 flex-shrink-0 rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                              title="Xóa"
                            >
                              <Trash2 className="mx-auto h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-lg font-bold text-blue-600">
                                  {formatPrice(item.price)}
                                </span>

                                {item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
                                <button
                                  onClick={() => {
                                    setEditingQty(prev => ({ ...prev, [item.productId]: undefined }))
                                    updateQuantity(item.productId, item.quantity - 1)
                                  }}
                                  className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>

                                <input
                                  type="number"
                                  min={1}
                                  className="qtyInput h-9 w-11 border-x border-gray-200 bg-transparent text-center text-sm font-semibold text-gray-900 outline-none dark:border-gray-700 dark:text-gray-100"
                                  value={
                                    editingQty[item.productId] !== undefined
                                      ? editingQty[item.productId]
                                      : item.quantity
                                  }
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
                                  disabled={item.quantity >= (item.stock || 1)}
                                  className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:hover:bg-gray-900 dark:disabled:text-gray-600"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="hidden min-w-[110px] text-right sm:block">
                                <p className="text-xs text-gray-400">Thành tiền</p>
                                <p className="font-bold text-gray-900 dark:text-gray-100">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>

                            <div className="sm:hidden">
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                Thành tiền: {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <div className="mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      Mã giảm giá
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-950"
                    />

                    <button
                      onClick={() => handleApplyPromo()}
                      disabled={isLoading || !promoCode}
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                    >
                      {isLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>

                  {appliedPromo && (
                    <div className="mt-3 flex items-start justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/30">
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {appliedPromo.code}
                        </p>

                        <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                          {appliedPromo.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setAppliedPromo(null)
                          setPromoCode('')
                        }}
                        className="text-sm font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                  <h3 className="mb-4 font-bold text-gray-900 dark:text-gray-100">
                    Tóm tắt đơn hàng
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4 text-gray-500 dark:text-gray-400">
                      <span>
                        Tạm tính ({selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
                      </span>

                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between gap-4 text-emerald-600">
                        <span>Giảm giá</span>
                        <span className="font-medium">-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between gap-4 text-gray-500 dark:text-gray-400">
                      <span>Phí vận chuyển</span>

                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

                  <div className="flex items-end justify-between gap-4">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      Tổng cộng
                    </span>

                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <button
                    disabled={selectedCartItems.length === 0}
                    onClick={handleCheckout}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                  >
                    <span>
                      Thanh toán
                      {selectedCartItems.length > 0 ? ` (${selectedCartItems.length})` : ''}
                    </span>

                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {selectedCartItems.length === 0 && (
                    <p className="mt-3 text-center text-xs text-gray-400">
                      Vui lòng chọn sản phẩm để thanh toán
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
