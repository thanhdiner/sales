export const getLocaleFromLanguage = language => {
  return language?.startsWith('en') ? 'en-US' : 'vi-VN'
}

export const formatPrice = (price, language = 'vi') => {
  if (!price && price !== 0) return '0₫'

  return price.toLocaleString(getLocaleFromLanguage(language), {
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
    new Set(
      [product.thumbnail, ...(product.images || []), ...(product.sampleImages || []), ...(product.galleryImages || [])].filter(Boolean)
    )
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

export const formatPromotionDate = (value, language = 'vi') => {
  return new Date(value).toLocaleDateString(getLocaleFromLanguage(language))
}

export const getPlainText = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const getProductSoldCount = product => Number(product?.soldQuantity || product?.sold || product?.totalSold || 0)

export const getProductReviewCount = product => Number(product?.reviewCount || product?.reviewsCount || product?.totalReviews || 0)

export const inferDigitalProductInfo = (product, t) => {
  const textSource = [product?.title, product?.description, ...(Array.isArray(product?.features) ? product.features : [])].join(' ')
  const durationMatch = textSource.match(/(\d+)\s*(tháng|month|months|năm|year|years)/i)
  const deviceMatch = textSource.match(/(\d+)\s*(thiết bị|device|devices)/i)
  const isUpgrade = /nâng cấp|upgrade/i.test(textSource)
  const isPrivate = /dùng riêng|private/i.test(textSource)
  const deliveryText =
    product?.deliveryType === 'instant_account' || Number(product?.deliveryEstimateDays || 0) === 0
      ? t('productDetail.digitalInfo.values.automaticDelivery')
      : t('productDetail.digitalInfo.values.staffProcessing')

  return [
    {
      label: t('productDetail.digitalInfo.accountType'),
      value: isUpgrade
        ? t('productDetail.digitalInfo.values.accountUpgrade')
        : isPrivate
          ? t('productDetail.digitalInfo.values.privateAccount')
          : t('productDetail.digitalInfo.values.digitalAccount')
    },
    {
      label: t('productDetail.digitalInfo.duration'),
      value: durationMatch ? durationMatch[0] : t('productDetail.digitalInfo.values.byProductPackage')
    },
    {
      label: t('productDetail.digitalInfo.devices'),
      value: deviceMatch ? deviceMatch[0] : t('productDetail.digitalInfo.values.byProductPackage')
    },
    {
      label: t('productDetail.digitalInfo.warranty'),
      value: t('productDetail.digitalInfo.values.standardWarranty')
    },
    {
      label: t('productDetail.digitalInfo.delivery'),
      value: deliveryText
    },
    {
      label: t('productDetail.digitalInfo.support'),
      value: t('productDetail.digitalInfo.values.liveSupport')
    }
  ]
}
