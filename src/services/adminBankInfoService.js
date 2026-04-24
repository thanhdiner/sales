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

export const getBankInfos = params => get(`admin/bank-infos${getBankInfosQueryString(params)}`)
export const getActiveBankInfo = () => get('admin/bank-infos/active')
export const getBankInfoDetail = id => get(`admin/bank-infos/${id}`)
export const createBankInfo = formData => post('admin/bank-infos', formData)
export const updateBankInfo = (id, formData) => patch(`admin/bank-infos/${id}`, formData)
export const deleteBankInfo = (id, params) => patch(`admin/bank-infos/${id}/delete`, params)
export const activateBankInfo = (id, payload) => patch(`admin/bank-infos/${id}/activate`, payload)
