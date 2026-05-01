import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import CartHeader from './sections/CartHeader'
import CartItems from './sections/CartItems'
import CartSidebar from './sections/CartSidebar'
import EmptyCartState from './components/EmptyCartState'
import { useCartItemActions } from './hooks/useCartItemActions'
import { useCartData } from './hooks/useCartData'
import { useCartPromo } from './hooks/useCartPromo'
import {
  calculateCartSummary,
  formatCartPrice,
  getAvailableCartIds,
  getCartSubtotal
} from './utils/cartUtils'

const Cart = () => {
  const { t, i18n } = useTranslation('clientCart')
  const navigate = useNavigate()
  const location = useLocation()
  const language = i18n.language?.startsWith('en') ? 'en' : 'vi'

  const { cartItems, cartLoaded, dispatch, selectedItems, setSelectedItems } = useCartData({ language, location, navigate, t })
  const availableIds = useMemo(() => getAvailableCartIds(cartItems), [cartItems])
  const allAvailableSelected = useMemo(
    () => availableIds.length > 0 && availableIds.every(id => selectedItems.has(id)),
    [availableIds, selectedItems]
  )
  const selectedCartItems = useMemo(
    () => cartItems.filter(item => item.inStock && selectedItems.has(item.productId)),
    [cartItems, selectedItems]
  )
  const subtotal = useMemo(() => getCartSubtotal(selectedCartItems), [selectedCartItems])
  const formatPrice = useCallback(price => formatCartPrice(price, i18n.language), [i18n.language])

  const { appliedPromo, clearPromo, handleApplyPromo, isLoading, promoCode, setPromoCode } = useCartPromo({
    formatPrice,
    subtotal,
    t
  })

  const {
    editingQty,
    handleQtyBlur,
    handleQtyChange,
    handleQuantityStep,
    handleSelectAll,
    handleSelectItem,
    removeItem
  } = useCartItemActions({
    allAvailableSelected,
    availableIds,
    cartItems,
    dispatch,
    setSelectedItems,
    t
  })

  useEffect(() => {
    const codeFromState = location.state?.autoApplyCoupon

    if (cartLoaded && codeFromState) {
      setPromoCode(codeFromState)
      handleApplyPromo(codeFromState)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [cartLoaded, handleApplyPromo, location.pathname, location.state?.autoApplyCoupon, navigate, setPromoCode])

  const { discount, selectedQuantity, shipping, total } = useMemo(
    () => calculateCartSummary(selectedCartItems, appliedPromo),
    [appliedPromo, selectedCartItems]
  )

  const handleCheckout = useCallback(() => {
    navigate('/checkout?step=1', {
      state: {
        orderItems: selectedCartItems,
        promo: appliedPromo,
        __fromCart: true
      }
    })
  }, [appliedPromo, navigate, selectedCartItems])

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCartState onContinueShopping={() => navigate('/products')} t={t} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO title={t('seo.titleDetail')} noIndex />

      <div className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <CartHeader itemCount={cartItems.length} t={t} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <CartItems
              allAvailableSelected={allAvailableSelected}
              availableCount={availableIds.length}
              cartItems={cartItems}
              editingQty={editingQty}
              formatPrice={formatPrice}
              onQtyBlur={handleQtyBlur}
              onQtyChange={handleQtyChange}
              onQuantityStep={handleQuantityStep}
              onRemove={removeItem}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              selectedItems={selectedItems}
              t={t}
            />

            <CartSidebar
              appliedPromo={appliedPromo}
              discount={discount}
              formatPrice={formatPrice}
              isLoading={isLoading}
              onApplyPromo={handleApplyPromo}
              onCheckout={handleCheckout}
              onClearPromo={clearPromo}
              promoCode={promoCode}
              selectedCartItems={selectedCartItems}
              selectedQuantity={selectedQuantity}
              setPromoCode={setPromoCode}
              shipping={shipping}
              subtotal={subtotal}
              t={t}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart