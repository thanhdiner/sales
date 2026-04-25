import { get, patch, post } from '@/utils/request'

export const getProductCredentials = productId => get(`admin/product-credentials/product/${productId}`)

export const createProductCredentials = (productId, credentials) =>
  post(`admin/product-credentials/product/${productId}`, { credentials })

export const revealProductCredential = credentialId => get(`admin/product-credentials/${credentialId}/reveal`)

export const disableProductCredential = credentialId => patch(`admin/product-credentials/${credentialId}/disable`, {})
