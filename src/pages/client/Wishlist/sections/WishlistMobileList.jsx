import WishlistProductCard from '../components/WishlistProductCard'

function WishlistMobileList({ addingToCart, filteredWishlist, formatPrice, language, onAddToCart, onRemove, t }) {
  return (
    <section className="space-y-3 md:hidden">
      {filteredWishlist.map(item => (
        <WishlistProductCard
          key={item.productId}
          addingToCart={addingToCart[item.productId]}
          formatPrice={formatPrice}
          item={item}
          language={language}
          onAddToCart={onAddToCart}
          onRemove={onRemove}
          t={t}
        />
      ))}
    </section>
  )
}

export default WishlistMobileList
