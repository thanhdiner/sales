import { get, patch, post } from '@/utils/request'

const getBankInfosQueryString = params => {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set('page', params.page)
  if (params?.limit) searchParams.set('limit', params.limit)
  if (params?.keyword) searchParams.set('keyword', params.keyword)
  if (params?.isActive !== undefined && params?.isActive !== '') {
    searchParams.set('isActive', params.isActive)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getBankInfos = params => {
  return get(`admin/bank-infos${getBankInfosQueryString(params)}`)
}

export const getActiveBankInfo = () => {
  return get('admin/bank-infos/active')
}

export const getBankInfoDetail = id => {
  return get(`admin/bank-infos/${id}`)
}

export const createBankInfo = formData => {
  return post('admin/bank-infos', formData)
}

export const updateBankInfo = (id, formData) => {
  return patch(`admin/bank-infos/${id}`, formData)
}

export const deleteBankInfo = (id, params) => {
  return patch(`admin/bank-infos/${id}/delete`, params)
}

export const activateBankInfo = (id, payload) => {
  return patch(`admin/bank-infos/${id}/activate`, payload)
}
