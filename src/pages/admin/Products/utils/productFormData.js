import { removeVietnameseTones } from '@/utils/removeVietnameseTones'

export const getProductFieldId = value => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') return value._id || value.id || value.value || ''
  return String(value)
}

export const getExistingProductImageUrl = file => {
  if (!file || file.originFileObj) return ''
  return file.url || file.thumbUrl || ''
}

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value)
  }
}

const appendProductImages = (formData, imageFileList = []) => {
  imageFileList.forEach(fileItem => {
    const file = fileItem?.originFileObj
    if (file) formData.append('images', file)
  })
}

const appendProductFeatures = (formData, features, includeEmptyMarker = false) => {
  if (!features) return
  if (features.length > 0) {
    features.forEach(feature => formData.append('features', feature))
    return
  }
  if (includeEmptyMarker) formData.append('features', '')
}

const appendProductTimeRange = (formData, timeRange = []) => {
  const [timeStart, timeFinish] = timeRange
  if (timeStart) formData.append('timeStart', timeStart.toISOString())
  if (timeFinish) formData.append('timeFinish', timeFinish.toISOString())
}

const appendCommonProductFields = (formData, values, { includeTitleNoAccent = false } = {}) => {
  formData.append('title', values.title)
  if (includeTitleNoAccent) formData.append('titleNoAccent', removeVietnameseTones(values.title))
  formData.append('productCategory', getProductFieldId(values.productCategory))
  formData.append('price', values.price)
  formData.append('costPrice', values.costPrice)
  formData.append('discountPercentage', values.discountPercentage || 0)
  formData.append('stock', values.stock || 0)
  formData.append('deliveryType', values.deliveryType || 'manual')
  formData.append('deliveryInstructions', values.deliveryInstructions || '')
  formData.append('description', values.description || '')
  formData.append('status', values.status || 'active')
  formData.append('slug', values.slug || '')
  formData.append('content', values.content || '')
  formData.append('isTopDeal', values.isTopDeal ? 'true' : 'false')
  formData.append('isFeatured', values.isFeatured ? 'true' : 'false')
  formData.append('deliveryEstimateDays', values.deliveryEstimateDays || 0)

  appendIfPresent(formData, 'position', values.position)
  appendProductTimeRange(formData, values.timeRange)

  if (values.translations != null) {
    formData.append('translations', JSON.stringify(values.translations))
  }
}

export const buildCreateProductFormData = values => {
  const formData = new FormData()
  const thumbnailFile = values.thumbnail?.[0]?.originFileObj

  if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
  appendProductImages(formData, values.images || [])
  appendProductFeatures(formData, values.features)
  appendCommonProductFields(formData, values, { includeTitleNoAccent: true })

  return formData
}

export const buildEditProductFormData = (values, { oldThumbnail = '', oldImages = [] } = {}) => {
  const formData = new FormData()
  const thumbnailFile = values.thumbnail?.[0]?.originFileObj

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
    formData.append('oldImage', oldThumbnail)
  } else if (typeof values.thumbnail === 'string') {
    formData.append('thumbnail', values.thumbnail)
  }

  const imageFileList = values.images || []
  const existingImages = imageFileList.map(getExistingProductImageUrl).filter(Boolean)
  const deletedImages = oldImages.filter(url => !existingImages.includes(url))

  appendProductImages(formData, imageFileList)
  formData.append('existingImages', JSON.stringify(existingImages))
  formData.append('oldImages', JSON.stringify(oldImages))
  formData.append('deleteImages', JSON.stringify(deletedImages))
  appendProductFeatures(formData, values.features, true)
  appendCommonProductFields(formData, values)

  return formData
}

