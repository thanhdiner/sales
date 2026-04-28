import dayjs from 'dayjs'

export function normalizeFlashSaleResponse(res, { selectedCategory, uncategorizedLabel }) {
  if (Array.isArray(res.items)) {
    return {
      items: res.items,
      categories: res.categories || [],
      total: res.total || 0,
      currentPage: res.currentPage || 1
    }
  }

  const categoryMap = new Map()
  const items = []

  ;(res.flashSales || []).forEach(sale => {
    ;(sale.products || []).forEach(product => {
      const category = product.productCategory
      const categoryKey = category?.slug || category?._id

      if (categoryKey && !categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          key: categoryKey,
          label: category.title || uncategorizedLabel
        })
      }

      const isCategoryMatched = selectedCategory === 'all' || category?.slug === selectedCategory || category?._id === selectedCategory
      if (!isCategoryMatched) return

      items.push({
        product,
        saleMeta: {
          flashSaleId: sale._id,
          name: sale.name,
          status: sale.status,
          discountPercent: sale.discountPercent,
          startAt: sale.startAt,
          endAt: sale.endAt,
          soldQuantity: sale.soldQuantity,
          maxQuantity: sale.maxQuantity
        }
      })
    })
  })

  return {
    items,
    categories: Array.from(categoryMap.values()),
    total: items.length,
    currentPage: res.currentPage || 1
  }
}

export function groupFlashSaleItems(flashSaleItems) {
  const saleMap = new Map()

  flashSaleItems.forEach(item => {
    const saleMeta = item.saleMeta || {}
    const saleId = saleMeta.flashSaleId || 'flash-sale'

    if (!saleMap.has(saleId)) {
      saleMap.set(saleId, {
        _id: saleId,
        name: saleMeta.name || 'Flash Sale',
        status: saleMeta.status || 'active',
        discountPercent: saleMeta.discountPercent || 0,
        startAt: saleMeta.startAt,
        endAt: saleMeta.endAt,
        soldQuantity: saleMeta.soldQuantity || 0,
        maxQuantity: saleMeta.maxQuantity || 0,
        products: []
      })
    }

    saleMap.get(saleId).products.push(item.product)
  })

  return Array.from(saleMap.values())
}

export function calculateTimeLeft(endTime, currentTime) {
  const difference = new Date(endTime).getTime() - currentTime.getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}

export function getTimeUntilStart(startTime, currentTime) {
  const difference = new Date(startTime).getTime() - currentTime.getTime()

  if (difference <= 0) return null

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}

export const formatDateTime = dateTime => dayjs(dateTime).format('DD/MM/YYYY HH:mm')

export function getProgressPercent(sale) {
  if (!sale?.maxQuantity || sale.maxQuantity <= 0) return 0
  return Math.min(100, Math.round((sale.soldQuantity / sale.maxQuantity) * 100))
}

export function formatFlashSaleCurrency(amount, language) {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Math.round(amount || 0))
}
