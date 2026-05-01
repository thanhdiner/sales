import CartItemCard from '../components/CartItemCard'
import SelectAllBar from './SelectAllBar'

function CartItems({
  allAvailableSelected,
  availableCount,
  cartItems,
  editingQty,
  formatPrice,
  onQtyBlur,
  onQtyChange,
  onQuantityStep,
  onRemove,
  onSelectAll,
  onSelectItem,
  selectedItems,
  t
}) {
  return (
    <div className="lg:col-span-8">
      <SelectAllBar
        allAvailableSelected={allAvailableSelected}
        availableCount={availableCount}
        onSelectAll={onSelectAll}
        selectedCount={selectedItems.size}
        t={t}
      />

      <div className="space-y-3">
        {cartItems.map(item => (
          <CartItemCard
            editingQty={editingQty}
            formatPrice={formatPrice}
            isSelected={selectedItems.has(item.productId)}
            item={item}
            key={item.productId}
            onQtyBlur={onQtyBlur}
            onQtyChange={onQtyChange}
            onQuantityStep={onQuantityStep}
            onRemove={onRemove}
            onSelect={onSelectItem}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

export default CartItems