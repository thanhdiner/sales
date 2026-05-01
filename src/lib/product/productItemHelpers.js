import { formatVND } from '@/utils/formatCurrency'

export const getProductPricing = (product) => {
  const discountVal = product.discountPercent || product.discountPercentage || 0
  const originalPrice = product.price || 0
  
  const salePriceRaw = product.salePrice !== undefined && product.salePrice !== null
    ? product.salePrice
    : (originalPrice * (100 - discountVal)) / 100

  const priceNew = formatVND(salePriceRaw)
  const price = formatVND(originalPrice)

  const savingsRaw = product.savings !== undefined
    ? product.savings
    : originalPrice && discountVal
    ? originalPrice - (originalPrice * (100 - discountVal)) / 100
    : 0

  return {
    discountVal,
    priceNew,
    price,
    savings: savingsRaw,
    salePriceRaw
  }
}

export const getProductRibbon = (discountVal) => {
  if (discountVal > 0) {
    return {
      text: `Giảm ${discountVal}%`,
      color: '#E01020'
    }
  }
  return { text: '', color: '' }
}
