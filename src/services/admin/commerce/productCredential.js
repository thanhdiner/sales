import { get, patch, post } from '@/utils/request'

export const getProductCredentials = productId => {
  return get(`admin/product-credentials/product/${productId}`)
}

export const createProductCredentials = (productId, credentials) => {
  return post(`admin/product-credentials/product/${productId}`, { credentials })
}

export const revealProductCredential = credentialId => {
  return get(`admin/product-credentials/${credentialId}/reveal`)
}

export const disableProductCredential = credentialId => {
  return patch(`admin/product-credentials/${credentialId}/disable`, {})
}
