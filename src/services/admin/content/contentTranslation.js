import { post } from '@/utils/request'

export const translateContentToEnglish = payload => post('admin/content-translation/to-english', payload)
