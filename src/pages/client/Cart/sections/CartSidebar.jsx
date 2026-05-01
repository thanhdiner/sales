import OrderSummary from '../components/OrderSummary'
import PromoCodeBox from '../components/PromoCodeBox'

function CartSidebar({
  appliedPromo,
  discount,
  formatPrice,
  isLoading,
  onApplyPromo,
  onCheckout,
  onClearPromo,
  promoCode,
  selectedCartItems,
  selectedQuantity,
  setPromoCode,
  shipping,
  subtotal,
  t,
  total
}) {
  return (
    <div className="lg:col-span-4">
      <div className="sticky top-24 space-y-4">
        <PromoCodeBox
          appliedPromo={appliedPromo}
          isLoading={isLoading}
          onApplyPromo={onApplyPromo}
          onClearPromo={onClearPromo}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          t={t}
        />

        <OrderSummary
          discount={discount}
          formatPrice={formatPrice}
          onCheckout={onCheckout}
          selectedCartItems={selectedCartItems}
          selectedQuantity={selectedQuantity}
          shipping={shipping}
          subtotal={subtotal}
          t={t}
          total={total}
        />
      </div>
    </div>
  )
}

export default CartSidebar
