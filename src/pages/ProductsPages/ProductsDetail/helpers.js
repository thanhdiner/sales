export const formatPrice = price => {
  if (!price && price !== 0) return '0₫'

  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

export const getProductId = product => product?._id || product?.id || ''

export const getProductPricing = (product, flashSaleInfo) => {
  if (!product) {
    return {
      priceOrigin: 0,
      priceNew: 0,
      discountPercent: 0,
      savings: 0,
      isFlashSale: false
    }
  }

  let priceOrigin = Number(product.price) || 0
  let priceNew = priceOrigin
  let discountPercent = 0
  let isFlashSale = false

  if (flashSaleInfo && flashSaleInfo.salePrice) {
    priceNew = Number(flashSaleInfo.salePrice) || priceOrigin
    discountPercent = Number(flashSaleInfo.discountPercent) || 0
    isFlashSale = true
  } else {
    discountPercent = Number(product.discountPercentage) || 0
    priceNew = Math.round((priceOrigin * (100 - discountPercent)) / 100)
  }

  return {
    priceOrigin,
    priceNew,
    discountPercent,
    savings: priceOrigin - priceNew,
    isFlashSale
  }
}

export const getGalleryImages = product => {
  if (!product) return []

  return Array.from(
    new Set([product.thumbnail, ...(product.images || []), ...(product.sampleImages || []), ...(product.galleryImages || [])].filter(Boolean))
  )
}

export const getMaxAvailable = (product, cartItems = []) => {
  if (!product) return null

  const productId = getProductId(product)
  const cartItem = cartItems.find(item => item.productId === productId)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  return Math.max(0, (Number(product.stock) || 0) - quantityInCart)
}

export const getProductFeatures = product =>
  (Array.isArray(product?.features) ? product.features : []).filter(feature => typeof feature === 'string' && feature.trim() !== '')

export const formatPromotionDate = value => new Date(value).toLocaleDateString('vi-VN')
