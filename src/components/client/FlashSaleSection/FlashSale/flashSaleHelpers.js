export function mapFlashSaleProducts(products, discountPercent, flashSaleId) {
  if (!products) return []
  return products.map(product => {
    const salePrice = product.price && discountPercent ? Math.round(product.price * (1 - discountPercent / 100)) : product.price
    const savings = product.price && discountPercent ? product.price - salePrice : 0
    return {
      ...product,
      salePrice,
      savings,
      discountPercent,
      isFlashSale: true,
      flashSaleId
    }
  })
}
