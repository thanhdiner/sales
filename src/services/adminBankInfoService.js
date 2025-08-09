import { get, patch, post } from '@/utils/request'

export const getBankInfos = params => get('admin/bank-infos', params)
export const getActiveBankInfo = () => get('admin/bank-infos/active')
export const getBankInfoDetail = id => get(`admin/bank-infos/${id}`)
export const createBankInfo = formData => post('admin/bank-infos', formData)
export const updateBankInfo = (id, formData) => patch(`admin/bank-infos/${id}`, formData)
export const deleteBankInfo = (id, params) => patch(`admin/bank-infos/${id}/delete`, params)
export const activateBankInfo = id => patch(`admin/bank-infos/${id}/activate`)
