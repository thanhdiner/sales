import { get } from '@/utils/clientRequest'

export const getCmsPage = key => get(`cms-pages/${key}`)
