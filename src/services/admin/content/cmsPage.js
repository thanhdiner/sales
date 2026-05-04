import { get, patch } from '@/utils/request'

export const getCmsPage = key => get(`admin/cms-pages/${key}`)

export const saveCmsPageDraft = (key, payload) => patch(`admin/cms-pages/${key}/draft`, payload)

export const publishCmsPage = (key, payload) => patch(`admin/cms-pages/${key}/publish`, payload)

export const scheduleCmsPage = (key, payload) => patch(`admin/cms-pages/${key}/schedule`, payload)
